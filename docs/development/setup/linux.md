# Linux 开发环境

本页面向需要修改和编译 HappyRO 的开发者。玩游戏请使用 [Docker 安装](/deploy/docker)。

## 依赖

需要 Git、GNU Make、CMake、C++ 编译器、Node.js 22+、npm、Python 3、Docker Compose、MariaDB 客户端、OpenSSL、ripgrep、jq、curl、`ss` 和 systemd。

Debian 或 Ubuntu：

```bash
sudo apt update
sudo apt install -y git make build-essential cmake pkg-config \
  libmariadb-dev libpcre3-dev zlib1g-dev libssl-dev python3 \
  curl jq ripgrep iproute2 openssl ca-certificates mariadb-client
```

另行安装 Node.js 22+、Docker Engine 和 Compose v2，并确保当前用户可运行 Docker 与 systemd。

## 源码与资源

完成[共用准备步骤](/development/setup/#检出六个构建仓库)，再继续以下操作。

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

`make doctor` 还会核对上游锁定基线；维护分支包含后续提交时，不能为通过检查回退产品代码。按[根仓库故障检查](https://github.com/happyro/happyro/blob/main/docs/operations/troubleshooting.md)核实具体失败项。

浏览器打开 `http://127.0.0.1:3338/applications/pwa/index.html`。该页必须先显示“进入游戏”和各查看器入口。

数据库就绪后可用 `make test-account` 创建本机测试账号，账号写入 `work/runtime/test-account.env`。

当前开发源码将 Admin 前端与 Go API 分离：happyro-admin 提供 React / Umi 前端，happyro-api 提供 Go 后端与 happyro-api.service 模板。API 必须使用全新管理库，不能直接复用旧 Laravel 管理库；该迁移尚未正式发布，已发布离线包仍按对应版本说明部署。

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
