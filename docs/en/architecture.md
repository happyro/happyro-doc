# Architecture

HappyRO consists of three independent Git repositories and one pinned gateway dependency. The root repository owns configuration, Chinese runtime overlays, build scripts, and orchestration. `happyro-client` is the roBrowserLegacy-derived browser client, while `happyro-server` is the rAthena-derived game server.

## Request flow

```text
Browser / PWA
      │ HTTPS or HTTP
      ▼
Reverse proxy (optional in production)
      │
      ▼
HappyRO Gateway
      ├── PWA and kRO runtime resources
      ├── WebSocket ───────────────┐
      └── same-origin HTTP API ────┤
                                  ▼
                       rAthena login / char / map / web
                                  │
                                  ▼
                              MariaDB
```

The browser talks only to the gateway or its reverse proxy. The gateway serves the PWA from `repos/happyro-client/dist/Web`, proxies rAthena over WebSocket, and exposes the rAthena Web API under the same origin. A production deployment should expose only HTTP/HTTPS from the reverse proxy; database, rAthena, and gateway ports stay on loopback or a controlled network.

## Repository layout

| Path | Responsibility |
| --- | --- |
| `configs/` | Browser client runtime configuration |
| `deploy/` | MariaDB, rAthena, gateway, and demo deployment configuration |
| `inputs/official/` | Read-only official source material |
| `inputs/runtime/kro-20211105/client/` | Locally supplied kRO runtime files, excluded from Git |
| `localization/client/data/` | Active Chinese client runtime overlays |
| `repos/happyro-client/` | HappyRO client repository and PWA build |
| `repos/happyro-server/` | HappyRO server repository |
| `vendor/robrowserlegacy-remote-client-js/` | Pinned and patched gateway dependency |
| `scripts/` | Configuration, build, lifecycle, and verification scripts |
| `work/` | Database data, logs, and generated local state |

`repos/`, `vendor/`, `inputs/runtime/`, and `work/` are not committed by the root repository. The root, client, and server repositories each push only to their own `origin`.

## Runtime contracts

Client and server are fixed to `PACKETVER=20211103`, Renewal mode, and matching packet settings. Official kRO 2021-11-05 inputs remain read-only. Active product translations live only in the client repository, server repository, and `localization/client/data/`.

Local development runs MariaDB through Docker Compose and manages rAthena and the gateway with transient systemd units. Demo production releases are built from the `demo` branches and use persistent systemd services, a native MariaDB installation, and a reverse proxy on the target Linux host.
