# macOS 开发环境

本页面向需要在 macOS 上编译和修改 HappyRO 的开发者。玩游戏请使用 [Docker 安装](/deploy/docker)。

根仓库的 `make server-start` 和 `make gateway-start` 依赖 systemd，不能在 macOS 上使用。完整游戏安装优先使用离线包；已有原生应用加 Docker 数据库的混合环境可用下文服务脚本管理。

## 安装依赖

```bash
brew install git make cmake pkg-config node@22 mariadb@10.11 pcre jq ripgrep
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
mkdir -p work/build/api
(cd repos/happyro-api && go build -mod=readonly -o ../../work/build/api/happyro-api ./cmd/happyro-api)
```

按 [API 部署说明](https://github.com/happyro/happyro-api/blob/main/docs/deployment.md)配置独立的空管理库、游戏库、Game Control 密钥和资源路径，并依次执行 `migrate`、`init`、`catalog import`。Go 程序不自动加载 `.env`，由启动进程显式传入环境；`HAPPYRO_ADMIN_PUBLIC_URL` 配置公开入口；启用 `HAPPYRO_ADMIN_CSRF_ORIGIN_CHECK_ENABLED=true` 时，实际浏览器来源必须与它一致，默认关闭该来源限制但仍校验会话和 CSRF Token。

Admin 页面由独立前端服务提供，`/api` 请求代理到 Go API；前端开发服务与代理配置见 [Admin 部署说明](https://github.com/happyro/happyro-admin/blob/main/docs/deployment.md)。使用 launchd 时，分别准备 Go API 与 Admin 前端的服务配置；API 环境变量由启动进程显式传入。

## 已配置的混合开发环境

根仓库另提供已配置环境的启停入口：

```bash
bash scripts/local/macos-services.sh status --no-color
bash scripts/local/macos-services.sh start --no-color
bash scripts/local/macos-services.sh stop --no-color
```

脚本按约定标签管理已准备的 login、char、map、web、Gateway、Go API、Admin 前端、OpenResty 和独立数据库，不负责首次安装、构建或数据库初始化。数据位置以本机 `work/runtime/native/hybrid-deployment.json` 为准，不与完整 Docker 游戏栈共享数据目录。此模式与上文手工终端启动二选一，不同时占用端口；配置细节见[根仓库服务说明](https://github.com/happyro/happyro/blob/main/docs/operations/services.md)。

## 更新已有原生环境

游戏 C++ 有变化时重新构建；只改 NPC、魔物名称或数据库文本通常重载对应数据即可，不需要仅为文字重新编译。先构建到暂存路径，再停止相应服务，备份并把程序安装到 plist 实际使用的位置。`repos/happyro-server/` 与 `work/runtime/native/bin/` 可能是两套文件，重启旧安装副本不会自动采用新的编译结果。

客户端使用 `npm run build -- --all` 保留启动页；完成后在根仓库执行 `bash scripts/client/refresh-client.sh verify --no-color`，核对 Gateway 提供的新 buildId 和哈希。该脚本的 build 子命令依赖 systemd，不用于 macOS。任务 LUB 更新需单独编译和安装，API 资料需完整导入，不能只刷新网页。

上述服务脚本的 OpenResty 分支假定存在系统级 `local.happyro.openresty`。采用用户服务或不同反向代理的主机，按实际 plist 分别启停，不把缺少这个特定标签当作整个代理故障。SDK、MariaDB 库路径和详细更新顺序见[根仓库服务管理](https://github.com/happyro/happyro/blob/main/docs/operations/services.md#已配置-macos-环境更新)。
