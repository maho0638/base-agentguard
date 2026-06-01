# Base AgentGuard
Live demo: https://maho0638.github.io/base-agentguard/

Repository: https://github.com/maho0638/base-agentguard

Base AgentGuard is an open-source safety studio for AI agents that use Base MCP.
It helps builders review wallet actions before approval, score risky agent
intents, generate send_calls-ready receipts, and document custom plugin flows
for Base mainnet and Base Sepolia.

The project follows the Base AI agents documentation pattern:

- connect an assistant to Base MCP
- detect the user's Base Account wallet
- prepare unsigned calldata or payment intent
- map the prepared response to `send_calls`
- require user approval for every write action

Official Base references:

- Base MCP overview: https://docs.base.org/ai-agents
- Base MCP quickstart: https://docs.base.org/ai-agents/quickstart
- Custom plugins: https://docs.base.org/ai-agents/plugins/custom-plugins

## Why this project exists

AI agents can now help users send funds, swap tokens, sign messages, execute
contract calls, and pay x402-enabled APIs. Those workflows are powerful, but
they need a visible review layer. Base AgentGuard is that layer for builders:
it turns an agent request into a readable intent receipt before the user approves
anything.

## Features

- Base mainnet and Base Sepolia RPC health checks
- Agent action scoring for sends, swaps, contract calls, signatures, and x402
- x402 payment caps and endpoint review receipts
- Builder Code attribution planning for agent transactions
- High-risk term detection for approvals, permits, upgrades, bridges, claims,
  proxies, and admin calls
- Base MCP receipt preview for `send_calls`
- Custom plugin markdown spec in `plugins/base-agentguard.md`
- Solidity registry sketch in `contracts/BaseAgentIntentRegistry.sol`
- OpenAI OSS program application copy in `docs/openai-oss-application.md`
- Base launch and funding playbook in `docs/base-launch-playbook.md`
- Impact tracking in `docs/impact-metrics.md`
- No API keys, no custody, no seed phrase flow, and no hidden transaction
  execution

## Quickstart

```bash
npm start
```

Then open:

```txt
http://localhost:4173
```

For a no-server preview, open `index.html` directly in a browser.

## Validate

```bash
npm run validate
```

The validation script checks that the static app, plugin spec, example receipt,
license, and docs are present and internally consistent.

## Repository layout

```txt
.
|-- index.html
|-- styles.css
|-- app.js
|-- data/risk-rules.json
|-- examples/send-calls.receipt.json
|-- plugins/base-agentguard.md
|-- contracts/BaseAgentIntentRegistry.sol
|-- docs/openai-oss-application.md
|-- docs/openai-maintainer-evidence.md
|-- docs/base-build-notes.md
|-- docs/base-launch-playbook.md
|-- docs/impact-metrics.md
|-- docs/security-and-trust.md
|-- docs/source-review.md
|-- ROADMAP.md
|-- CONTRIBUTING.md
|-- SECURITY.md
|-- LICENSE
`-- tools/
```

## Suggested Base builder path

1. Publish this as a public GitHub repository.
2. Deploy the static app to Netlify, Vercel, or GitHub Pages.
3. Deploy `BaseAgentIntentRegistry.sol` to Base Sepolia.
4. Add the deployed contract address and transaction hash to this README.
5. Register a Builder Code on Base.dev and add it to the attribution plan.
6. Create issues for risk rules, x402 review, plugin examples, and Base Account
   onboarding.
7. Share the project as a Base AI agent safety tool, not as an airdrop claim
   page.

## Security posture

This MVP is read-only by default. It does not custody funds, does not ask for
private keys, does not execute swaps, does not sign messages, and does not send
transactions. It produces review receipts and examples that a user or assistant
can inspect before moving into Base MCP approval flows.

## License

MIT
