# Base Launch Playbook

Use this when turning Base AgentGuard from a local prototype into a Base-visible
public goods project.

## 1. Public repo

- Create a public GitHub repository named `base-agentguard`.
- Upload all files from this folder.
- Add repository topics:
  - `base`
  - `base-mcp`
  - `ai-agents`
  - `x402`
  - `builder-codes`
  - `wallet-safety`
  - `public-goods`

## 2. Working demo

- Deploy the static app to Vercel, Netlify, or GitHub Pages.
- Add the live demo URL to `README.md`.
- Record a 30-60 second demo showing:
  - Base RPC health
  - x402 example
  - contract-call risk score
  - `send_calls` receipt
  - Builder Code field

## 3. Base Sepolia proof

- Deploy `contracts/BaseAgentIntentRegistry.sol` to Base Sepolia.
- Verify the contract source on the explorer if possible.
- Add these to `README.md`:
  - contract address
  - deployment transaction
  - explorer link
  - example `IntentRecorded` event transaction

## 4. Builder Codes

- Register the agent/app on Base.dev.
- Add the Builder Code to `.env.example` or README placeholders.
- Create an issue named `Wire ERC-8021 Builder Code attribution`.
- Add a transaction example once the suffix is active.

## 5. Base rewards/funding posture

- Submit the app to Base.dev verification when the demo is live.
- Share progress publicly with real screenshots and links.
- Track metrics in `docs/impact-metrics.md`.
- Apply to Builder Rewards first; Builder Grants are stronger after usage exists.

## 6. Trust checklist

- Keep private keys out of the repo.
- Do not add fake airdrop language or claim pages.
- Avoid hidden approvals and execution.
- Keep x402 caps explicit.
- Prefer Base Sepolia examples until the app is mature.
