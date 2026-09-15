# 下载

## 离线包

- 文件：[`happyro-v0.2.0.zip`](https://pan.baidu.com/s/10ngCtZpASSYEyQ-wSIoJUg?pwd=kuga)
- 提取码：`kuga`

```text
happyro-v0.2.0/                # 解压后的根目录
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

`v0.2.0` 提供 `linux/amd64` 与 `linux/arm64`：

```text
kugarocks/happyro-gateway:v0.2.0
kugarocks/happyro-server:v0.2.0
kugarocks/happyro-admin:v0.2.0
kugarocks/happyro-database:v0.2.0
```

> 镜像完成上传后可从 Docker Hub 获取。镜像不包含 kRO 运行资源；完整部署仍应使用离线包中的资源、Compose 和初始化工具。
