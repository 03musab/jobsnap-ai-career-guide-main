import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const outputPath = process.argv[2] ?? 'security-report.md';
const auditTargets = [
  { name: 'Root application', directory: process.cwd() },
  { name: 'AI job platform', directory: path.join(process.cwd(), 'ai-job-platform') },
];
const failures = [];
const findings = [];
const auditSummaries = [];
const sarifDirectory = process.env.CODEQL_SARIF_DIR;

function cleanMarkdown(value) {
  return String(value ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function severityFromScore(score, level) {
  const numericScore = Number(score);
  if (Number.isFinite(numericScore)) {
    if (numericScore >= 9) return 'CRITICAL';
    if (numericScore >= 7) return 'HIGH';
    if (numericScore >= 4) return 'MEDIUM';
    return 'LOW';
  }

  if (level === 'error') return 'HIGH';
  if (level === 'warning') return 'MEDIUM';
  return 'LOW';
}

function collectSarifFiles(directory) {
  if (!directory || !existsSync(directory)) return [];

  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSarifFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.sarif')) {
      files.push(entryPath);
    }
  }
  return files;
}

function collectCodeQLFindings() {
  const sarifFiles = collectSarifFiles(sarifDirectory);
  if (!sarifFiles.length) {
    failures.push('CodeQL did not produce a SARIF report.');
    return;
  }

  for (const file of sarifFiles) {
    let document;
    try {
      document = JSON.parse(readFileSync(file, 'utf8'));
    } catch (error) {
      failures.push(`Could not read CodeQL SARIF file ${path.basename(file)}: ${error.message}`);
      continue;
    }

    for (const run of document.runs ?? []) {
      const rules = new Map((run.tool?.driver?.rules ?? []).map((rule) => [rule.id, rule]));
      for (const result of run.results ?? []) {
        const rule = rules.get(result.ruleId);
        const location = result.locations?.[0]?.physicalLocation;
        const uri = location?.artifactLocation?.uri ?? 'Unknown file';
        const line = location?.region?.startLine;
        const message = result.message?.text ?? result.message?.markdown ?? 'No details provided.';
        const score = rule?.properties?.['security-severity'] ?? result.properties?.['security-severity'];
        findings.push({
          source: 'CodeQL',
          severity: severityFromScore(score, result.level),
          issue: cleanMarkdown(message),
          location: `${cleanMarkdown(uri)}${line ? `:${line}` : ''}`,
          details: `Rule: ${cleanMarkdown(result.ruleId ?? 'unspecified')}`,
        });
      }
    }
  }
}

function collectDependencyFindings() {
  for (const target of auditTargets) {
    if (!existsSync(path.join(target.directory, 'package-lock.json'))) continue;

    const audit = spawnSync('npm', ['audit', '--json'], {
      cwd: target.directory,
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      shell: process.platform === 'win32',
    });

    if (audit.error) {
      failures.push(`${target.name} npm audit could not run: ${audit.error.message}`);
      auditSummaries.push({ name: target.name, status: 'Could not run' });
      continue;
    }

    let report;
    try {
      report = JSON.parse(audit.stdout);
    } catch {
      const reason = audit.stderr?.trim() || 'npm returned invalid or empty JSON.';
      failures.push(`${target.name} npm audit failed: ${cleanMarkdown(reason)}`);
      auditSummaries.push({ name: target.name, status: 'Failed to produce a valid report' });
      continue;
    }

    const totals = report.metadata?.vulnerabilities ?? {};
    const count = Object.values(totals).reduce(
      (sum, value) => sum + (Number(value) || 0),
      0,
    );
    auditSummaries.push({
      name: target.name,
      status: audit.status === 0 ? 'Completed' : count ? 'Completed; advisories found' : 'Failed',
      counts: totals,
    });

    if (audit.status !== 0 && !count) {
      const reason = audit.stderr?.trim() || `npm exited with status ${audit.status ?? 'unknown'}.`;
      failures.push(`${target.name} npm audit failed: ${cleanMarkdown(reason)}`);
    }

    for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
      const advisory = (vulnerability.via ?? []).find((item) => typeof item === 'object') ?? {};
      findings.push({
        source: `${target.name} npm audit`,
        severity: String(vulnerability.severity ?? 'unknown').toUpperCase(),
        issue: cleanMarkdown(advisory.title ?? `Vulnerable dependency: ${vulnerability.name}`),
        location: `Dependency: ${cleanMarkdown(vulnerability.name)}`,
        details: [
          advisory.url ? `[Advisory](${advisory.url})` : '',
          vulnerability.range ? `Affected: ${cleanMarkdown(vulnerability.range)}` : '',
          vulnerability.fixAvailable ? 'A fix is available.' : 'No automatic fix is reported.',
        ].filter(Boolean).join(' · '),
      });
    }
  }
}

collectCodeQLFindings();
collectDependencyFindings();

const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
findings.sort((left, right) => severityOrder.indexOf(left.severity) - severityOrder.indexOf(right.severity));

const report = [
  '# Automated security scan',
  '',
  `- Commit: \`${process.env.GITHUB_SHA ?? 'local run'}\``,
  `- Ref: \`${process.env.GITHUB_REF_NAME ?? 'local run'}\``,
  `- Generated: ${new Date().toISOString()}`,
  '- Scanners: GitHub CodeQL (JavaScript/TypeScript and Python), npm audit (root and nested lockfiles)',
  '',
  '## Dependency audit status',
  '',
  '| Project | Status | Critical | High | Moderate | Low |',
  '|---|---|---:|---:|---:|---:|',
  ...auditSummaries.map((summary) => {
    const counts = summary.counts ?? {};
    return `| ${summary.name} | ${summary.status} | ${counts.critical ?? 0} | ${counts.high ?? 0} | ${counts.moderate ?? counts.medium ?? 0} | ${counts.low ?? 0} |`;
  }),
  '',
  '## Findings',
  '',
  findings.length
    ? '| Severity | Source | Location | Finding | Details |'
    : 'No findings were reported by the available scans.',
  ...(findings.length
    ? [
        '|---|---|---|---|---|',
        ...findings.map((finding) =>
          `| ${finding.severity} | ${finding.source} | \`${finding.location}\` | ${finding.issue} | ${finding.details} |`,
        ),
      ]
    : []),
  '',
];

if (failures.length) {
  report.push('## Scan errors', '', ...failures.map((failure) => `- ${failure}`), '');
}

writeFileSync(outputPath, `${report.join('\n')}\n`, 'utf8');
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report.join('\n')}\n`, 'utf8');
}
if (failures.length) process.exitCode = 1;
