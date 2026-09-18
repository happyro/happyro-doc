# Docker 安装

Docker 离线包是 HappyRO 的推荐安装方式。目标机器只需要 Docker 与 Python，不需要源码或镜像仓库。

## 系统要求

- 容器运行环境：
  - Linux：Docker Engine 与 Docker Compose v2
  - macOS：OrbStack 或 Docker Desktop
  - Windows：Docker Desktop
- Python 3.9 或更高版本。
- 足够空间保存约数 GB 的压缩包、解压目录、Docker 镜像和数据库。

## 获取离线包

从[下载页](/downloads)获取 `happyro-v0.2.1.zip`。

```bash
unzip happyro-v0.2.1.zip
cd happyro-v0.2.1
```

Linux 和 macOS 可以使用上述命令；Windows 可以在文件资源管理器中解压 ZIP。解压后应保留唯一的 `happyro-v0.2.1/` 根目录及其中的空 `data/` 子目录。

## 校验并导入镜像

所有命令都在解压后的包根目录执行：

```bash
python3 tools/deployment/manage.py verify --directory .
python3 tools/deployment/manage.py import-images --directory .
python3 tools/deployment/manage.py initialize --directory .
```

`verify` 检查配置、资源和两个架构的镜像归档；`import-images` 根据 Docker daemon 架构只导入所需的四个镜像；`initialize` 创建 `.env` 和随机运行密钥，不启动服务。

## 配置访问地址

默认仅允许部署机器本机访问。编辑 `.env`，需要局域网访问时再将以下值同步改为部署机器的局域网地址：

```dotenv
GAME_PUBLIC_URL=http://127.0.0.1:3338
ADMIN_PUBLIC_URL=http://127.0.0.1:8000
ADMIN_STATEFUL_DOMAINS=127.0.0.1:8000
```

不要修改包内四个镜像变量、`RELEASE_VERSION`、`RESOURCE_DIR` 或 `DATA_DIR`，除非你明确调整了对应目录。

## 启动游戏

```bash
python3 tools/deployment/manage.py deploy --directory .
docker compose ps -a
```

部署从包内导入镜像，不会拉取或现场构建。启动完成后，可按下面几项检查运行状态。

### 服务状态

以下七个服务应显示为 `healthy`：

| 服务 | 容器 | 用途 |
| --- | --- | --- |
| Database | `happyro-database` | 游戏与后台数据库 |
| Login | `happyro-login` | 游戏账号登录 |
| Char | `happyro-char` | 角色选择与角色数据 |
| Map | `happyro-map` | 地图、战斗和 NPC |
| Web API | `happyro-web-api` | 游戏控制与资料接口 |
| Gateway | `happyro-gateway` | 游戏网页、资源与 WebSocket 入口 |
| Admin | `happyro-admin` | 游戏后台 |

初始化容器 `happyro-admin-init` 应执行完成并以状态码 `0` 退出。

### 访问入口

默认仅限部署机器本机访问：

- 游戏：`http://127.0.0.1:3338/applications/pwa/index.html`
- 游戏后台：`http://127.0.0.1:8000`

需要让局域网其他设备访问时，将 `.env` 中的公开地址和 `ADMIN_STATEFUL_DOMAINS` 同步改为部署机器的局域网 IP。

### 默认账号

首次使用空数据库启动时会创建：

| 用途 | 用户名 | 密码 | 权限 |
| --- | --- | --- | --- |
| 游戏 | `happyro` | `happyro` | GM |
| 游戏后台 | `admin` | `admin` | 超级管理员 |

## 日常维护

```bash
docker compose ps -a
docker compose logs --tail=100 gateway admin web-api
docker compose restart
docker compose down
```

`docker compose down` 不删除 bind mount 到包内 `data/` 的数据库和设置。完整升级、备份和恢复流程以离线包内 `README.md` 为准。
