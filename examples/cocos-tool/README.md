# CocosTool 0.2.0

Install **CocosTool** from the default `weaveforge` source to check Cocos
Creator 3.x projects and convert WeaveForge exports to native Cocos assets.

| Previous command | CocosTool |
| --- | --- |
| `wf cocos lint` | `wf cocos-tool lint` or aggregate `wf lint` |
| `wf cocos-export sync` | `wf cocos-tool sync` |

The desktop plugin panel offers **Check Cocos**. In a linked workspace mirror,
supported nodes offer **Export to Cocos**. The check works without an editor or
workspace mirror. Export uses the existing manifest and ownership stamp and
continues to protect locally edited generated files.

## Migrate an active project

1. In the Cocos project root, install and save the new package with
   `wf plugin install cocos-tool --save` and approve the package in the client.
2. Change `cocos/<rule>` keys to `cocos-tool/<rule>` in `wf-plugins.toml`.
   Update scripts and CI to use the new command names.
3. If the old packages are installed and no other local projects depend on
   them, run `wf plugin uninstall cocos --save` and
   `wf plugin uninstall cocos-export --save` for the entries in use. This
   removes the installed package as well as its current project entry.
   Otherwise remove only the obsolete declarations and matching lock entries
   in `wf-plugins.toml` and `wf-plugins.lock` from the project being migrated.
4. Commit the project changes and verify `wf plugin install --dry-run` and
   `wf lint --plugin cocos-tool` against the migrated project.

## Reproduce a historical lock

The signed catalog before the merger is pinned by the Git tag
[`pre-cocos-tool`](https://github.com/Leridy/wf-plugins/tree/pre-cocos-tool).
To install from an unchanged historical lock on a clean machine, temporarily
use this catalog in a dedicated client configuration. An `app.toml` in the
client instance's configuration directory can set the built-in source to that
ref. On current macOS clients it is under
`$XDG_CONFIG_HOME/wf/instances/<id>/` (default `~/.config/wf/instances/<id>/`).
On Windows it is under `%APPDATA%/wf/instances/<id>/`.

```toml
[[plugin_sources]]
name = "weaveforge"
signer = "18a1aecf37b595eb"

[plugin_sources.location]
kind = "git"
url = "https://github.com/Leridy/wf-plugins.git"
reference = "refs/tags/pre-cocos-tool"
```

The source name stays `weaveforge`, matching the existing lock. A previously
saved source with that name takes precedence, so use a clean configuration.
In the historical checkout, run `wf plugin install --dry-run` to confirm the
pins and `wf plugin install` to install the signed historical versions. Use
the default source configuration for current projects.

## Source

CocosTool is maintained in the
[existing Cocos integration repository](https://gitlab.xqhuyu.cn/996-ugc/wf-plugins/cocos-export).
The [old checker repository](https://gitlab.xqhuyu.cn/996-ugc/wf-plugins/cocos)
is a source reference.

The [buildable source archive](../../sources/cocos-tool-0.2.0.tar.gz)
includes the sibling `plugin-kit` checkout. See the [source commits](source-commits.json).
