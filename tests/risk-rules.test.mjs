import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function readJson(path) {
  return JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
}

const rules = readJson("data/risk-rules.json");
const sendCallsReceipt = readJson("examples/send-calls.receipt.json");
const x402Receipt = readJson("examples/x402.receipt.json");
const eip712Receipt = readJson("examples/eip712.receipt.json");

function includesAll(values, expected) {
  for (const item of expected) {
    assert.ok(values.includes(item), `expected ${item}`);
  }
}

assert.ok(Array.isArray(rules.requiredChecks), "requiredChecks must be an array");
assert.ok(rules.requiredChecks.length >= 4, "requiredChecks should cover Base MCP safety gates");
assert.ok(Array.isArray(rules.highRiskTerms), "highRiskTerms must be an array");

includesAll(rules.highRiskTerms, [
  "approve",
  "unlimited",
  "permit",
  "bridge",
  "airdrop",
  "setapprovalforall",
  "eip-712",
  "spender",
  "deadline",
]);

assert.equal(sendCallsReceipt.baseMcpTool, "send_calls");
assert.equal(sendCallsReceipt.send_calls.chain, "base");
assert.ok(Array.isArray(sendCallsReceipt.send_calls.calls), "send_calls must contain calls");
assert.ok(sendCallsReceipt.send_calls.calls.length > 0, "send_calls should include at least one call");
assert.match(sendCallsReceipt.builderCode, /^bc_[a-z0-9]{8}$/i, "Builder Code format should be stable");

assert.equal(x402Receipt.baseMcpTool, "initiate_x402_request");
assert.equal(x402Receipt.chain, "base-sepolia");
assert.equal(x402Receipt.x402.method, "GET");
assert.match(x402Receipt.x402.url, /^https:\/\//, "x402 endpoints must use HTTPS");
assert.ok(Number.parseFloat(x402Receipt.maxPayment) > 0, "maxPayment must be positive");
assert.equal(x402Receipt.maxPayment, x402Receipt.x402.maxPayment, "top-level and x402 maxPayment must match");

assert.equal(eip712Receipt.baseMcpTool, "sign_typed_data");
assert.equal(eip712Receipt.typedDataReview.standard, "EIP-712");
assert.equal(eip712Receipt.typedDataReview.chainId, 84532);
assert.match(eip712Receipt.typedDataReview.verifyingContract, /^0x[a-fA-F0-9]{40}$/);
assert.match(eip712Receipt.typedDataReview.spender, /^0x[a-fA-F0-9]{40}$/);
assert.ok(eip712Receipt.typedDataReview.deadline, "EIP-712 review should expose deadline");
assert.ok(eip712Receipt.safetyChecks.some((check) => check.includes("verifyingContract")));

console.log("Risk rule tests passed.");
