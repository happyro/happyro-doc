# Linux

本页介绍使用 HappyRO 物理机脚本在 Linux 上部署。macOS 请使用 [macOS 安装指南](/installation/macos)，Windows 请使用 [WSL2 安装指南](/installation/windows)，Docker 请使用 [Docker 安装指南](/installation/docker)。

## 环境依赖

需要 Git、GNU Make、CMake、C++ 编译器、Node.js 22 或更高版本、npm、Docker Compose、OpenSSL、ripgrep、jq、curl、`ss` 和 systemd。安装完成后可用 `make doctor` 检查环境，但该命令不会安装依赖或启动服务。

## 准备源码

HappyRO 由四个独立仓库组成，网关使用 HappyRO Gateway 的锁定版本：

```bash
git clone https://github.com/happyro/happyro.git
cd happyro
git clone https://github.com/happyro/happyro-client.git repos/happyro-client
git clone https://github.com/happyro/happyro-server.git repos/happyro-server
git clone https://github.com/happyro/happyro-gateway.git repos/happyro-gateway
source versions/sources.lock
git -C repos/happyro-gateway checkout "$HAPPYRO_GATEWAY_COMMIT"
```

## 修改配置

按部署环境修改以下文件，并确保客户端地址、rAthena 监听地址、网关允许的 WebSocket 目标和站点来源互相一致：

| 文件 | 配置内容 |
| --- | --- |
| `configs/Config.happyro.js` | 游戏服务器地址、端口和浏览器 WebSocket 地址 |
| `deploy/mariadb/profile.env` | 数据库镜像、监听地址、端口和数据库名 |
| `deploy/rathena/profile.env` | rAthena 监听地址、端口和允许的 Web 来源 |
| `deploy/remote-client/.env.example` | 网关公开地址、允许的 WebSocket 目标和 Web API 地址 |

仅在同一台机器访问时可统一使用 `127.0.0.1`；需要从局域网访问时，改为服务器在该网络中的可达地址。生产域名和 HTTPS 由反向代理配置，不应将数据库或 rAthena 端口直接暴露到公网。

## 准备 kRO 资源

将合法取得并与项目兼容的 kRO 资源放在下列位置。`data.grf` 和 `DATA.INI` 必需，其余目录按需提供：

```text
inputs/runtime/kro-20211105/client/
├── data.grf
├── DATA.INI
├── AI/       # 可选
├── BGM/      # 可选
└── System/   # 可选
```

这些资源包含第三方版权内容，不随源码仓库分发。详情见[版权与资源获取](/translation#版权与资源获取)。

## 构建并启动

```bash
make configure-client
npm --prefix repos/happyro-client install
npm --prefix repos/happyro-client run build:pwa
make configure-resources
make database-start
make build-server
make server-start
make gateway-start
```

默认网关入口为 `http://<服务器地址>:3338/applications/pwa/index.html`。启动命令需要访问 Docker 和 systemd；若当前用户没有相应权限，请先正确配置用户组或使用管理员权限。

## 停止服务

```bash
make gateway-stop
make server-stop
make database-stop
```

停止服务不会删除 `work/` 中的数据库数据、日志或运行时密钥。

## 测试

```bash
make doctor
make test-client
make test-gateway
make database-verify
make server-verify
make gateway-verify
make status
```

`make doctor`、`make test-client` 和 `make test-gateway` 是检查与测试命令，不属于日常启动步骤。
