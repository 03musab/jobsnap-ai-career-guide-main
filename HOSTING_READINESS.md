# Vercel hosting readiness checklist

- Commit: `local run`
- Ref: `local run`
- Generated: 2026-11-07T20:44:26.092Z
- Mode: report only; hosting configuration and application files are not changed by this workflow.

## Changes and checks to complete

| Priority | Check | Evidence | Recommended action |
|---|---|---|---|
| HIGH | A backend source references localhost | A deployment-facing redirect references localhost in `api/cashfree-create-order.ts`. | Replace deployment-facing localhost URLs with production configuration before launch. |
| HIGH | Cashfree sandbox endpoint is configured | Sandbox Cashfree URL found in `api/cashfree-create-order.ts`. | Choose and configure the intended Cashfree environment and use matching production credentials before accepting live payments. |
| HIGH | Cashfree sandbox endpoint is configured | Sandbox Cashfree URL found in `api/cashfree-verify.ts`. | Choose and configure the intended Cashfree environment and use matching production credentials before accepting live payments. |
| HIGH | Subscription data is written to local files | File-backed data writes were found in: `services/emailDispatcher.js`. | Move subscription persistence to durable external storage; serverless function filesystems are not a durable database. |
| TODO | Verify Vercel serverless API deployment | 3 source file(s) exist under api/. The repository also contains standalone Express servers. | Confirm each required endpoint under api/ exports a Vercel-compatible function and test it on a Vercel preview deployment. The standalone server.ts/server.js processes are not started by a static Vite deployment. |
| TODO | Configure production environment variables | Code references: `CASHFREE_APP_ID`, `CASHFREE_CLIENT_ID`, `CASHFREE_CLIENT_SECRET`, `CASHFREE_SECRET_KEY`, `NODE_ENV`, `PORT`, `RESEND_API_KEY`, `TEST_EMAIL`. | Set only the variables required for production in Vercel Project Settings → Environment Variables. Do not commit secret values. |
| TODO | Review the catch-all SPA rewrite | vercel.json rewrites every unmatched path to /index.html. | Verify direct navigation and every /api/* route on a Vercel preview deployment so the SPA fallback does not mask missing routes. |
| TODO | Run production smoke tests on a Vercel preview | Static inspection cannot verify runtime configuration, environment variables, API behavior, or custom-domain DNS. | Test page refresh/deep links, signup/email, payment flow in the intended environment, API responses, and custom-domain HTTPS before launch. |
| PASS | Vercel configuration is valid JSON | vercel.json exists and parses successfully. | No change required for JSON syntax. |
| PASS | A production build command is defined | package.json defines `vite build`. | Confirm this command succeeds in the Vercel build environment. |
| PASS | Root npm lockfile is present | package-lock.json is available for reproducible installs. | No change required. |

