import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const required = [
  "index.html",
  "styles.css",
  "app.js",
  "README.md",
  "LICENSE",
  "CONTRIBUTING.md",
  "ROADMAP.md",
  "data/risk-rules.json",
  "examples/send-calls.receipt.json",
  "examples/x402.receipt.json",
  "plugins/base-agentguard.md",
  "contracts/BaseAgentIntentRegistry.sol",
  "docs/base-build-notes.md",
  "docs/openai-oss-application.md",
  "docs/openai-maintainer-evidence.md",
  "docs/base-launch-playbook.md",
  "docs/impact-metrics.md",
  "docs/security-and-trust.md",
  "docs/source-review.md",
  "SECURITY.md",
];

const missing = required.filter((file) => !existsSync(join(process.cwd(), file)));
if (missing.length > 0) {
  console.error(`Missing files:\n${missing.join("\n")}`);
  process.exit(1);
}

const rules = JSON.parse(readFileSync("data/risk-rules.json", "utf8"));
if (!Array.isArray(rules.requiredChecks) || rules.requiredChecks.length < 3) {
  console.error("risk-rules.json must include at least three required checks");
  process.exit(1);
}

const receipt = JSON.parse(readFileSync("examples/send-calls.receipt.json", "utf8"));
if (receipt.send_calls.chain !== "base" || !Array.isArray(receipt.send_calls.calls)) {
  console.error("example receipt must include Base MCP send_calls");
  process.exit(1);
}

const x402 = JSON.parse(readFileSync("examples/x402.receipt.json", "utf8"));
if (x402.baseMcpTool !== "initiate_x402_request" || !x402.x402.maxPayment) {
  console.error("x402 example must include initiate_x402_request and maxPayment");
  process.exit(1);
}

const plugin = readFileSync("plugins/base-agentguard.md", "utf8");
for (const phrase of ["get_wallets", "send_calls", "base-sepolia", "x402"]) {
  if (!plugin.includes(phrase)) {
    console.error(`plugin spec missing ${phrase}`);
    process.exit(1);
  }
}

const app = readFileSync("app.js", "utf8");
for (const phrase of ["builderCode", "initiate_x402_request", "maxPayment"]) {
  if (!app.includes(phrase)) {
    console.error(`app missing ${phrase}`);
    process.exit(1);
  }
}

console.log("Base AgentGuard validation passed.");
