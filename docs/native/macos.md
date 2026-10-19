# macOS 安装

本页面向需要在 macOS 上编译和修改 HappyRO 的开发者。玩游戏请使用 [Docker 安装](/container/docker)。

根仓库的 `make server-start` 和 `make gateway-start` 依赖 systemd，不能在 macOS 上使用。完整游戏安装优先使用离线包；已有原生应用加 Docker 数据库的混合环境可用下文服务脚本管理。

## 安装依赖

```bash
brew install git make cmake pkg-config node@22 mariadb-connector-c pcre jq ripgrep
```

另需安装 Docker Desktop 或 OrbStack，并确认 Node.js 22+、CMake、Docker Compose 和 MariaDB 客户端可用。

## 检出源码与资源

源码检出和运行资源布局与 [Linux 准备步骤](/native/linux#检出五个仓库)相同，完成“检出五个仓库”和“准备运行资源”后返回本页，不执行 Linux 的 systemd 启动命令。文档站是第六个维护仓库，开发游戏本身不需要检出。

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

## 已配置的混合开发环境

根仓库另提供已配置环境的启停入口：

```bash
bash scripts/local/macos-services.sh status --no-color
bash scripts/local/macos-services.sh start --no-color
bash scripts/local/macos-services.sh stop --no-color
```

脚本只管理已准备的 launchd 应用和独立数据库，不负责首次安装。数据位置以本机 `work/runtime/native/hybrid-deployment.json` 为准，不与完整 Docker 游戏栈共享数据目录。此模式与上文手工终端启动二选一，不同时占用端口；配置细节见[根仓库服务说明](https://github.com/happyro/happyro/blob/main/docs/operations/services.md)。
