# 资源下载

当前正式发布版本为 v0.5.0，从 v0.3.x（最近历史发布为 v0.3.2）直接跃升，跳过 v0.4.x。此次跨端体验、游戏功能与部署维护的变更规模大，标志着项目达到重要里程碑；完整变化见 [v0.5.0 版本摘要](/changelog/releases/v0.5.0)。

## 离线包

当前离线交付版本为 `v0.5.0`，完整包为 `happyro-v0.5.0.zip`，并配套 `happyro-v0.5.0-runtimes.zip`（运行资源）和 `happyro-v0.5.0-images.zip`（双架构镜像与部署文件）。使用拆分包时，将两者解压到同一目录，再按包内 README 校验和安装；两个拆分包不能单独部署。

完整 ZIP 的 SHA-256：

```text
c4abc418bb00ff3a11ccc9ed2c7155d787671e6ff89e57d9ebe50752d148a2e4
```

拆分包 SHA-256：

```text
happyro-v0.5.0-runtimes.zip
1cd7735663676f723b8b7811920a63440a60939307f9937809313bf346d42184
happyro-v0.5.0-images.zip
01cbdfc7c140266abb96161c6e30b8b29925405fa0fa374d950151ad71e1aee1
```

公开网盘下载地址待维护者上传后补充。历史 v0.3.2 完整包仍可通过百度网盘取得：

- 文件：[`happyro-v0.3.2.zip`](https://pan.baidu.com/s/1QqR4QblxjCEUepqPPTjsvg?pwd=35yb)
- 提取码：`35yb`

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
