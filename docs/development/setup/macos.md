# macOS 开发环境

本页面向需要在 macOS 上编译和修改 HappyRO 的开发者。玩游戏请使用 [Docker 安装](/deploy/docker)。

根仓库的 `make server-start` 和 `make gateway-start` 依赖 systemd，不能在 macOS 上使用。完整游戏安装优先使用离线包；已有原生应用加 Docker 数据库的混合环境可用下文服务脚本管理。

## 安装依赖

```bash
brew install git make cmake pkg-config node@22 mariadb-connector-c pcre jq ripgrep
```

另需安装 Docker Desktop 或 OrbStack，并按 [API go.mod](https://github.com/happyro/happyro-api/blob/main/go.mod) 安装 Go 工具链。确认 Node.js 22+、Go、CMake、Docker Compose 和 MariaDB 客户端可用。

## 源码与资源

完成[共用准备步骤](/development/setup/)，不要执行 Linux 的 systemd 启动命令。

## 数据库与编译

```bash
make database-start
make configure-server
make build-server
make configure-client
make configure-gateway
make configure-resources
(cd repos/happyro-client && npm install && npm run build:pwa)
```

## 启动服务端

编译产物位于 `repos/happyro-server/`。在四个终端分别启动：

```bash
cd repos/happyro-server
./login-server
```

```bash
cd repos/happyro-server
./char-server
```

```bash
cd repos/happyro-server
./map-server
```

```bash
cd repos/happyro-server
./web-server
```

## 启动 Gateway

```bash
cd repos/happyro-gateway
npm install --ignore-scripts
node start-prod.js
```

浏览器打开 `http://127.0.0.1:3338/applications/pwa/index.html`。该页必须先显示“进入游戏”和各查看器入口。

## 管理前端与 Go API

管理前端位于 `repos/happyro-admin/`，Go 后端位于 `repos/happyro-api/`。分别构建：

```bash
(cd repos/happyro-admin && npm ci && npm run build)
mkdir -p work/runtime/native/bin
(cd repos/happyro-api && go build -mod=readonly -o ../../work/runtime/native/bin/happyro-api ./cmd/happyro-api)
```

按 [API 部署说明](https://github.com/happyro/happyro-api/blob/main/docs/deployment.md)配置独立的空管理库、游戏库、Game Control 密钥和资源路径，并依次执行 `migrate`、`init`、`catalog import`。Go 程序不自动加载 `.env`，由启动进程显式传入环境；`APP_URL` 必须与浏览器实际访问来源一致。

API 可通过 `FRONTEND_DIR` 提供 Admin 的 `dist/` 静态产物；前端开发服务与代理配置见 [Admin 部署说明](https://github.com/happyro/happyro-admin/blob/main/docs/deployment.md)。使用 launchd 时，先准备 Go API 的环境文件与服务配置，再启动服务。

## 已配置的混合开发环境

根仓库另提供已配置环境的启停入口：

```bash
bash scripts/local/macos-services.sh status --no-color
bash scripts/local/macos-services.sh start --no-color
bash scripts/local/macos-services.sh stop --no-color
```

脚本管理已准备的 login、char、map、web、Gateway、Go API、Admin 前端、OpenResty 和独立数据库，不负责首次安装、构建或数据库初始化。数据位置以本机 `work/runtime/native/hybrid-deployment.json` 为准，不与完整 Docker 游戏栈共享数据目录。此模式与上文手工终端启动二选一，不同时占用端口；配置细节见[根仓库服务说明](https://github.com/happyro/happyro/blob/main/docs/operations/services.md)。
