// Run after plugin-publish index, before committing a catalog release.
// Keeps historical packages available while excluding developer-only examples.
import { createPrivateKey, createPublicKey, sign, verify } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({ options: { key: { type: "string" } } });
if (!values.key) throw new Error("Usage: bun scripts/curate-index.ts --key <signing-key.pem>");
const root = resolve(import.meta.dir, "..");
const indexPath = resolve(root, "wf-plugin-index.json");
const bytes = readFileSync(indexPath);
const previous = JSON.parse(readFileSync(`${indexPath}.sig`, "utf8"));
const key = createPrivateKey(readFileSync(values.key));
const publicKey = createPublicKey(key);
const der = publicKey.export({ type: "spki", format: "der" });
const publicHex = der.subarray(-32).toString("hex");
if (previous.schema !== "wf-plugin-signature/1" || previous.public_key !== publicHex ||
    !verify(null, bytes, publicKey, Buffer.from(previous.value, "hex"))) {
  throw new Error("Existing index signature or signer does not match; index left unchanged.");
}
const policy: { excluded: string[] } = JSON.parse(readFileSync(resolve(root, "catalog-policy.json"), "utf8"));
const index = JSON.parse(bytes.toString());
const excluded = new Set(policy.excluded);
const removed = index.plugins.filter((entry: { name: string }) => excluded.has(entry.name));
index.plugins = index.plugins.filter((entry: { name: string }) => !excluded.has(entry.name));
const output = Buffer.from(JSON.stringify(index));
const signature = { schema: previous.schema, public_key: publicHex, value: sign(null, output, key).toString("hex") };
if (!verify(null, output, publicKey, Buffer.from(signature.value, "hex"))) throw new Error("Signature verification failed");
writeFileSync(indexPath, output);
writeFileSync(`${indexPath}.sig`, JSON.stringify(signature));
console.log(`Catalog: ${index.plugins.length} plugins; excluded: ${removed.map((entry: { name: string }) => entry.name).join(", ") || "already curated"}. Historical packages preserved.`);
