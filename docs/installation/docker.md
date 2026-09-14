# Docker 安装

Docker 是 HappyRO 的推荐部署方式。完整离线包包含应用镜像、运行资源、配置、校验清单和管理工具，可在目标机器不连接镜像仓库的情况下安装。Docker Hub 镜像适合镜像同步与检查，但不能替代离线包中的资源和配置。

## 系统要求

- Docker Engine 与 Docker Compose v2；macOS、Windows 可使用 Docker Desktop。
- Python 3.11 或更高版本。
- 足够空间保存约数 GB 的压缩包、解压目录、Docker 镜像和数据库。

## 获取离线包

从[下载页](/downloads)获取 `happyro-v0.2.0.tar.gz` 和对应 SHA-256。下载地址公布前，本页命令可用于已经拿到离线包的环境。

```bash
shasum -a 256 happyro-v0.2.0.tar.gz
tar -xzf happyro-v0.2.0.tar.gz
cd happyro-v0.2.0
```

macOS 解压包含非 ASCII 文件名的归档时建议使用 GNU tar：

```bash
brew install gnu-tar
gtar -xzf happyro-v0.2.0.tar.gz
```

## 校验并导入镜像

所有命令都在解压后的包根目录执行：

```bash
python3 tools/deployment/manage.py verify --directory .
python3 tools/deployment/manage.py import-images --directory .
python3 tools/deployment/manage.py initialize --directory .
```

`verify` 检查配置、36,000 余个资源文件及两个架构的镜像归档；`import-images` 根据 Docker daemon 架构只导入所需的四个镜像；`initialize` 创建 `.env` 和随机运行密钥，不启动服务。

## 配置访问地址

编辑 `.env`，将以下值改为部署机器当前的局域网地址：

```dotenv
GAME_PUBLIC_URL=http://192.168.1.20:3338
ADMIN_PUBLIC_URL=http://192.168.1.20:8000
ADMIN_STATEFUL_DOMAINS=192.168.1.20:8000
```

不要修改包内四个镜像变量、`RELEASE_VERSION`、`RESOURCE_DIR` 或 `DATA_DIR`，除非你明确调整了对应目录。

## 启动

```bash
python3 tools/deployment/manage.py deploy --directory .
docker compose ps -a
```

正常状态为七个长期服务 `healthy`，`happyro-admin-init` 退出码为 `0`。Compose 使用 `pull_policy=never`，部署不会从 Docker Hub 拉取镜像，也不会现场构建。

访问入口：

- 游戏：`http://<主机IP>:3338/applications/pwa/index.html`
- 后台：`http://<主机IP>:8000`

首次空库初始化会创建：

- 游戏 GM：`happyro / happyro`
- 后台超级管理员：`admin / admin`

## Docker Hub

发布镜像为：

```bash
docker pull kugarocks/happyro-gateway:v0.2.0
docker pull kugarocks/happyro-server:v0.2.0
docker pull kugarocks/happyro-admin:v0.2.0
docker pull kugarocks/happyro-database:v0.2.0
```

每个标签都包含 `linux/amd64` 与 `linux/arm64`。镜像不包含 kRO GRF、BGM、System、图鉴图片和部署密钥，不能只用四条 `docker run` 命令组成完整环境；Compose、资源和初始化流程以同版本离线包为准。

## 日常维护

```bash
docker compose ps -a
docker compose logs --tail=100 gateway admin web-api
docker compose restart
docker compose down
```

`docker compose down` 不删除 bind mount 到包内 `data/` 的数据库和设置。完整升级、备份和恢复流程以离线包内 `README.md` 为准。
