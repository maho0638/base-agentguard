# Security Policy

Base AgentGuard is non-custodial and read-only by default. It must never ask for
seed phrases, private keys, or hidden wallet approvals.

## Reporting

Open a private security advisory if available on the repository host. If not,
open an issue with a high-level description and avoid posting exploitable live
user data.

## Scope

In scope:

- hidden execution risks
- unsafe receipt generation
- x402 payment cap mistakes
- misleading transaction summaries
- unsafe plugin instructions

Out of scope:

- fake airdrop claims from unrelated websites
- issues caused by modified local copies outside this repository
