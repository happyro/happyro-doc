# 下载

## HappyRO v0.2.0 离线包

离线包是推荐的完整交付物，包含双架构 Docker 镜像、kRO 2021-11-05 运行资源、物品与世界图鉴资源、Compose 配置和部署工具。无需再单独下载 kRO 客户端。

> 下载地址将在文件上传后公布。

离线包文件名为 `happyro-v0.2.0.zip`，ZIP 内包含唯一的 `happyro-v0.2.0/` 根目录。

完整安装步骤见 [Docker 安装](/installation/docker)。

## Docker Hub 镜像

`v0.2.0` 提供 `linux/amd64` 与 `linux/arm64`：

```text
kugarocks/happyro-gateway:v0.2.0
kugarocks/happyro-server:v0.2.0
kugarocks/happyro-admin:v0.2.0
kugarocks/happyro-database:v0.2.0
```

> 镜像完成上传后可从 Docker Hub 获取。镜像不包含 kRO 运行资源；完整部署仍应使用离线包中的资源、Compose 和初始化工具。
