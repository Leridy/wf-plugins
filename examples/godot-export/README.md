# Godot 外部程序发现与 headless 测试（0.5.0）

本例需要今天的开发版客户端：支持 `tools.version`、注册表发现和插件 API 0.1.4。
旧版客户端会拒绝新协议，暂不用于正式版客户端。

## 1. 更新插件

在开发版插件市场刷新 `weaveforge` 来源，将 **godot-export 更新到 0.5.0**。
如果已卸载则重新安装。安装后显示“依赖未就绪”是可预期的：先完成下面的配置。

## 2. 测试发现、手动路径和版本

安装后在环境配置卡中选择 Godot，点击 **确认并配置**，即可完成路径确认、版本查询和默认选择。
也可以稍后通过插件的“配置环境”或 **设置 → 客户端 → 外部工具 → Godot** 管理：

1. 自动发现已安装的 Godot；自定义安装可手动选择 `.app` 或可执行文件。
2. 稳定版 `>=4.3.0, <5.0.0` 才兼容；低版本、beta、rc 不通过。
3. 多个版本可独立检查并切换默认；默认选择会影响所有依赖 Godot 的插件。
4. 检查定义相同且仍有效的结果可复用；每个插件仍按自身版本要求判断兼容性。

版本规则作用于整个插件，`sync`、`headless-import`、`headless-run` 和预览均受约束。
未设置默认、未检查、版本不兼容或可执行文件被替换时，都不应开始执行。
`headless` 特性标签表示版本满足要求，实际运行由下一步验证。

[完整 TOML](wf-plugin.toml) 包含 macOS/Windows 安装路径、PATH、Windows HKCU/HKLM
App Paths 只读发现，以及版本提取规则。Godot 的便携安装不一定写注册表，仍可手动添加。
Windows 规则已通过协议校验；本次真实执行验证在 macOS 完成。

## 3. 运行最小项目

把本目录的 `project/` 复制到你的本地 WeaveForge 项目内，命名为 `godot-headless-demo/`。
在该 WeaveForge 项目根目录使用**开发版配套的 wf CLI**，或者让开发版 Agent 执行：

```sh
wf godot-export headless-import --directory godot-headless-demo --dry-run
wf godot-export headless-import --directory godot-headless-demo
wf godot-export headless-run --directory godot-headless-demo --frames 60 --dry-run
wf godot-export headless-run --directory godot-headless-demo --frames 60
```

如果 CLI 提示需要批准，按提示在客户端确认；取消批准应不启动 Godot。
不要让 Agent 替用户确认路径、批准版本检查或绕过执行确认。

指定场景的写法：

```sh
wf godot-export headless-run --directory godot-headless-demo --scene main.tscn --frames 120
```

预期：没有游戏窗口；导入后生成 `.godot` 缓存；运行日志含 `WF_HEADLESS_SCENE_READY`；
到指定迭代数后正常退出。`frames` 为引擎迭代次数，不是秒数，允许 1–600；0、601、
越界路径、任意 `args`/脚本参数均被拒绝。额外的实际超时由 App runtime 控制。

这是运行检查，不是画面验收。Godot 可能在退出码为 0 时仍输出脚本错误，因此还要看日志。
导入可能执行项目编辑器脚本，运行会执行项目代码；两者及原有 `sync` 均声明为高风险。

## 源码与验证

[源码归档](../../sources/godot-export-0.5.0.tar.gz) 包含并列的 `godot-export/` 和
`plugin-kit/`，可直接按相对依赖构建。对应源码提交：

- godot-export: `8976f04`
- plugin-kit（同步外部程序声明协议）: `1d11c48`

```sh
cd godot-export
cargo test
cargo build --release --target wasm32-wasip2
# 本机有 /Applications/Godot.app 时：
cargo test --test cli_plan -- --ignored
```

验证：57 项插件测试、36 项协议测试通过；Godot 4.7.1 的两项真实集成测试通过，
覆盖新 headless 命令及原有 9 组资源转换案例。当前客户端打包校验通过。
源码保留了原有的 Clippy 警告，未将无关代码重构混入本次更新。
