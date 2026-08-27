# Windows 安装

HappyRO 当前的构建与运行脚本依赖 Bash、Linux 工具链、Docker Compose 和 systemd，因此 Windows 平台使用 WSL2 运行完整服务。浏览器仍直接使用 Windows 上的 Chrome、Edge 或 Firefox，不需要安装传统 RO 桌面客户端。

## 安装 WSL2

以管理员身份打开 PowerShell：

```powershell
wsl --install -d Ubuntu
```

按提示重启 Windows，完成 Ubuntu 用户初始化后检查 WSL 状态：

```powershell
wsl --status
```

HappyRO 的服务脚本需要 systemd。进入 Ubuntu 执行 `systemctl is-system-running`；若 systemd 未启用，在 `/etc/wsl.conf` 中配置以下内容，然后回到 PowerShell 执行 `wsl --shutdown` 并重新打开 Ubuntu：

```ini
[boot]
systemd=true
```

## 安装工具链

在 WSL 的 Ubuntu 终端中执行：

```bash
sudo apt update
sudo apt install -y git make build-essential cmake pkg-config libmariadb-dev libpcre3-dev zlib1g-dev libssl-dev curl jq ripgrep iproute2 openssl ca-certificates
```

在 WSL 内安装 Node.js 22 或更高版本并确认 `node --version` 与 `npm --version` 可用。数据库需要 Docker Compose，可在 Windows 安装 Docker Desktop 并为当前 Ubuntu 发行版启用 WSL integration，也可以直接在 WSL 内安装 Docker Engine 与 Compose 插件。完成后检查：

```bash
docker version
docker compose version
systemctl is-system-running
```

## 放置项目

将源码放在 WSL 的 Linux 文件系统中，例如 `~/src/happyro`，不要放在 `/mnt/c` 下。这样可以避免跨文件系统访问拖慢前端依赖安装、服务端编译和大量资源读取，也能保证符号链接与权限行为一致。

按照 [Linux 安装页的“准备源码”步骤](/installation/linux#准备源码)克隆根仓库、客户端、服务端和网关。然后将 kRO 资源放入：

```text
~/src/happyro/inputs/runtime/kro-20211105/client/
```

## 配置本机访问

仅从当前 Windows 电脑访问时，将以下配置中的服务地址统一设为 `127.0.0.1`，并保留项目定义的端口：

- `configs/Config.happyro.js` 中的游戏服务器 `address`
- `deploy/rathena/profile.env` 中的 `SERVER_LAN_IP` 和站点来源
- `deploy/remote-client/.env.example` 中的 `CLIENT_PUBLIC_URL` 与 `WS_ALLOWED_TARGETS`

如果还要让同一局域网中的其他设备访问，需要改用 WSL/Windows 对外可达的地址，并同时配置 Windows 防火墙和端口转发。不要只修改客户端地址，否则网关的 WebSocket 白名单会拒绝连接。

## 构建并运行

在 WSL 项目目录中执行：

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

启动后在 Windows 浏览器访问：

```text
http://localhost:3338/applications/pwa/index.html
```

如果 `systemd-run` 或 Docker 报权限错误，请为当前 WSL 用户配置对应权限，或在需要时以管理员权限运行启动命令。不要在 Windows PowerShell 中直接运行 Makefile 命令。

## 验证与停止

```bash
make status
make database-verify
make server-verify
make gateway-verify
```

```bash
make gateway-stop
make server-stop
make database-stop
```
