# 下载

## 离线包

当前离线交付版本为 `v0.3.2`，包含完整包 `happyro-v0.3.2.zip`，以及配套的 `happyro-v0.3.2-runtimes.zip`（运行资源）和 `happyro-v0.3.2-images.zip`（双架构镜像与部署文件）。使用拆分包时，将两者解压到同一目录，再按包内 README 校验和安装。

通过百度网盘下载 `v0.3.2` 完整离线包：

- 文件：[`happyro-v0.3.2.zip`](https://pan.baidu.com/s/1QqR4QblxjCEUepqPPTjsvg?pwd=35yb)
- 提取码：`35yb`

```text
happyro-v0.3.2/                # 新版完整包或两个拆分包合并后的根目录
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
├── tools/deployment/          # 部署工具
└── data/                      # 运行数据，首次为空
```

## Docker Hub 镜像

Docker Hub 已发布 `v0.3.2`，提供 `linux/amd64` 与 `linux/arm64`；四个镜像的 `latest` 与 `v0.3.2` 指向相同的双架构内容。离线部署使用固定版本标签：

```text
kugarocks/happyro-gateway:v0.3.2
kugarocks/happyro-server:v0.3.2
kugarocks/happyro-admin:v0.3.2
kugarocks/happyro-database:v0.3.2
```

这些镜像用于同步和核对，不包含 kRO 运行资源，不能单独组成可玩环境。完整安装使用离线包。
