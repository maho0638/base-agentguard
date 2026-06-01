# Contributing

Thanks for helping improve Base AgentGuard.

Good first contributions:

- add new high-risk terms to `data/risk-rules.json`
- improve the Base MCP plugin mapping in `plugins/base-agentguard.md`
- add examples for x402 payment review
- add Base Sepolia deployment notes
- add tests for receipt generation and risk scoring
- improve accessibility, mobile layout, and copy clarity

## Local workflow

```bash
npm start
npm run validate
```

## Pull request checklist

- The change keeps the app non-custodial and read-only by default.
- The change does not request seed phrases or private keys.
- Write actions remain described as user-approved Base MCP flows.
- New examples avoid real user funds and use test addresses where possible.
- Documentation explains risk in plain language.

## Security reports

Open a private security advisory if the repository host supports it. If not,
open an issue that describes the affected file and impact without posting
private keys, secrets, or live exploitable user data.
