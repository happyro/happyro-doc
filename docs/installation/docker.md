# Docker 安装

Docker 方式使用仓库中的 Compose 配置运行数据库、rAthena 服务端和 Gateway。它不使用物理机上的 systemd，也不需要在宿主机直接安装 C++ 编译工具链。

## 环境要求

需要 Git、Docker Engine 或 Docker Desktop，以及 Docker Compose v2。首次启动还需要准备 kRO 运行时资源；资源不会随镜像构建，也不会自动下载。

## 准备源码和资源

```bash
git clone https://github.com/happyro/happyro.git
cd happyro
git clone https://github.com/happyro/happyro-client.git repos/happyro-client
git clone https://github.com/happyro/happyro-server.git repos/happyro-server
git clone https://github.com/happyro/happyro-gateway.git repos/happyro-gateway
source versions/sources.lock
git -C repos/happyro-gateway checkout "$HAPPYRO_GATEWAY_COMMIT"
```

将合法取得的 kRO 资源放到 `inputs/runtime/kro-20211105/`。

## 配置

在仓库根目录准备 Compose 环境变量，至少设置数据库密码、跨服务密码、`KRO_CLIENT_DIR` 和 `GATEWAY_PORT`。`KRO_CLIENT_DIR` 必须指向包含 `data.grf`、`DATA.INI` 及可选资源目录的 kRO 客户端目录。

## 使用已构建镜像

这是推荐方式。Compose 使用以下已发布镜像：

```text
kugarocks/happyro-server:latest
kugarocks/happyro-gateway:latest
```

拉取镜像并启动服务，不在本机重新构建：

```bash
docker compose -f deploy/docker/compose.yml pull
docker compose -f deploy/docker/compose.yml up -d --no-build
docker compose -f deploy/docker/compose.yml ps
```

## 自行构建镜像

如果需要使用本地源码或修改后的客户端、服务端和 Gateway，在仓库根目录执行：

```bash
docker compose -f deploy/docker/compose.yml build
docker compose -f deploy/docker/compose.yml up -d
docker compose -f deploy/docker/compose.yml ps
```

Gateway 镜像会在构建阶段编译 PWA，服务端镜像会编译 rAthena。两种方式都会通过只读挂载提供 kRO 资源，数据库数据保存在 Compose 配置指定的目录中。

## 验证和停止

```bash
curl --fail http://127.0.0.1:3338/api/health
docker compose -f deploy/docker/compose.yml logs --tail=100 gateway
docker compose -f deploy/docker/compose.yml down
```

`down` 只停止并移除容器，不会删除数据库数据目录。生产环境还应限制数据库和 rAthena 端口，仅对外提供 Gateway 或反向代理端口。
