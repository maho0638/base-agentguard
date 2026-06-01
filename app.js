const networks = {
  base: {
    label: "Base mainnet",
    chainName: "base",
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
  },
  "base-sepolia": {
    label: "Base Sepolia",
    chainName: "base-sepolia",
    chainId: 84532,
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
  },
};

const fallbackRules = {
  requiredChecks: [
    "Complete Base MCP onboarding and get_wallets detection first.",
    "Show the user wallet, chain, action, token, amount, recipient, and target before approval.",
    "Treat every send, swap, sign, x402 payment, and contract call as user-approved only.",
  ],
  highRiskTerms: ["approve", "approval", "unlimited", "permit", "delegatecall", "upgrade", "bridge"],
};

let rules = fallbackRules;

const els = {
  networkSelect: document.querySelector("#networkSelect"),
  refreshNetwork: document.querySelector("#refreshNetwork"),
  chainId: document.querySelector("#chainId"),
  latestBlock: document.querySelector("#latestBlock"),
  gasPrice: document.querySelector("#gasPrice"),
  rpcStatus: document.querySelector("#rpcStatus"),
  form: document.querySelector("#intentForm"),
  actionType: document.querySelector("#actionType"),
  asset: document.querySelector("#asset"),
  amount: document.querySelector("#amount"),
  maxPayment: document.querySelector("#maxPayment"),
  builderCode: document.querySelector("#builderCode"),
  recipient: document.querySelector("#recipient"),
  target: document.querySelector("#target"),
  notes: document.querySelector("#notes"),
  loadExample: document.querySelector("#loadExample"),
  riskScore: document.querySelector("#riskScore"),
  riskLevel: document.querySelector("#riskLevel"),
  riskMeter: document.querySelector("#riskMeter"),
  findingsList: document.querySelector("#findingsList"),
  receiptOutput: document.querySelector("#receiptOutput"),
  copyReceipt: document.querySelector("#copyReceipt"),
};

async function loadRules() {
  try {
    const response = await fetch("./data/risk-rules.json");
    if (response.ok) {
      rules = await response.json();
    }
  } catch {
    rules = fallbackRules;
  }
}

async function rpc(method, params = []) {
  const network = networks[els.networkSelect.value];
  const response = await fetch(network.rpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
  });
  const payload = await response.json();
  if (payload.error) {
    throw new Error(payload.error.message || "RPC error");
  }
  return payload.result;
}

function hexToNumber(hex) {
  return Number.parseInt(hex, 16);
}

function weiToGwei(hexWei) {
  const wei = BigInt(hexWei);
  const scaled = Number(wei / 1000000n) / 1000;
  return `${scaled.toLocaleString(undefined, { maximumFractionDigits: 3 })} gwei`;
}

async function refreshNetwork() {
  const network = networks[els.networkSelect.value];
  els.rpcStatus.textContent = "Checking";
  els.chainId.textContent = "--";
  els.latestBlock.textContent = "--";
  els.gasPrice.textContent = "--";

  try {
    const [chainHex, blockHex, gasHex] = await Promise.all([
      rpc("eth_chainId"),
      rpc("eth_blockNumber"),
      rpc("eth_gasPrice"),
    ]);
    const chainId = hexToNumber(chainHex);
    els.chainId.textContent = `${chainId}`;
    els.latestBlock.textContent = hexToNumber(blockHex).toLocaleString();
    els.gasPrice.textContent = weiToGwei(gasHex);
    els.rpcStatus.textContent = chainId === network.chainId ? "Live" : "Mismatch";
  } catch (error) {
    els.rpcStatus.textContent = "Offline";
    els.latestBlock.textContent = error.message.slice(0, 32);
  }
}

function normalizeText(value) {
  return String(value || "").trim();
}

function decimalToWeiHex(value) {
  const clean = String(value || "0").replace(/,/g, ".").trim();
  if (!/^\d+(\.\d{0,18})?$/.test(clean)) return "0x0";
  const [whole, fraction = ""] = clean.split(".");
  const wei = BigInt(whole || "0") * 10n ** 18n + BigInt((fraction + "0".repeat(18)).slice(0, 18));
  return `0x${wei.toString(16)}`;
}

function pseudoCalldata(seed) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `0x${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function scoreIntent(intent) {
  const findings = [...rules.requiredChecks];
  let score = 8;

  const actionWeights = {
    send: 18,
    swap: 22,
    contract: 32,
    sign: 16,
    x402: 18,
  };

  score += actionWeights[intent.actionType] || 10;

  if (!intent.recipient && ["send", "swap"].includes(intent.actionType)) {
    score += 14;
    findings.push("Recipient is missing; Base MCP should not prepare a write action yet.");
  }

  if (!intent.target && ["contract", "x402"].includes(intent.actionType)) {
    score += 16;
    findings.push("Target contract or API endpoint is missing.");
  }

  const fullText = `${intent.asset} ${intent.recipient} ${intent.target} ${intent.notes}`.toLowerCase();
  const matchedTerms = rules.highRiskTerms.filter((term) => fullText.includes(term));
  if (matchedTerms.length > 0) {
    score += matchedTerms.length * 12;
    findings.push(`High-risk terms detected: ${matchedTerms.join(", ")}.`);
  }

  const amountNumber = Number.parseFloat(intent.amount);
  if (Number.isFinite(amountNumber) && amountNumber > 100) {
    score += 12;
    findings.push("Large amount detected; require explicit user confirmation and balance check.");
  }

  if (intent.target && !intent.target.startsWith("0x") && !intent.target.startsWith("https://")) {
    score += 8;
    findings.push("Target is not a contract address or HTTPS endpoint.");
  }

  if (intent.actionType === "sign") {
    findings.push("Never convert a signing request into send_calls; use sign or typed-data flows.");
  }

  if (intent.actionType === "x402") {
    findings.push("For x402 payments, verify USDC amount, Base network, API host, and response before payment.");
    if (!intent.target.startsWith("https://")) {
      score += 18;
      findings.push("x402 endpoint must be a full HTTPS URL.");
    }
    const maxPayment = Number.parseFloat(intent.maxPayment);
    if (!Number.isFinite(maxPayment) || maxPayment <= 0) {
      score += 12;
      findings.push("x402 maxPayment must be set before initiating a paid request.");
    } else if (maxPayment > 1) {
      score += 10;
      findings.push("x402 maxPayment is high for a first test; prefer a tight cap.");
    }
  }

  if (intent.builderCode && !/^bc_[a-z0-9]{8,}$/i.test(intent.builderCode)) {
    score += 6;
    findings.push("Builder Code format should look like bc_a1b2c3d4.");
  }

  if (!intent.builderCode) {
    findings.push("Register a Builder Code before serious Base activity so agent transactions can be attributed.");
  }

  return {
    score: Math.min(score, 100),
    findings,
  };
}

function riskLevel(score) {
  if (score >= 75) return { label: "Critical review", color: "var(--red)" };
  if (score >= 50) return { label: "High attention", color: "var(--amber)" };
  if (score >= 30) return { label: "Medium review", color: "var(--base)" };
  return { label: "Low risk", color: "var(--teal)" };
}

function buildReceipt(intent, score) {
  const network = networks[els.networkSelect.value];
  const base = {
    project: "Base AgentGuard",
    network: network.label,
    chain: network.chainName,
    chainId: network.chainId,
    action: intent.actionType,
    asset: intent.asset || "ETH",
    amount: intent.amount || "0",
    maxPayment: intent.actionType === "x402" ? intent.maxPayment || null : null,
    builderCode: intent.builderCode || null,
    recipient: intent.recipient || null,
    target: intent.target || null,
    riskScore: score.score,
    findings: score.findings,
    mcpOnboardingRequired: ["get_wallets", "show wallet status", "show approval disclaimer"],
  };

  if (intent.actionType === "sign") {
    return {
      ...base,
      baseMcpTool: "sign",
      messagePreview: intent.notes || "User-defined message required before signing.",
    };
  }

  if (intent.actionType === "x402") {
    return {
      ...base,
      baseMcpTool: "initiate_x402_request",
      x402: {
        url: intent.target,
        method: "GET",
        maxPayment: intent.maxPayment || "0.10",
        completeWith: "complete_x402_request(requestId) after Base Account approval",
      },
    };
  }

  const callTarget = intent.target && intent.target.startsWith("0x") ? intent.target : intent.recipient || "0x0000000000000000000000000000000000000000";
  const receipt = {
    ...base,
    baseMcpTool: "send_calls",
    send_calls: {
      chain: network.chainName,
      calls: [
        {
          to: callTarget,
          value: intent.asset.toUpperCase() === "ETH" ? decimalToWeiHex(intent.amount) : "0x0",
          data: pseudoCalldata(JSON.stringify(intent)),
        },
      ],
    },
  };

  if (intent.builderCode) {
    receipt.builderCodeAttribution = {
      code: intent.builderCode,
      standard: "ERC-8021 dataSuffix",
      note: "Append through a wallet/client capability after registering on Base.dev.",
    };
  }

  return receipt;
}

function renderResult(receipt) {
  const level = riskLevel(receipt.riskScore);
  els.riskScore.textContent = receipt.riskScore;
  els.riskLevel.textContent = level.label;
  els.riskMeter.style.width = `${receipt.riskScore}%`;
  els.riskMeter.style.background = level.color;

  els.findingsList.replaceChildren();
  receipt.findings.forEach((finding) => {
    const li = document.createElement("li");
    li.textContent = finding;
    els.findingsList.append(li);
  });

  els.receiptOutput.textContent = JSON.stringify(receipt, null, 2);
}

function currentIntent() {
  return {
    actionType: els.actionType.value,
    asset: normalizeText(els.asset.value),
    amount: normalizeText(els.amount.value),
    maxPayment: normalizeText(els.maxPayment.value),
    builderCode: normalizeText(els.builderCode.value),
    recipient: normalizeText(els.recipient.value),
    target: normalizeText(els.target.value),
    notes: normalizeText(els.notes.value),
  };
}

function scoreAndRender(event) {
  event?.preventDefault();
  const intent = currentIntent();
  const score = scoreIntent(intent);
  renderResult(buildReceipt(intent, score));
}

els.refreshNetwork.addEventListener("click", refreshNetwork);
els.networkSelect.addEventListener("change", () => {
  refreshNetwork();
  scoreAndRender();
});
els.form.addEventListener("submit", scoreAndRender);
els.loadExample.addEventListener("click", () => {
  els.actionType.value = "contract";
  els.asset.value = "USDC";
  els.amount.value = "25";
  els.maxPayment.value = "0.10";
  els.builderCode.value = "bc_a1b2c3d4";
  els.recipient.value = "builder.base.eth";
  els.target.value = "0x1111111111111111111111111111111111111111";
  els.notes.value =
    "Prepare a Base MCP custom plugin batch: check wallet, approve bounded USDC, then call a vault with send_calls after user approval.";
  scoreAndRender();
});
els.copyReceipt.addEventListener("click", async () => {
  await navigator.clipboard.writeText(els.receiptOutput.textContent);
  els.copyReceipt.textContent = "Copied";
  window.setTimeout(() => {
    els.copyReceipt.textContent = "Copy";
  }, 1000);
});

await loadRules();
await refreshNetwork();
scoreAndRender();
