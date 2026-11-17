# Default catalog cleanup and template discovery

The default catalog contains 16 plugins. `project-notes` remains an optional developer example outside the default index; existing installs and historical packages are retained.

## Released versions

| ID (unchanged) | Display name | Version | Templates |
| --- | --- | --- | --- |
| `assets` | WeaveForge Asset Checker | 0.1.6 | — |
| `cocos` | Cocos Project Checker | 0.1.1 | — |
| `cocos-export` | Cocos Integration | 0.1.3 | — |
| `game-develop` | Godot Game Foundation | 0.1.2 | starter |
| `game-starter` | Platformer Templates | 0.1.2 | platformer |
| `gdscript` | GDScript Code Checker | 0.1.3 | — |
| `godot` | Godot Project Checker | 0.1.6 | — |
| `godot-export` | Godot Integration | 0.5.1 | — |
| `phaser-export` | Phaser Integration | 0.1.1 | — |
| `pixi-export` | PixiJS Integration | 0.1.1 | — |
| `roguelike-develop` | Roguelike Templates | 0.5.1 | dungeon, survivors, rooms |
| `rpg-develop` | RPG Templates | 0.4.1 | jrpg, tactics, action |
| `shooter-develop` | Shooter Templates | 0.3.2 | fps, tps |
| `tower-develop` | Tower Defense Templates | 0.4.1 | godot-fixed-route |
| `unity` | Unity Project Checker | 0.1.2 | — |
| `unity-export` | Unity Integration | 0.2.4 | — |

## Sources and compatibility

All source changes are in the corresponding GitLab `996-ugc/wf-plugins/<id>` repositories. Exact commits are in [source-commits.json](source-commits.json); [complete source archive](../../sources/catalog-cleanup.tar.gz) keeps the sibling layout required by path dependencies.

Use the current development client from `codex/external-tool-discovery`. It supports optional `[plugin].display_name`, signed index display metadata, and packages with up to 1024 files. Older strict manifest/index readers reject the new metadata. No stable client version is released here. Stable IDs, CLI commands, trust identities and lockfile keys are unchanged.

The shared Templates page shows 11 template entries from six plugins. The existing `new` and `lint` commands remain available. JRPG and Action include the whole-map kit through both entry points. `whole-map` itself remains an add-on for existing projects. `game-develop` no longer advertises tower-defense behavior.

## Verification

- All 16 new packages built, described, packed and signed with the existing signer.
- `bun scripts/verify-index.ts`: 16 indexed plugins and 49 historical/current package hashes and Ed25519 signatures verified; project-notes absent.
- Five template component suites: 52 tests passed, including shared RPG kit consistency and legacy scaffold checks.
- App: 9 focused frontend tests; display-name parsing test; 3 package tests including a valid 300-file multi-template package and rejection above 1024.
- All 11 templates extracted from the release packages with default parameters and imported by Godot 4.7.1 using `--headless --editor --import --quit`: exit 0, no script/resource errors. See [results](godot-import-validation.json). This is import validation, not full gameplay QA.
- Interactive client installation acceptance was not completed: automated approval was blocked, and the user confirmation expired. Package and engine validation above passed; this is not evidence of a completed UI installation flow.

## Maintainer publication

After every index rebuild, run `bun scripts/curate-index.ts --key <existing-signing-key.pem>`, then `bun scripts/verify-index.ts`. Commit the index and its detached signature together. Never replace an already published package version.

Client implementation: [`4d2ab0980e`](https://gitlab.xqhuyu.cn/996-ugc/weaveforge/-/commit/4d2ab0980e6000bc16c5ef6f0c98958a8178a82c). Generated contracts, targeted tests and the staged Biome/rustfmt/Clippy checks passed.
