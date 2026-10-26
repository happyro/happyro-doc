# 资源下载

当前版本为 [v0.6.0](/changelog/releases/v0.6.0)，下方提供当前完整离线包。

当前离线包采用五镜像部署，Admin 与 API 独立。请使用包内配套的 Compose、环境模板、README 和工具。

## v0.6.0 离线包

- 文件：[`happyro-v0.6.0.zip`](https://pan.baidu.com/s/1oCxWHoHVXM4NittJSZZj_A?pwd=e5ni)
- 大小：4,254,547,071 字节（约 3.96 GiB）。
- 包含 Gateway、Server、API、Admin、Database 的 amd64／arm64 镜像和运行资源。
- 提取码：`e5ni`

SHA-256：

```text
cadc6cca75398d01dbb94150b93d50692d04f2775af8acc8fcfcd9dee8a273db
```

2026-10-26 较早批次的验收与 Docker Hub 记录见[版本摘要](/changelog/releases/v0.6.0#交付与本机验收)，不代表当前下载包已完成同样的验收或推送。

## 历史 v0.5.0 离线包

百度网盘下载完整离线包：

- 文件：[`happyro-v0.5.0.zip`](https://pan.baidu.com/s/1rg9L8yzmwOHtH1s9puMwzQ?pwd=bfnm)
- 提取码：`bfnm`

完整 ZIP 的 SHA-256：

```text
853cfa22cd45f6a506208c690d6399931cf2a22dcae08f590ab864464cf8eeb8
```

```text
happyro-v0.5.0/                # 完整包或两个拆分包合并后的根目录
├── README.md                  # 部署手册
├── VERSION                    # 版本号
├── compose.yaml               # Compose 配置
├── .env.example               # 环境变量模板
├── release-manifest.json      # 发布清单
├── images/                    # Docker 镜像
│   ├── amd64/                 # Intel / AMD
│   └── arm64/                 # Apple Silicon / ARM
├── resources/                 # 运行资源
│   ├── kro-20211105/          # kRO 客户端资源
│   └── catalog/               # 物品与世界图鉴
├── examples/custom/           # 自定义模板
├── tools/deployment/          # 部署工具
└── data/                      # 运行数据，首次为空
```

## Docker Hub 镜像

以下为 2026-10-26 较早批次的 Docker Hub 发布记录：当时四组镜像的 `v0.6.0` 和 `latest` 已核对为同一完整索引，均提供 `linux/amd64` 与 `linux/arm64`。此记录不代表当前五镜像离线包已推送；离线部署使用包内镜像。

```text
kugarocks/happyro-gateway:v0.6.0
kugarocks/happyro-server:v0.6.0
kugarocks/happyro-api:v0.6.0
kugarocks/happyro-database:v0.6.0
```

该历史批次的 API 镜像包含 Admin 前端。镜像不包含 kRO 运行资源，完整安装仍需离线包；索引摘要见[版本摘要](/changelog/releases/v0.6.0#交付与本机验收)。历史 `happyro-admin:v0.5.0` 不属于本次四组镜像。
