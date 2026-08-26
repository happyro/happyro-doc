# Windows installation

HappyRO build and lifecycle scripts depend on Bash, Linux build tools, Docker Compose, and systemd. Run the complete stack in WSL2 on Windows. The game itself still runs in Chrome, Edge, or Firefox on Windows, with no traditional RO desktop client.

## Install WSL2

Open PowerShell as Administrator:

```powershell
wsl --install -d Ubuntu
```

Restart Windows when requested, finish Ubuntu user setup, and verify WSL:

```powershell
wsl --status
```

Run `systemctl is-system-running` in Ubuntu. If systemd is disabled, add the following to `/etc/wsl.conf`, run `wsl --shutdown` in PowerShell, and reopen Ubuntu:

```ini
[boot]
systemd=true
```

## Install the toolchain

In Ubuntu under WSL:

```bash
sudo apt update
sudo apt install -y git make build-essential cmake pkg-config libmariadb-dev libpcre3-dev zlib1g-dev libssl-dev curl jq ripgrep iproute2 openssl ca-certificates
```

Install Node.js 22 or newer inside WSL. For Docker Compose, either enable Docker Desktop WSL integration for this Ubuntu distribution or install Docker Engine and the Compose plugin inside WSL. Verify the environment:

```bash
node --version
npm --version
docker version
docker compose version
systemctl is-system-running
```

## Place and configure HappyRO

Keep the repository in the WSL filesystem, such as `~/src/happyro`, rather than under `/mnt/c`. This avoids cross-filesystem performance, permission, and symlink issues.

Follow [Prepare the source tree](/en/installation#prepare-the-source-tree), then place kRO runtime files under `~/src/happyro/inputs/runtime/kro-20211105/client/`.

For access only from this Windows computer, consistently set the game address in `configs/Config.happyro.js`, `SERVER_LAN_IP` and the origin in `deploy/rathena/profile.env`, and the public URL and WebSocket allowlist in `deploy/remote-client/.env.example` to `127.0.0.1`. LAN access requires a reachable host address plus matching Windows firewall and port-forwarding configuration.

## Build and run

Run these commands in the WSL project directory:

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

Open `http://localhost:3338/applications/pwa/index.html` in a Windows browser. Run the Makefile commands in Ubuntu, not PowerShell. If Docker or `systemd-run` reports a permission error, grant the WSL user the required access or run the affected lifecycle command with administrative privileges.

## Verify and stop

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
