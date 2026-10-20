# Docker 安装

::: info 适用版本
本页按当前主分支说明，包含 v0.5.0 开发中功能；已发布离线包以[下载页](/guide/downloads)与对应版本说明为准。
:::

推荐使用完整离线包安装。先阅读[部署概览](/deploy/)，以下操作在解压后的包根目录执行。

## 系统要求

- 容器运行环境：
  - Linux：Docker Engine 与 Docker Compose v2
  - macOS：OrbStack 或 Docker Desktop
  - Windows：Docker Desktop
- Python 3.11 或更高版本。
- 足够空间保存约数 GB 的压缩包、解压目录、Docker 镜像和数据库。

## 获取离线包

以下以已取得的完整 `happyro-v0.5.0.zip` 为例。v0.5.0 当前待发布；以下命令供取得最终包后使用，公开可用版本以[下载页](/guide/downloads)为准。

```bash
unzip happyro-v0.5.0.zip
cd happyro-v0.5.0
```

Linux 和 macOS 可以使用上述命令；Windows 可以在文件资源管理器中解压 ZIP。解压后应保留唯一的 `happyro-v0.5.0/` 根目录及其中的空 `data/` 子目录。

旧版如有配套拆分交付包，必须合并同一版本的两部分，不能跨版本混用；v0.5.0 默认交付完整 ZIP，实际交付信息以正式发布记录为准。

## 校验并导入镜像

所有命令都在解压后的包根目录执行：

```bash
python3 tools/deployment/manage.py verify --directory .
python3 tools/deployment/manage.py import-images --directory .
python3 tools/deployment/manage.py initialize --directory .
```

`verify` 检查配置、资源和两个架构的镜像归档；`import-images` 根据 Docker daemon 架构只导入所需的四个镜像；`initialize` 创建 `.env`、随机运行密钥及默认 custom 目录，不启动服务。仅首次空环境运行；已有环境按[升级流程](/deploy/upgrade)处理。

## 配置与启动

启动前按[访问地址与目录配置](/deploy/configuration)设置 `.env`。域名入口另见[HTTPS 与反向代理](/deploy/reverse-proxy)。

## 启动游戏

```bash
python3 tools/deployment/manage.py deploy --directory .
docker compose ps -a
```

deploy 使用已导入的本版镜像，不会拉取或现场构建；先等待数据库健康并执行登录会话表及撤销触发器升级，成功后才启动整栈，失败则停止后续启动。客户端、Gateway、Server 与 Database 须配套更新，详见[升级流程](/deploy/upgrade)。启动完成后，可按下面几项检查运行状态。

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

## 下一步

- [日常维护](/deploy/maintenance)
- [备份与恢复](/deploy/backup-restore)
- [升级](/deploy/upgrade)
- [自定义 NPC、数据库与资源](/deploy/customization)
