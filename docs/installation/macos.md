# macOS 源码安装

macOS 可原生编译 HappyRO Client、Server 和 Gateway，并使用 Docker 运行开发数据库；也可直接使用离线包运行完整环境。普通部署见 [Docker 安装](/installation/docker)，本页说明源码开发环境。

## 安装依赖

```bash
brew install git make cmake pkg-config node@22 mariadb-connector-c pcre jq ripgrep
```

另需安装 Docker Desktop 或 OrbStack，并确认 Node.js 22+、CMake、Docker Compose 和 MariaDB 客户端可用。

## 准备源码与资源

按照 [Linux 的五仓库步骤](/installation/linux#检出五个仓库)检出源码，再从同版本离线包复制 kRO 运行资源：

```bash
mkdir -p inputs/runtime/kro-20211105
cp -a /path/to/happyro-v0.2.0/resources/kro-20211105 \
  inputs/runtime/kro-20211105/client
```

配置客户端、Gateway 与资源链接：

```bash
make configure-client
make configure-gateway
make configure-resources
```

## 数据库与服务端

根仓库脚本使用 Docker Compose 启动 MariaDB 10.11，并生成本机开发密钥与服务端配置：

```bash
make database-start
make configure-server
make build-server
```

根仓库的长期服务流程以 Linux systemd 为主；Mac 开发时可在 `repos/happyro-server` 中分别启动 `login-server`、`char-server`、`map-server` 和 `web-server`，再启动 Gateway：

```bash
(cd repos/happyro-client && npm install && npm run build:pwa)
(cd repos/happyro-gateway && npm install --ignore-scripts && node start-prod.js)
```

浏览器打开 `http://127.0.0.1:3338/applications/pwa/index.html`。

需要完整 Server、Admin、Database 和资源一致性时，建议直接在 macOS 的 Docker Desktop 或 OrbStack 中使用离线包。
