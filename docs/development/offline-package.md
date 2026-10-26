# 构建离线包

在 HappyRO 源码根目录运行 `python3 tools/release/release.py`。无参数仅显示帮助；命令分为 `offline`（部署产物）、`resources`（跨机器构建资源）和 `stage`（分阶段构建）。每个分组和动作均支持 `--help`，不保留旧命令别名。

## 一键打包

生成完整离线包：

```bash
python3 tools/release/release.py offline create
```

生成完整包和拆分包：

```bash
python3 tools/release/release.py offline create --split
```

预检通过后清理该版本旧产物，再完整重建：

```bash
python3 tools/release/release.py offline create --rebuild --split
```

默认读取 `deploy/docker/VERSION`，也可以加 `--version v0.6.0`；创建时指定版本必须与 VERSION 一致。普通创建遇到已有版本目录会拒绝覆盖。重新打包统一使用 `create --rebuild`，包括资源包。

需要 Python 3.11+、支持 amd64/arm64 与 OCI 导出的 Docker Buildx、Docker Compose、Skopeo，以及已准备并核验的运行资源。允许直接从有未提交改动的当前工作区构建；预检会 fetch origin/main，确认本地包含远程最新代码，但不会自动合并、提交或推送 Git。记录根仓库及五个应用仓库的 HEAD、dirty 状态和源码指纹；阶段前后源码发生变化即停止。

每次完整无缓存构建 Gateway（完整 --all PWA）、Server、API、Admin 和 Database 双架构镜像，全部成功后才组包。打包默认不推送 Docker Hub，也不启动验收环境。如何运行和验证见[离线包运行与验收](./offline-acceptance)。

## 产物与状态

```text
artifacts/releases/<版本>/
  images/                         原始双架构 OCI 和构建记录
  bundle/                         展开的完整离线部署包
  happyro-<版本>.zip               完整交付包
  happyro-<版本>-runtimes.zip      可选：运行资源拆分包
  happyro-<版本>-images.zip        可选：镜像与部署文件拆分包
  happyro-<版本>-split.json        可选：拆分摘要
  happyro-<版本>-SPLIT-README.md   可选：外部合并安装说明
work/releases/<版本>/
  state.json                      流程登记
  logs/<批次>/                    阶段日志
```

查看产物状态：

```bash
python3 tools/release/release.py offline status --version v0.6.0
```

核验产物完整性：

```bash
python3 tools/release/release.py offline status --version v0.6.0 --verify
```

普通 status 的 `integrity` 为 `not_checked`，不会将历史 packaged/published 记录当作当前校验通过。`--verify` 分别检查现存完整 ZIP、bundle、OCI 和拆分产物，缺失的类别明确显示 missing；全部缺失、登记不匹配或摘要错误返回失败。它不重新访问 Docker Hub，也不证明游戏可以运行。

## split 拆分交付

已生成的完整包也可以单独拆分，不重新构建镜像：

```bash
python3 tools/release/release.py offline split --version v0.6.0
```

拆分包必须来自已登记且未改变的完整 ZIP。`runtimes.zip` 包含部署资源，`images.zip` 包含镜像和其余部署文件；外部单独提供 `happyro-<版本>-SPLIT-README.md`，两包内各保留一份相同说明，镜像包还包含完整部署 README。三份合并说明由同一模板生成，内容一致。对外分发两个 ZIP、外部 README 和 `happyro-<版本>-split.json`；摘要报告同时记录 ZIP 与外部 README 的大小和 SHA-256。工具逐项校验两包合并内容与完整包一致，并生成大小与 SHA-256 摘要。默认清理保留外部 README；`offline clean --include-package --execute` 连同拆分包和报告一起删除它。已有拆分输出拒绝覆盖，可用 `offline create --rebuild --split` 全量重建。

将两份 ZIP 解压到同一父目录，合并同名 `happyro-<版本>/` 后按 README 部署。单独一份拆分包不能部署。包内排除任意层级的 `.DS_Store`、`._*`，保留 `.env.example` 等业务文件。

## Docker Hub 推送

::: info 仅在明确指定时推送
打包默认不推送 Docker Hub。使用 `--push` 或独立 `offline push` 才会发布版本标签并更新 latest。
:::

打包成功后立即推送 Docker Hub（不包含游戏运行验收）：

```bash
python3 tools/release/release.py offline create --split --push
```

如未登录，先登录 Docker Hub：

```bash
docker login
```

单独推送已有产物：

```bash
python3 tools/release/release.py offline push --version v0.6.0
```

独立 push 根据明确版本定位 `artifacts/releases/<版本>/images` 和 `bundle`，要求该版本已有登记。发布五类双架构镜像的版本标签，再更新 latest，并从远程核对完整 index 和双架构子 manifest。推送后仍保留本地产物。必须保留原始 OCI 和 bundle；只有 ZIP 无法直接推送。

独立推送证据默认保存到该版本日志批次中的 `dockerhub-<时间>/`，可用 `--evidence PATH` 指定不存在的新目录。自动推送使用流程批次内 `dockerhub/`。失败不回滚已更新的远程标签，修复后可以单独 push 重试整批核验。

## 清理与中断处理

预览中间产物清理：

```bash
python3 tools/release/release.py offline clean --version v0.6.0
```

删除中间产物，保留交付包；清理后不能仅凭 ZIP 推送：

```bash
python3 tools/release/release.py offline clean --version v0.6.0 --execute
```

删除交付包和中间产物：

```bash
python3 tools/release/release.py offline clean --version v0.6.0 --include-package --execute
```

清理保留发布登记和日志，不删除验收环境、原始资源、资源传输包、共享 Docker 镜像或缓存。版本锁阻止正在打包时被清理，发现归属不明、符号链接、部署私有数据或未知文件时拒绝删除。

::: warning 中断后重新构建
中断没有断点续跑；查看 status 和阶段日志后，用 `offline create --rebuild` 重新完整构建。重建先完成非破坏性预检再删除旧包；预检失败保留旧包，删除后若构建失败则无法恢复旧包。
:::

## 跨机器构建资源包

生成资源传输包：

```bash
python3 tools/release/release.py resources create
```

重新生成资源传输包：

```bash
python3 tools/release/release.py resources create --rebuild
```

查看资源包状态：

```bash
python3 tools/release/release.py resources status --version v0.6.0
```

核验资源包完整性：

```bash
python3 tools/release/release.py resources status --version v0.6.0 --verify
```

删除资源归档、摘要和清单；省略 `--execute` 时只预览：

```bash
python3 tools/release/release.py resources clean --version v0.6.0 --execute
```

输出位于 `artifacts/resources/<版本>/`，包括 `happyro-<版本>-resources-transfer.tar.gz`、同名 `.sha256` 和 `resources-manifest.json`；登记位于 `work/resource-transfers/<版本>/`。资源 clean 不需要 --include-package，也不会触及部署包和验收环境。

归档保留工作区路径、空目录及完整内容，收录 `inputs/runtime/kro-20211105/`、`work/game-data/items/kro-20211105/`、`work/game-data/monsters/kro-20211105/`。过滤 `.DS_Store`、`._*`，拒绝符号链接和特殊文件。记录逐文件大小与 SHA-256，生成后读取归档验证，再核对输入未变化。只需要 Python 3.11+，不需要 Docker。

将三个文件传到目标机器，先在归档目录运行 `shasum -a 256 -c <归档名>.sha256`（Linux 可用 sha256sum），再在目标源码工作区根目录运行 `tar -xzf /path/to/<归档名>.tar.gz`。目标机器还须有匹配的源码；NPC、地图和地形资源由 API 仓库提供。

::: info 资源传输包与部署拆分包的区别
资源传输包用于给另一台机器提供构建输入，不能代替部署用的 `runtimes.zip`。普通 `offline create` 不会额外生成资源传输包。
:::

`resources create` 默认拒绝覆盖，加 `--rebuild` 才预检后清理并重建。

## 分阶段构建

阶段 1：准备部署文件和资源：

```bash
python3 tools/release/release.py stage prepare --version v0.6.0
```

阶段 2：构建双架构镜像：

```bash
python3 tools/release/release.py stage build --version v0.6.0
```

阶段 3：组装完整离线包：

```bash
python3 tools/release/release.py stage package --version v0.6.0
```

阶段与一键创建共用受管理的版本目录、来源指纹、锁和日志。prepare 要求输出不存在并完成预检；build 要求 prepared；package 要求 built。三步均显式指定与 VERSION 一致的版本，不接受任意 --output/--images/--bundle 路径。完成后直接使用 offline status、split、push 和 clean。

每阶段前后核对源码，失败或源码改变后不能拼接批次；用 offline clean 清理后从 prepare 开始，或 offline create --rebuild 全量重建。跨机器应传输原始资源并重新 prepare，不能直接搬移工作区登记。

## 执行进度

默认显示彩色阶段、完成或失败、耗时与日志路径；耗时步骤每 10 秒提示一次。黄色为阶段开始、青色为进行中、绿色为完成、红色为未完成；等待提示不是完成百分比。Docker/Skopeo 的原始输出保留，阶段日志使用无色输出。

所有命令均支持 `--no-color`，可放在任意层级。创建可以省略版本读取 VERSION；拆分、推送、状态和清理必须明确版本，避免误操作其它产物。
