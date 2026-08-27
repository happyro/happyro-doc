# Docker 安装

Docker 方式使用仓库中的 Compose 配置运行数据库、rAthena 服务端和 Gateway。它不使用物理机上的 systemd，也不需要在宿主机直接安装 C++ 编译工具链。

## 环境要求

需要 Docker Engine 或 Docker Desktop，以及 Docker Compose v2。首次启动还需要准备 kRO 运行时资源；资源不会随镜像构建，也不会自动下载。

## 使用已构建镜像

这是推荐方式。使用预构建镜像时只需要 Compose 文件和 kRO 资源目录，不需要克隆任何源码仓库：

```bash
mkdir -p happyro/kro-client
mkdir -p happyro/data/db
mkdir -p happyro/data/gateway
mkdir -p happyro/data/server
curl -fsSL https://raw.githubusercontent.com/happyro/happyro/main/deploy/docker/compose.yml -o happyro/compose.yml
```

将合法取得的 kRO 资源放入 `kro-client/`，至少包含 `data.grf` 和 `DATA.INI`；如有 `AI/`、`BGM/`、`System/` 目录也一并放入。

Compose 默认使用 `./kro-client` 作为资源目录。部署时将数据库、Gateway 日志和 rAthena 日志分别保存到 `./data/db`、`./data/gateway` 和 `./data/server`。默认密码仅适合本地测试；生产环境请通过环境变量覆盖 `MARIADB_ROOT_PASSWORD`、`DB_PASSWORD` 和 `INTERSERVER_PASSWORD`。

Compose 使用以下已发布镜像：

```text
kugarocks/happyro-server:latest
kugarocks/happyro-gateway:latest
kugarocks/happyro-database:latest
```

拉取镜像并启动服务，不在本机重新构建：

```bash
cd happyro
export DB_DATA_DIR=./data/db
export GATEWAY_LOG_DIR=./data/gateway
export SERVER_LOG_DIR=./data/server
docker compose -f compose.yml pull
docker compose -f compose.yml up -d --no-build
docker compose -f compose.yml ps
```

## 自行构建镜像

如果需要使用本地源码或修改后的客户端、服务端和 Gateway，才需要克隆完整项目：

```bash
git clone https://github.com/happyro/happyro.git
cd happyro
git clone https://github.com/happyro/happyro-client.git repos/happyro-client
git clone https://github.com/happyro/happyro-server.git repos/happyro-server
git clone https://github.com/happyro/happyro-gateway.git repos/happyro-gateway
source versions/sources.lock
git -C repos/happyro-gateway checkout "$HAPPYRO_GATEWAY_COMMIT"
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
