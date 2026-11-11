# WeaveForge plugins

The official WeaveForge plugins, published as a signed git plugin source
(temporary home until the built-in official source moves here).

| Source name | Signer fingerprint |
| --- | --- |
| `weaveforge` | `18a1aecf37b595eb` |

## Plugins

Every plugin has its own repository in the
[`996-ugc/wf-plugins`](https://gitlab.xqhuyu.cn/996-ugc/wf-plugins) group on the team GitLab.

| Plugins | Shared code (checked out beside them) |
| --- | --- |
| `assets`, `game-starter`, `gdscript`, `godot`, `godot-export`, `project-notes` | `plugin-kit` |
| `game-develop`, `roguelike-develop`, `rpg-develop`, `shooter-develop`, `tower-develop` | `game-develop/kit` |

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

1. Clone the GitLab group's repositories side by side (the plugins build
   against `plugin-kit` or `game-develop/kit` by path), and bump `version` in
   the plugin's `wf-plugin.toml` (and `Cargo.toml`). A published version is
   never replaced.
2. From a WeaveForge checkout, with the signing key at
   `~/.config/wf-plugins/signing-key.pem`:

   ```sh
   bun scripts/release/plugin-repo.ts --repo <this checkout> --plugins <plugin or folder of plugins>...
   ```

   It builds each plugin, packs and signs each new version into `packages/`,
   and rewrites the signed index. Options: `--key <pem>`, `--publisher <binary>`.
   Process plugins (`project-notes`) are built for the current platform only;
   run it on each platform to add theirs.
3. Review, commit and push this repository.

The index must keep its signer. Keep the private key out of this
repository; losing it means every user has to add the source again.
