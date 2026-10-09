# Docker 安装

Docker 离线包是 HappyRO 的推荐安装方式。目标机器只需要 Docker 与 Python，不需要源码或镜像仓库。

## 系统要求

- 容器运行环境：
  - Linux：Docker Engine 与 Docker Compose v2
  - macOS：OrbStack 或 Docker Desktop
  - Windows：Docker Desktop
- Python 3.11 或更高版本。
- 足够空间保存约数 GB 的压缩包、解压目录、Docker 镜像和数据库。

## 获取离线包

以下以已取得的完整 `happyro-v0.4.0.zip` 为例。v0.4.0 已完成本机离线包及部分验收，尚不代表公开下载或生产环境已发布；公开可用版本以[下载页](/guide/downloads)为准。

```bash
unzip happyro-v0.4.0.zip
cd happyro-v0.4.0
```

Linux 和 macOS 可以使用上述命令；Windows 可以在文件资源管理器中解压 ZIP。解压后应保留唯一的 `happyro-v0.4.0/` 根目录及其中的空 `data/` 子目录。

旧版如有配套拆分交付包，必须合并同一版本的两部分，不能跨版本混用；本次 v0.4.0 验收产物是完整 ZIP。

## 校验并导入镜像

所有命令都在解压后的包根目录执行：

```bash
python3 tools/deployment/manage.py verify --directory .
python3 tools/deployment/manage.py import-images --directory .
python3 tools/deployment/manage.py initialize --directory .
```

`verify` 检查配置、资源和两个架构的镜像归档；`import-images` 根据 Docker daemon 架构只导入所需的四个镜像；`initialize` 创建 `.env`、随机运行密钥及默认 custom 目录，不启动服务。仅首次空环境运行；已有环境按[升级流程](/container/upgrade)处理。

## 配置访问地址

默认仅允许部署机器本机访问。编辑 `.env`，需要局域网访问时再将以下值同步改为部署机器的局域网地址：

```dotenv
GAME_PUBLIC_URL=http://127.0.0.1:3338
ADMIN_PUBLIC_URL=http://127.0.0.1:8000
ADMIN_STATEFUL_DOMAINS=127.0.0.1:8000
```

镜像变量与 RELEASE_VERSION 保持包内版本。RESOURCE_DIR 指向本版资源；DATA_DIR 和 CUSTOM_DIR 可设为版本目录外的专用绝对路径。若改变 DATA_DIR，需准备完整数据子目录；改变 CUSTOM_DIR 后执行：

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
```

该命令只补缺少模板，不覆盖已有定制。具体操作见[自定义 NPC、数据库与资源](/container/customization)。

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

`docker compose down` 不删除 bind mount 到包内 `data/` 的数据库和设置。完整步骤见[升级、备份与恢复](/container/upgrade)，并核对所用离线包的 README 和勘误。首次引入 custom 必须采用完整新版配置和工具，不能只替换镜像。


## 从源码打包

构建机器另外需要 Python 3.11+、Buildx、Skopeo、完整的源码和运行资源。按根仓库的[镜像构建与交付流程](https://github.com/happyro/happyro/blob/main/docs/operations/docker-release.md)执行 prepare、verify、全量双架构 build、package 和最终 verify。全部镜像成功后才能组装；不要把自己的 .env、custom 或存档放进发行包。

部署端只需完整包、Docker 和 Python，不需要现场构建。源码文档更新不会自动修改已下载的 ZIP；v0.4.0 本轮包内 README 的按文件卸载命令应更正为 `@unloadnpcfile`，原 ZIP 摘要保持不变。
