// Read-only verification of the signed default catalog and all indexed packages.
import { createHash, createPublicKey, verify } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dir, '..');
const bytes = readFileSync(resolve(root, 'wf-plugin-index.json'));
const signature = JSON.parse(readFileSync(resolve(root, 'wf-plugin-index.json.sig'), 'utf8'));
const key = createPublicKey({key:Buffer.from('302a300506032b6570032100' + signature.public_key, 'hex'),format:'der',type:'spki'});
if (signature.schema !== 'wf-plugin-signature/1' || !verify(null, bytes, key, Buffer.from(signature.value, 'hex'))) throw new Error('Invalid index signature');
const index = JSON.parse(bytes.toString());
const policy = JSON.parse(readFileSync(resolve(root, 'catalog-policy.json'), 'utf8'));
let packages = 0;
for (const entry of index.plugins) {
 if (policy.excluded.includes(entry.name)) throw new Error(`Excluded plugin is listed: ${entry.name}`);
 for (const version of entry.versions) {
  const path = resolve(root, version.url);
  if (!path.startsWith(root + '/') || !version.url.startsWith('packages/')) throw new Error('Package outside catalog');
  const data = readFileSync(path);
  const hash = createHash('sha256').update(data).digest();
  const sig = JSON.parse(readFileSync(path + '.sig', 'utf8'));
  if (data.length !== version.size || hash.toString('hex') !== version.sha256 || sig.public_key !== signature.public_key || sig.schema !== signature.schema || !verify(null, hash, key, Buffer.from(sig.value, 'hex'))) throw new Error(`Invalid package: ${version.url}`);
  packages++;
 }
}
console.log(`Verified ${index.plugins.length} plugins, ${packages} package hashes/signatures, and default-catalog exclusions.`);
