# 资源下载

当前主分支功能见 [v0.5.1 版本摘要](/changelog/releases/v0.5.1)。下列下载文件与镜像属于 v0.5.0 的交付记录，保持原版本、链接和摘要；功能文档更新不会改变既有安装包内容。

后续交付使用当前构建流程中的 Gateway、Server、API（含 Admin 前端）与 Database 四组镜像，版本由包内配置决定，不套用下方历史 Admin 镜像名称。

## 离线包

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

项目发布记录中的 Docker Hub 版本为 `v0.5.0`，`latest` 指向同一内容，提供 `linux/amd64` 与 `linux/arm64`。离线部署使用包内固定版本标签，不依赖会变化的 `latest`：

```text
kugarocks/happyro-gateway:v0.5.0
kugarocks/happyro-server:v0.5.0
kugarocks/happyro-admin:v0.5.0
kugarocks/happyro-database:v0.5.0
```

这些镜像用于同步和核对，不包含 kRO 运行资源，不能单独组成可玩环境。完整安装使用离线包。
