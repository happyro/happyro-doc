# macOS 安装

本页面向需要在 macOS 上编译和修改 HappyRO 的开发者。玩游戏请使用 [Docker 安装](/container/docker)。

根仓库的 `make server-start` 和 `make gateway-start` 依赖 systemd，不能在 macOS 上使用。需要完整 Server、Admin、Database 时，直接用离线包。

## 安装依赖

```bash
brew install git make cmake pkg-config node@22 mariadb-connector-c pcre jq ripgrep
```

另需安装 Docker Desktop 或 OrbStack，并确认 Node.js 22+、CMake、Docker Compose 和 MariaDB 客户端可用。

## 检出源码与资源

按照 [Linux 的五仓库步骤](/native/linux#检出五个仓库)检出源码，再从同版本[离线包](/guide/downloads)复制 kRO 运行资源：

```bash
mkdir -p inputs/runtime/kro-20211105
cp -a /path/to/happyro-v0.3.2/resources/kro-20211105 \
  inputs/runtime/kro-20211105/client
```

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
