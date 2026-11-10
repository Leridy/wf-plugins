# WeaveForge plugins

The official WeaveForge plugins, published as a signed git plugin source
(temporary home until the built-in official source moves here).

| Source name | Signer fingerprint |
| --- | --- |
| `weaveforge` | `18a1aecf37b595eb` |

## Add the source

In the WeaveForge client: open Plugins, then **⋯ › Plugin sources… › Add source…**, and enter
`https://github.com/Leridy/wf-plugins.git`.

With the `wf` CLI:

```sh
wf plugin source add https://github.com/Leridy/wf-plugins.git
wf plugin search
wf plugin install gdscript
```

The first time, you are asked to trust the source's signer. Check that the
fingerprint is `18a1aecf37b595eb` before you confirm. A later change of
signer is refused.

## Layout

```text
wf-plugin-index.json        signed index (source name, every plugin version)
wf-plugin-index.json.sig
packages/<name>/<name>-<version>[-<target>].wfplugin(.sig)
icons/<sha256>.png          plugin icons, by content
```

Every package is signed. The index records each package's hash, size and
signer, and the client checks all three on install.

## Publish a new version (maintainers)

1. Bump `version` in `plugins/<name>/wf-plugin.toml` in the WeaveForge
   repository. A published version is never replaced.
2. From the WeaveForge checkout, with this repository checked out beside it
   and the signing key at `~/.config/wf-plugins/signing-key.pem`:

   ```sh
   bun scripts/release/plugin-repo.ts
   ```

   It builds `plugins/*`, packs and signs each new version into `packages/`,
   and rewrites the signed index. Options: `--repo <checkout>`,
   `--key <pem>`, `--publisher <binary>`. Process plugins (`project-notes`) are built
   for the current platform only; run it on each platform to add theirs.
3. Review, commit and push this repository.

The index must keep its signer. Keep the private key out of this
repository; losing it means every user has to add the source again.
