# 插件运行依赖核对与验收

本次核对 GitLab `996-ugc/wf-plugins` 分组的全部 **17 个插件**及共享库
`plugin-kit`。判断依据是插件是否实际启动外部程序，而不是名称中是否含引擎名。

## 本次发布

| 插件 | 版本 | 必需程序 | 改造 |
| --- | --- | --- | --- |
| game-starter | 0.1.1 | 稳定版 Godot >=4.7.0、<5.0.0 | 补齐固定版本查询、注册表发现和用户目录；保留既有 headless 导入 |
| unity-export | 0.2.3 | 正式版 Unity Editor >=6000.0.0、<7000.0.0 | 补齐版本检查、注册表和用户目录发现；验证既有 batchmode 导出 |
| godot-export | 0.5.0（未重发） | 稳定版 Godot >=4.3.0、<5.0.0 | 已支持依赖发现、版本检查、headless-import/run；源码归档保留完整的已发布实现 |

`game-starter` 的 Godot 最低版本沿用模板原有 `godot@4.7` 声明。
Unity 查询只接受正式版的 `f` 编号，拒绝 alpha/beta/rc 和 Unity Hub。
版本特性仅表示版本满足要求，不代表许可证、项目脚本或 MCP 已经可用。

## 其余插件

| 插件 | 实际行为 | 外部程序依赖 |
| --- | --- | --- |
| assets | 检查导出资源引用 | 无 |
| cocos | 静态检查 Cocos 工程引用 | 无 |
| cocos-export | 生成 Cocos 资源文件 | 无，不启动 Cocos Creator |
| gdscript | 静态检查 GDScript | 无 |
| godot | 静态检查 Godot 资源引用 | 无，不启动 Godot |
| unity | 静态检查 Unity 工程引用 | 无，不启动 Unity |
| phaser-export | 生成 Phaser TypeScript 资源与加载器 | 无，不启动 Node/npm |
| pixi-export | 生成 PixiJS TypeScript 资源与加载器 | 无，不启动 Node/npm |
| game-develop | 生成项目、静态检查 | 无 |
| roguelike-develop | 生成项目、静态检查 | 无 |
| rpg-develop | 生成项目、静态检查 | 无 |
| shooter-develop | 生成项目、静态检查 | 无 |
| tower-develop | 生成项目、静态检查 | 无 |
| project-notes | 运行随包提供的原生 MCP 程序管理笔记 | 无另装程序；随包进程不属于工具发现 |

这些插件无需为了 lint、生成文件或模板而强制安装编辑器。
项目后续开发可能使用的引擎/Node 与插件自身运行依赖是两个概念。

## 开发版测试流程

1. 刷新 `weaveforge` 插件来源，更新 `game-starter` 和 `unity-export`。
2. 安装后的环境配置卡自动查找必需程序；选择程序后点击 **确认并配置**。
   这一步执行版本查询，兼容后设为默认，不导入工程、不执行插件任务。
3. 自定义安装可浏览程序文件。Unity 应选择 Editor，不选 Hub。
4. 版本不兼容、没有默认路径或检查结果失效时，插件安装仍成功，但操作和预览被阻止。
5. 完成环境配置后，再预览、批准正常插件操作。创建模板的 Godot 导入和 Unity
   批处理导出仍遵守高风险操作确认，不因配置环境而自动获准。

Godot 查询：`--headless --version`；Unity 查询：`-version`。
发现只读取路径、PATH 和 Windows App Paths 注册表，扫描阶段不启动程序。
Windows 便携安装可能没有注册表记录，仍支持手动添加。

`unity-export sync --dry-run` 只生成计划；实际导出通过 runtime 执行固定
`-batchmode -quit -nographics -executeMethod` 调用，并清理临时脚本。
导出前关闭该 Unity 项目，保留有效许可证及需要的项目包。

## 验证证据与边界

- Unity 插件 40 项自动测试通过，含正式版/预览版/Hub 版本输出识别。
- 共享 manifest API 36 项测试通过，覆盖发现和版本声明校验。
- 本机 Godot `4.7.1.stable.official.a13da4feb` 的实际版本输出匹配。
- 平台模板 320×180、640×360 均完成 headless 导入和游戏冒烟测试，包含移动、跳跃、
  死亡、重开、HUD、终点以及仅输入控制通关。
- Unity `6000.3.27f2` 的实际版本输出匹配；临时工程实际 batchmode 导出通过，
  生成文件存在、临时文件已清理，重复规划无多余写入。
- 新包通过当前客户端的打包校验；发布索引与包使用既有签名者，保留旧版本。
- Windows 发现规则通过协议校验；本次没有 Windows 实机证据。
- 原源码已有的 Clippy 警告保留，未混入无关重构。

## 可复现源码

[源码归档](../../sources/external-tool-dependencies.tar.gz) 包含并列的
`game-starter/`、`unity-export/`、`godot-export/`、`plugin-kit/`。
[来源与提交](sources.json) 记录 GitLab 基线与本次源码提交。
四个源码仓库均已回写 GitLab `main`，同事可直接拉取继续开发；
GitHub 发布签名安装包和对应源码归档。归档不含构建缓存、签名密钥或本机配置。
新声明示例：[Godot 模板](game-starter.toml)、[Unity 导出](unity-export.toml)。

```sh
cd unity-export
cargo test --locked
cargo build --release --locked --target wasm32-wasip2
# 已安装且具备许可证的 Unity 6 Editor；只使用临时工程：
UNITY_EDITOR_BIN='/path/to/Unity' cargo test --test cli_plan configured_unity_editor_exports_source_fixture -- --ignored
```

`game-starter` 是数据模板，无需编译 WASM。发布新版本时只新增包，不覆盖已发布版本。
这些包面向支持本次外部工具协议的开发版客户端；未虚构尚未批准发布的 `plugin.cli` 版本。
