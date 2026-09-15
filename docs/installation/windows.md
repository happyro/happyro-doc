# Windows 安装

Windows 上玩游戏请使用 [Docker 安装](/installation/docker)。本页仅说明在 WSL2 中做源码开发；浏览器仍运行在 Windows 中。

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

源码应放在 WSL 的 Linux 文件系统，例如 `~/src/happyro`，避免 `/mnt/c` 大量小文件访问。随后按 [Linux 安装](/installation/linux) 检出五个仓库、复制运行资源并构建启动。

在 Windows 浏览器打开 `http://127.0.0.1:3338/applications/pwa/index.html`。

局域网访问时，同步修改 Gateway `.env` 与 `deploy/rathena/profile.env` 中的地址，并在 Windows 防火墙放行 `3338` 端口。
