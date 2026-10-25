# 资源下载

当前版本为 [v0.6.0](/changelog/releases/v0.6.0)，2026-10-26 完成离线包本机验证和 Docker Hub 双架构镜像发布。

这里记录的是 2026-10-26 已验收的四镜像产物。当前源码已将 Admin 从 API 拆出，采用五镜像部署；下列旧产物不能与当前源码生成的 Compose、环境模板或工具混用。新构建的完整包应使用包内配套 README 和工具。

## v0.6.0 离线包

- 文件：`happyro-v0.6.0.zip`
- 大小：4,348,033,247 字节（约 4.05 GiB）。
- 包含 Gateway、Server、API（含 Admin 前端）、Database 的 amd64／arm64 镜像和运行资源。
- 本轮未上传 ZIP 到公开下载服务；下方网盘链接仍对应 v0.5.0。

SHA-256：

```text
4b85f81ff74989b5b8e913347faf2b9f3c89e6561aa64e5530f268ac1dcf140e
```

本机验证包含游戏、后台、触屏视口、备份恢复和保留原密钥的 v0.5.0 备份升级；amd64 使用本机仿真，未覆盖真机后台行为和完整 HTTPS 会话矩阵。详细范围见[版本摘要](/changelog/releases/v0.6.0#交付与本机验收)。

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

以下四组镜像的 `v0.6.0` 和 `latest` 已核对为同一完整索引，均提供 `linux/amd64` 与 `linux/arm64`。离线部署使用包内固定版本标签：

```text
kugarocks/happyro-gateway:v0.6.0
kugarocks/happyro-server:v0.6.0
kugarocks/happyro-api:v0.6.0
kugarocks/happyro-database:v0.6.0
```

API 镜像包含 Admin 前端。镜像不包含 kRO 运行资源，完整安装仍需离线包；索引摘要见[版本摘要](/changelog/releases/v0.6.0#交付与本机验收)。历史 `happyro-admin:v0.5.0` 不属于本次四组镜像。
