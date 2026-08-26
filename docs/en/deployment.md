# Production deployment

Use the Makefile workflow in [Installation](/en/installation) for development. The public demo uses the `demo` branch of all three repositories. Build the artifacts locally, package them, and deploy the archive to Linux; the target server does not need source repositories or frontend/server build tools.

## Build the release

With all three repositories on clean `demo` branches, run:

```bash
tools/deploy/package-demo.sh --build
```

The default output is `work/deploy/happyro-demo-<date-time>.tar.gz`. It includes the built PWA, rAthena executables, gateway, Chinese overlays, and deployment scripts. It excludes Git history, secrets, database data, logs, and kRO runtime resources.

## Server layout

Use immutable release directories and switch a `current` symlink when publishing:

```text
/opt/happyro-demo/
├── releases/<version>/
└── current -> releases/<version>/
```

Store kRO files separately in a protected directory and point the runtime configuration to it. Never add these resources to the release archive or a public source repository.

## Service boundary

Production uses persistent systemd units for database initialization, rAthena login/char/map/web, and the gateway. A systemd timer resets the demo database. Native MariaDB listens only on loopback, and a reverse proxy exposes the site over HTTP/HTTPS.

Follow `deployment/docs/deploy/production/README.md` inside each release archive for the exact installation, service, and validation commands matching that release. After switching versions, verify all systemd services, the reset timer, gateway health endpoint, PWA page, and a real login.
