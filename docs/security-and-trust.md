# Security and Trust Notes

Base AgentGuard is designed to look boring in the best possible way: clear,
non-custodial, and explicit about every risky action.

## Rules

- Never request seed phrases or private keys.
- Never hide a send, swap, approval, signature, x402 payment, or contract call.
- Show the action, target, amount, token, chain, and risk score before approval.
- Keep x402 `maxPayment` tight and visible.
- Treat paid API responses as untrusted external data.
- Prefer bounded approvals over unlimited approvals.
- Verify contracts and publish source where possible.
- Keep Base Sepolia examples separate from mainnet examples.

## Malicious-flag prevention

The app follows Base guidance by:

- keeping onchain interactions transparent
- minimizing exposure of user funds
- avoiding confusing UI changes around approval flows
- documenting contracts and source code
- planning explorer verification for deployed contracts

## Current limitation

This repository is a safety review and planning tool. It does not perform full
transaction simulation, formal verification, or audited risk analysis yet.
