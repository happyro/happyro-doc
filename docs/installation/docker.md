# Docker

::: tip
kRO 客户端资源属于第三方版权内容，未经授权不得分发，可通过[联系方式](/community/contact)交流。
:::

这是最简单的部署方式，适合生产环境。如需二次开发，建议使用物理部署。

## 准备工作

创建必要的目录：

```bash
mkdir -p happyro/kro-client
mkdir -p happyro/data/db
mkdir -p happyro/data/gateway
mkdir -p happyro/data/server
```

下载 `compose.yml`：

```bash
COMPOSE_URL=https://raw.githubusercontent.com/happyro/happyro/main/deploy/docker/compose.yml
curl -fsSL $COMPOSE_URL -o happyro/compose.yml
```

把你的 kRO 资源放到 `kro-client` 里面，Compose 默认使用 `./kro-client` 作为资源目录。

## 运行容器

配置环境变量（只对当前终端会话生效）：

```bash
cd happyro
export DB_DATA_DIR=./data/db
export GATEWAY_LOG_DIR=./data/gateway
export SERVER_LOG_DIR=./data/server
```

拉取镜像并运行容器：

```bash
docker compose -f compose.yml pull
docker compose -f compose.yml up -d --no-build
docker compose -f compose.yml ps
```

## 数据库配置

默认数据库信息如下：

| 项目 | 默认值 |
| --- | --- |
| 数据库主库 | `happyro` |
| 数据库日志库 | `happyro_log` |
| 数据库用户 | `happyro` |
| 数据库密码 | `happyro` |
| MariaDB root 密码 | `happyro` |
| 服务间通信用户 | `happyro_interserver` |
| 服务间通信密码 | `happyro` |

部署到生产环境前，请通过同名环境变量修改密码。

## 验证和停止

浏览器访问以下地址进入游戏：

```text
http://127.0.0.1:3338/applications/pwa/index.html
```

局域网内访问时，将 `127.0.0.1` 替换为部署主机的局域网 IP。网关健康检查地址为 `http://127.0.0.1:3338/api/health`。

```bash
curl --fail http://127.0.0.1:3338/api/health
docker compose -f compose.yml logs --tail=100 gateway
docker compose -f compose.yml down
```
