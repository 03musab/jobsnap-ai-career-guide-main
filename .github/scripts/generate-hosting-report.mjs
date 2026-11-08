import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputPath = process.argv[2] ?? 'hosting-readiness.md';
const findings = [];
const environmentNames = new Set();
const apiReferences = [];
let vercelConfig;
let packageConfig;

function addFinding(priority, title, evidence, action) {
  findings.push({ priority, title, evidence, action });
}

function readJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    addFinding('BLOCKER', `Could not read ${label}`, error.message, `Correct ${label} and rerun this report.`);
    return null;
  }
}

function collectSourceFiles(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectSourceFiles(entryPath));
    else if (/\.(?:js|mjs|cjs|ts|tsx)$/.test(entry.name)) files.push(entryPath);
  }
  return files;
}

function relativePath(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

const packagePath = path.join(root, 'package.json');
if (existsSync(packagePath)) packageConfig = readJson(packagePath, 'package.json');
else addFinding('BLOCKER', 'Root package.json is missing', 'Vercel cannot infer the root build scripts.', 'Add or select the correct Vercel project root.');

const vercelPath = path.join(root, 'vercel.json');
if (existsSync(vercelPath)) {
  vercelConfig = readJson(vercelPath, 'vercel.json');
  if (vercelConfig) {
    addFinding('PASS', 'Vercel configuration is valid JSON', 'vercel.json exists and parses successfully.', 'No change required for JSON syntax.');
  }
} else {
  addFinding('TODO', 'No vercel.json is present', 'Vercel may still auto-detect the project framework.', 'Confirm the Vercel project uses the Vite preset, `npm run build`, and `dist` as its output directory.');
}

if (packageConfig?.scripts?.build) {
  addFinding('PASS', 'A production build command is defined', `package.json defines \`${packageConfig.scripts.build}\`.`, 'Confirm this command succeeds in the Vercel build environment.');
} else {
  addFinding('BLOCKER', 'A production build command is missing', 'The root package.json does not define scripts.build.', 'Add the production build script or configure Vercel to use the correct package root.');
}

if (existsSync(path.join(root, 'package-lock.json'))) {
  addFinding('PASS', 'Root npm lockfile is present', 'package-lock.json is available for reproducible installs.', 'No change required.');
} else {
  addFinding('TODO', 'Root npm lockfile is missing', 'A reproducible npm install cannot be guaranteed.', 'Commit package-lock.json and use `npm ci` in the deployment build.');
}

const apiDirectory = path.join(root, 'api');
const apiFiles = collectSourceFiles(apiDirectory);
if (apiFiles.length) {
  addFinding(
    'TODO',
    'Verify Vercel serverless API deployment',
    `${apiFiles.length} source file(s) exist under api/. The repository also contains standalone Express servers.`,
    'Confirm each required endpoint under api/ exports a Vercel-compatible function and test it on a Vercel preview deployment. The standalone server.ts/server.js processes are not started by a static Vite deployment.',
  );
} else {
  addFinding('TODO', 'No Vercel API functions were found', 'The api/ directory contains no supported source files.', 'Confirm the deployed site does not need backend endpoints, or move the backend to a Vercel-compatible function/runtime.');
}

const sourceFiles = [
  ...collectSourceFiles(path.join(root, 'api')),
  ...collectSourceFiles(path.join(root, 'services')),
  ...['server.ts', 'server.js'].map((file) => path.join(root, file)).filter(existsSync),
];

for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/process\.env(?:\.([A-Z][A-Z0-9_]*)|\[['"]([A-Z][A-Z0-9_]*)['"]\])/g)) {
    environmentNames.add(match[1] ?? match[2]);
  }
  if (
    /writeFileSync|writeFile|appendFileSync|appendFile/.test(source)
    && (/SUBSCRIBERS_(?:JSON|CSV)/.test(source) || /data[\\/].*(?:json|csv)/i.test(source))
  ) {
    apiReferences.push(path.relative(root, file));
  }
  const localhostRedirect = source
    .split(/\r?\n/)
    .some((line) => /localhost|127\.0\.0\.1/i.test(line) && /return_url|redirect_url|redirect_uri|base_url/i.test(line));
  if (localhostRedirect) {
    addFinding(
      'HIGH',
      'A backend source references localhost',
      `A deployment-facing redirect references localhost in \`${relativePath(file)}\`.`,
      'Replace deployment-facing localhost URLs with production configuration before launch.',
    );
  }
  if (/sandbox\.cashfree\.com/i.test(source)) {
    addFinding(
      'HIGH',
      'Cashfree sandbox endpoint is configured',
      `Sandbox Cashfree URL found in \`${relativePath(file)}\`.`,
      'Choose and configure the intended Cashfree environment and use matching production credentials before accepting live payments.',
    );
  }
}

if (environmentNames.size) {
  addFinding(
    'TODO',
    'Configure production environment variables',
    `Code references: ${[...environmentNames].sort().map((name) => `\`${name}\``).join(', ')}.`,
    'Set only the variables required for production in Vercel Project Settings → Environment Variables. Do not commit secret values.',
  );
}

if (apiReferences.length) {
  addFinding(
    'HIGH',
    'Subscription data is written to local files',
    `File-backed data writes were found in: ${[...new Set(apiReferences)].map((file) => `\`${relativePath(file)}\``).join(', ')}.`,
    'Move subscription persistence to durable external storage; serverless function filesystems are not a durable database.',
  );
}

if (vercelConfig?.rewrites?.some((rewrite) => rewrite.source === '/(.*)' && rewrite.destination === '/index.html')) {
  addFinding(
    'TODO',
    'Review the catch-all SPA rewrite',
    'vercel.json rewrites every unmatched path to /index.html.',
    'Verify direct navigation and every /api/* route on a Vercel preview deployment so the SPA fallback does not mask missing routes.',
  );
}

addFinding(
  'TODO',
  'Run production smoke tests on a Vercel preview',
  'Static inspection cannot verify runtime configuration, environment variables, API behavior, or custom-domain DNS.',
  'Test page refresh/deep links, signup/email, payment flow in the intended environment, API responses, and custom-domain HTTPS before launch.',
);

const priorityOrder = ['BLOCKER', 'HIGH', 'TODO', 'PASS'];
findings.sort((left, right) => priorityOrder.indexOf(left.priority) - priorityOrder.indexOf(right.priority));

const report = [
  '# Vercel hosting readiness checklist',
  '',
  `- Commit: \`${process.env.GITHUB_SHA ?? 'local run'}\``,
  `- Ref: \`${process.env.GITHUB_REF_NAME ?? 'local run'}\``,
  `- Generated: ${new Date().toISOString()}`,
  '- Mode: report only; hosting configuration and application files are not changed by this workflow.',
  '',
  '## Changes and checks to complete',
  '',
  '| Priority | Check | Evidence | Recommended action |',
  '|---|---|---|---|',
  ...findings.map(({ priority, title, evidence, action }) =>
    `| ${priority} | ${title} | ${evidence.replace(/\|/g, '\\|')} | ${action.replace(/\|/g, '\\|')} |`,
  ),
  '',
];

writeFileSync(outputPath, `${report.join('\n')}\n`, 'utf8');
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report.join('\n')}\n`, 'utf8');
}
