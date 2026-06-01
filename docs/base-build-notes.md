# Base Build Notes

Base AgentGuard is aligned with Base AI agent tooling in three ways.

## Base MCP

Base MCP lets assistants connect to a Base Account and use wallet tools for
balances, sends, swaps, signing, contract calls, and x402 payments. The app
does not replace Base MCP; it prepares a clear review receipt before a user
moves to an approval flow.

## Custom plugins

The project includes `plugins/base-agentguard.md`, which follows the Base custom
plugin pattern:

- onboarding gate
- read endpoints
- prepare endpoint shape
- `send_calls` mapping
- orchestration sequence

## Builder activity

Useful Base ecosystem activity should be real and durable:

- publish open-source code
- deploy test contracts on Base Sepolia
- verify contracts where possible
- document Base MCP plugin flows
- open issues and accept contributions
- improve safety for agent-driven wallet actions
- register Builder Codes for attribution when real transactions are used
- document x402 max-payment caps and approval behavior

There is no guarantee that any Base airdrop will happen or that this project
would qualify for one. The project should stand on its own as useful Base
infrastructure.
