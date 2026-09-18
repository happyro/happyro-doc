# Linux 安装

本页面向需要修改和编译 HappyRO 的开发者。玩游戏请使用 [Docker 安装](/installation/docker)。

## 依赖

需要 Git、GNU Make、CMake、C++ 编译器、Node.js 22+、npm、Docker Compose、MariaDB 客户端、OpenSSL、ripgrep、jq、curl、`ss` 和 systemd。

Debian 或 Ubuntu：

```bash
sudo apt update
sudo apt install -y git make build-essential cmake pkg-config \
  libmariadb-dev libpcre3-dev zlib1g-dev \
  curl jq ripgrep iproute2 openssl ca-certificates mariadb-client
```

另行安装 Node.js 22+、Docker Engine 和 Compose v2，并确保当前用户可运行 Docker 与 systemd。

## 检出五个仓库

```bash
git clone https://github.com/happyro/happyro.git
cd happyro
git clone https://github.com/happyro/happyro-client.git repos/happyro-client
git clone https://github.com/happyro/happyro-server.git repos/happyro-server
git clone https://github.com/happyro/happyro-gateway.git repos/happyro-gateway
git clone https://github.com/happyro/happyro-admin.git repos/happyro-admin
```

根仓库与四个应用仓库维护独立 Git 历史，长期维护分支均为 `main`。

## 准备运行资源

源码仓库不包含 kRO 运行资源。从同版本[离线包](/downloads)复制：

```bash
mkdir -p inputs/runtime/kro-20211105
cp -a /path/to/happyro-v0.2.1/resources/kro-20211105 \
  inputs/runtime/kro-20211105/client
```

## 构建与启动

```bash
make database-start
make configure-server
make build-server
make server-start
make configure-client
make configure-gateway
make configure-resources
(cd repos/happyro-client && npm install && npm run build:pwa)
make doctor
make gateway-start
```

浏览器打开 `http://127.0.0.1:3338/applications/pwa/index.html`。该页必须先显示“进入游戏”和各查看器入口。

数据库就绪后可用 `make test-account` 创建本机测试账号，账号写入 `work/runtime/test-account.env`。

Admin 使用独立仓库的 Laravel 后端、Ant Design Pro 前端和 systemd 模板，具体启动命令见 [happyro-admin](https://github.com/happyro/happyro-admin)。

## 检查与停止

```bash
make status
make database-verify
make server-verify
make gateway-verify

make gateway-stop
make server-stop
make database-stop
```
