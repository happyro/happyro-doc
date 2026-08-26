# Installation

This guide targets Linux with systemd. On Windows, follow the [WSL2 guide](/en/windows-installation).

## Prerequisites

Install Git, GNU Make, CMake, a C++ compiler, Node.js 22 or newer, npm, Docker Compose, OpenSSL, ripgrep, jq, curl, `ss`, and systemd. `make doctor` validates the environment but does not install dependencies or start services.

## Prepare the source tree

```bash
git clone https://github.com/happyro/happyro.git
cd happyro
git clone https://github.com/happyro/happyro-client.git repos/happyro-client
git clone https://github.com/happyro/happyro-server.git repos/happyro-server
git clone https://github.com/FranciscoWallison/roBrowserLegacy-RemoteClient-JS.git vendor/robrowserlegacy-remote-client-js
source versions/sources.lock
git -C vendor/robrowserlegacy-remote-client-js checkout "$REMOTE_CLIENT_JS_UPSTREAM_COMMIT"
git -C vendor/robrowserlegacy-remote-client-js apply ../../patches/remote-client-js/0001-disable-unavailable-esrgan-dependency.patch
git -C vendor/robrowserlegacy-remote-client-js apply ../../patches/remote-client-js/0002-proxy-rathena-web-api.patch
```

## Configure the stack

Update `configs/Config.happyro.js`, `deploy/mariadb/profile.env`, `deploy/rathena/profile.env`, and `deploy/remote-client/.env.example` for your environment. Keep the client address, rAthena listeners, gateway WebSocket allowlist, and public origin consistent. A single-machine setup can use `127.0.0.1`; LAN clients require an address reachable from that network.

## Add kRO runtime files

Place legally obtained, compatible resources at:

```text
inputs/runtime/kro-20211105/client/
├── data.grf
├── DATA.INI
├── AI/       # optional
├── BGM/      # optional
└── System/   # optional
```

`data.grf` and `DATA.INI` are required. These copyrighted third-party resources are not distributed in the source repositories; see [Copyright and resources](/en/translation#copyright-and-resources).

## Build and start

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

Open `http://<server-address>:3338/applications/pwa/index.html`. The lifecycle commands require Docker and systemd access.

## Stop and test

```bash
make gateway-stop
make server-stop
make database-stop
```

```bash
make doctor
make test-client
make test-gateway
make database-verify
make server-verify
make gateway-verify
make status
```

The doctor and test targets are validation commands, not part of routine startup.
