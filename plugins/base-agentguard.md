# Base AgentGuard Plugin

> [!IMPORTANT]
> ## STOP - COMPLETE BASE MCP ONBOARDING BEFORE USING THIS PLUGIN
>
> Before preparing or executing any Base AgentGuard action, complete the Base
> MCP onboarding flow:
>
> 1. Call `get_wallets`.
> 2. Present the detected wallet address, chain, and approval disclaimer.
> 3. Continue only after the user confirms the intended action.
>
> Every write action must be approved by the user in Base Account.

Base AgentGuard is a safety layer for AI agent wallet actions on Base. It scores
an action, builds a human-readable receipt, and maps prepared unsigned calldata
into Base MCP `send_calls`.

## Supported chains

- Base mainnet: `8453`, Base MCP chain name `base`
- Base Sepolia: `84532`, Base MCP chain name `base-sepolia`

## Read endpoints

Static MVP:

```txt
GET ./data/risk-rules.json
GET ./examples/send-calls.receipt.json
```

Future hosted API:

```txt
GET https://<host>/api/rules
GET https://<host>/api/receipt?id=<receiptId>
```

## Prepare endpoint shape

Base AgentGuard prepare responses should use the ordered batch shape when more
than one call is needed:

```json
{
  "transactions": [
    {
      "step": "approve",
      "to": "0x...",
      "value": "0x0",
      "data": "0x...",
      "chainId": 8453
    },
    {
      "step": "action",
      "to": "0x...",
      "value": "0x0",
      "data": "0x...",
      "chainId": 8453
    }
  ],
  "receipt": {
    "riskScore": 64,
    "summary": "Bounded approval and vault action after user confirmation"
  }
}
```

For one-call actions, use an envelope:

```json
{
  "ok": true,
  "data": {
    "to": "0x...",
    "value": "0x0",
    "data": "0x...",
    "chainId": 8453
  },
  "receipt": {
    "riskScore": 32,
    "summary": "Single Base contract call"
  }
}
```

## send_calls mapping

Map the prepared calls into Base MCP:

```json
{
  "chain": "base",
  "calls": [
    {
      "to": "<transaction.to>",
      "value": "<transaction.value>",
      "data": "<transaction.data>"
    }
  ]
}
```

If the prepare response uses numeric chain IDs, map them before calling Base MCP:

- `8453` -> `base`
- `84532` -> `base-sepolia`

## Orchestration pattern

```txt
1. get_wallets -> detected wallet address
2. Read Base AgentGuard risk rules
3. Score the user's agent intent
4. Show receipt: action, asset, amount, recipient, target, risk, calls
5. Prepare unsigned calldata
6. send_calls(chain, calls)
7. User approves in Base Account
8. get_request_status(requestId)
```

## x402 note

x402 payment actions should show the API host, price, asset, network, and
response expectations before payment. Do not hide x402 payments inside generic
contract-call receipts.

## Builder Code note

For agent transactions that should be attributable on Base.dev, register the
agent wallet for a Builder Code and append the ERC-8021 data suffix through the
wallet or client capability. Do not fake attribution in receipts; show it as a
plan until a real transaction proves it.
