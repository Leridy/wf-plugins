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
| `assets`, `cocos-tool`, `game-starter`, `gdscript`, `godot`, `godot-export`, `phaser-export`, `pixi-export`, `unity`, `unity-export` | `plugin-kit` |
| `game-develop`, `roguelike-develop`, `rpg-develop`, `shooter-develop`, `tower-develop` | `game-develop/kit` |

## CocosTool

**CocosTool** (`cocos-tool`) combines the former Cocos Project Checker and Cocos
Integration into one plugin. It offers `lint` and `sync` for Cocos Creator
3.x. The two former plugin IDs are retired from the default catalog. See the
[migration and legacy lock guide](examples/cocos-tool/README.md).

## Runtime compatibility

`cocos-export` 0.1.2 declares the actual `wf:plugin@0.1.4` guest API used by its component,
fixing the incorrect 0.1.3 declaration in 0.1.0–0.1.1.
It requires a client with plugin API 0.1.4 support, as do `godot-export` 0.4.5+ and
`unity-export` 0.2.1+. Update the client when an older runtime rejects these versions.

## Godot discovery and headless acceptance

`godot-export` **0.5.0** declares a stable Godot `>=4.3.0, <5.0.0` dependency,
version checks and Windows registry hints. It adds `headless-import` and bounded
`headless-run` operations. This acceptance release requires the current development
client with the external-tool protocol and API 0.1.4 support; older clients reject
its manifest.

See the [setup and test guide](examples/godot-export/README.md),
[manifest example](examples/godot-export/wf-plugin.toml), and
[source archive including plugin-kit](sources/godot-export-0.5.0.tar.gz).

## External dependencies across the catalog

`game-starter` **0.1.1** now requires stable Godot 4.7+ and `unity-export`
**0.2.3** requires a stable Unity 6 Editor. Both declare version queries and
Windows registry discovery, matching the development client's installation-time
setup flow. Existing `godot-export` **0.5.0** remains available unchanged.

See the [17-plugin dependency audit and test guide](examples/external-tools/README.md)
and [complete buildable sources](sources/external-tool-dependencies.tar.gz).
These packages require the current development client's external-tool protocol;
older clients reject the new fields. Existing versions are retained.

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
   Process plugins (such as the separately maintained `project-notes` example) are built for the current platform only;
   run it on each platform to add theirs.
3. Apply the default-catalog policy and re-sign the index:

   ```sh
   bun scripts/curate-index.ts --key ~/.config/wf-plugins/signing-key.pem
   ```

   This applies the catalog exclusions while retaining historical packages.
   Run it after **every** index rebuild, including publication of unrelated plugins.
4. Review, commit and push this repository.

The index must keep its signer. Keep the private key out of this
repository; losing it means every user has to add the source again.

## Catalog cleanup and unified templates

The default catalog contains **15 plugins**. `project-notes` is a developer
example, not a bundled user feature; it is excluded from the index, not uninstalled
from users' machines. Its GitLab source and historical package remain available.

Human-readable names distinguish project checkers, engine integration and game
templates. Stable plugin IDs, CLI commands and lockfile identities are unchanged.
These new releases and the catalog's `display_name` metadata require the current
development client from `codex/external-tool-discovery`; older clients which reject
unknown manifest/index fields cannot consume this catalog revision. No desktop
release is implied by this plugin publication.

Install a template plugin, then open **Plugins → Templates**. There are **11**
template entries from six plugins: platformer; general Godot starter; tower defense;
dungeon, survivors and rooms roguelikes; JRPG, tactics and action RPG; FPS and TPS.
Each opens the shared directory/parameter form. Existing `new`, `lint` and specialist
operations remain available. The RPG whole-map add-on stays an operation for existing
projects, not a separate new-game template. JRPG and Action templates include its kit.

See [release details and validation](examples/catalog-cleanup/README.md).
