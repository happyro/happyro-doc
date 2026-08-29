# macOS

macOS 可以原生编译和运行 HappyRO。下面的流程不使用 systemd 或 Docker，数据库、rAthena 和 Gateway 都由当前用户直接启动。

## 安装依赖

使用 Homebrew 安装工具链和 MariaDB：

```bash
brew install git make cmake pkg-config node@22 mariadb pcre jq ripgrep
brew services start mariadb
```

确认 `node --version` 为 22 或更高版本，并确认 `mariadb --version` 可用。

## 准备源码和资源

按照 [Linux 安装页的“准备源码”步骤](/installation/linux#准备源码)克隆根仓库、客户端、服务端和 HappyRO Gateway，再将下载的 [kRO 资源](/downloads#kro-客户端)放入：

```text
inputs/runtime/kro-20211105/client/
```

至少需要 `data.grf` 和 `DATA.INI`。然后配置客户端、Gateway 和资源软链接：

```bash
make configure-client
make configure-gateway
bash scripts/resources/configure-resources.sh
```

## 初始化数据库

macOS 原生 MariaDB 默认监听 `3306`。在 `deploy/mariadb/profile.env` 中将 `DB_PORT` 改为 `3306`，并设置 `DB_BIND_IP=127.0.0.1`。创建数据库和用户后，导入服务端 SQL：

```bash
mariadb -u root <<'SQL'
CREATE DATABASE IF NOT EXISTS happyro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS happyro_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'happyro'@'localhost' IDENTIFIED BY 'change-this-password';
CREATE USER IF NOT EXISTS 'happyro'@'127.0.0.1' IDENTIFIED BY 'change-this-password';
GRANT ALL PRIVILEGES ON happyro.* TO 'happyro'@'localhost';
GRANT ALL PRIVILEGES ON happyro_log.* TO 'happyro'@'localhost';
GRANT ALL PRIVILEGES ON happyro.* TO 'happyro'@'127.0.0.1';
GRANT ALL PRIVILEGES ON happyro_log.* TO 'happyro'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

mariadb -u happyro -p happyro < repos/happyro-server/sql-files/main.sql
mariadb -u happyro -p happyro < repos/happyro-server/sql-files/web.sql
mariadb -u happyro -p happyro < repos/happyro-server/sql-files/roulette_default_data.sql
mariadb -u happyro -p happyro_log < repos/happyro-server/sql-files/logs.sql

mariadb -u happyro -p happyro <<'SQL'
UPDATE login
SET userid = 'happyro_interserver',
    user_pass = 'change-this-interserver-password',
    sex = 'S'
WHERE account_id = 1;
SQL
```

将两个示例密码替换为实际密码，并创建服务端配置所需的密钥文件：

```bash
mkdir -p work/runtime/mariadb-10.11
cat > work/runtime/mariadb-10.11/secrets.env <<'EOF'
DB_PASSWORD=change-this-password
INTERSERVER_USER=happyro_interserver
INTERSERVER_PASSWORD=change-this-interserver-password
EOF
chmod 600 work/runtime/mariadb-10.11/secrets.env
```

`INTERSERVER_PASSWORD` 必须与前面写入 `login` 表的密码一致。然后生成 rAthena 配置：

```bash
bash scripts/server/configure-server.sh
```

## 构建

```bash
npm --prefix repos/happyro-client install
npm --prefix repos/happyro-client run build:pwa
npm --prefix repos/happyro-gateway install --ignore-scripts
make build-server
```

## 启动服务

打开四个终端窗口，在服务端仓库目录分别运行：

```bash
./login-server
./char-server
./map-server
./web-server
```

再打开第五个终端，在 Gateway 仓库目录运行：

```bash
node start-prod.js
```

Gateway 默认监听 `3338`，浏览器访问：

```text
http://127.0.0.1:3338/applications/pwa/index.html
```

停止服务时，在各终端按 `Ctrl-C`，再执行 `brew services stop mariadb` 停止数据库。

## 局域网访问

如果需要让其他设备访问，将客户端地址、rAthena 监听地址、Gateway 的 WebSocket 白名单和站点来源统一改为 Mac 在局域网中的地址，并在 macOS 防火墙中放行 `3338`。数据库和 rAthena 端口仍应只监听回环地址。
