# Windows 安装

Windows 普通部署推荐使用 Docker Desktop 和 [HappyRO 离线包](/installation/docker)。需要源码开发时，在 WSL2 中使用 Linux 工具链，浏览器仍运行在 Windows 中。

## 安装 WSL2

管理员 PowerShell：

```powershell
wsl --install -d Ubuntu
```

重启并完成 Ubuntu 初始化。HappyRO 源码脚本需要 systemd；若尚未启用，在 `/etc/wsl.conf` 写入：

```ini
[boot]
systemd=true
```

回到 PowerShell 执行 `wsl --shutdown`，重新进入 Ubuntu。

## 安装开发依赖

```bash
sudo apt update
sudo apt install -y git make build-essential cmake pkg-config \
  libmariadb-dev libpcre3-dev zlib1g-dev libssl-dev \
  curl jq ripgrep iproute2 openssl ca-certificates mariadb-client
```

安装 Node.js 22+。Docker 可使用 Docker Desktop 的 WSL integration，或在 WSL 内安装 Docker Engine 与 Compose v2。

## 放置源码与资源

源码应放在 WSL 的 Linux 文件系统，例如 `~/src/happyro`，避免 `/mnt/c` 大量小文件访问。按照 [Linux 的五仓库步骤](/installation/linux#检出五个仓库)检出源码，再从离线包复制资源：

```bash
mkdir -p inputs/runtime/kro-20211105
cp -a /path/to/happyro-v0.2.0/resources/kro-20211105 \
  inputs/runtime/kro-20211105/client
```

## 构建与运行

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

在 Windows 浏览器打开 `http://127.0.0.1:3338/applications/pwa/index.html`。

如需让局域网其他设备访问，使用 Windows/WSL 对外可达地址，并同步修改客户端公开地址、Gateway 白名单和服务端来源配置，同时放行 Windows 防火墙端口。
