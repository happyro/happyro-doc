---
pageClass: responsive-tables
---

# Docker 安装

推荐使用完整离线包安装。先阅读[部署概览](/deploy/)，以下操作在解压后的包根目录执行。

本文按当前源码生成的 Go API 离线包说明，使用 `api`／`api-init` 服务。若使用下载页的既有 v0.5.0 文件，请执行该包随附的部署手册，不将本文服务名直接套入旧包。版本边界见[安装运维](/deploy/)。

## 系统要求

- 容器运行环境：
  - Linux：Docker Engine 与 Docker Compose v2
  - macOS：OrbStack 或 Docker Desktop
  - Windows：Docker Desktop
- Python 3.11 或更高版本。
- 足够空间保存约数 GB 的压缩包、解压目录、Docker 镜像和数据库。

## 获取离线包

下载完整离线 ZIP，解压后进入其中的 `happyro-<版本>/` 目录。下载地址、文件名与 SHA-256 见[下载页](/guide/downloads)，部署使用包内配套的镜像、资源和工具。

解压时保留完整目录结构及空 `data/` 子目录。

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
| <span class="table-cell-label" aria-hidden="true">服务</span>Database | <span class="table-cell-label" aria-hidden="true">容器</span>`happyro-database` | <span class="table-cell-label" aria-hidden="true">用途</span>游戏与后台数据库 |
| <span class="table-cell-label" aria-hidden="true">服务</span>Login | <span class="table-cell-label" aria-hidden="true">容器</span>`happyro-login` | <span class="table-cell-label" aria-hidden="true">用途</span>游戏账号登录 |
| <span class="table-cell-label" aria-hidden="true">服务</span>Char | <span class="table-cell-label" aria-hidden="true">容器</span>`happyro-char` | <span class="table-cell-label" aria-hidden="true">用途</span>角色选择与角色数据 |
| <span class="table-cell-label" aria-hidden="true">服务</span>Map | <span class="table-cell-label" aria-hidden="true">容器</span>`happyro-map` | <span class="table-cell-label" aria-hidden="true">用途</span>地图、战斗和 NPC |
| <span class="table-cell-label" aria-hidden="true">服务</span>Web API | <span class="table-cell-label" aria-hidden="true">容器</span>`happyro-web-api` | <span class="table-cell-label" aria-hidden="true">用途</span>游戏控制与资料接口 |
| <span class="table-cell-label" aria-hidden="true">服务</span>Gateway | <span class="table-cell-label" aria-hidden="true">容器</span>`happyro-gateway` | <span class="table-cell-label" aria-hidden="true">用途</span>游戏网页、资源与 WebSocket 入口 |
| <span class="table-cell-label" aria-hidden="true">服务</span>API | <span class="table-cell-label" aria-hidden="true">容器</span>`happyro-api` | <span class="table-cell-label" aria-hidden="true">用途</span>Go API 与管理前端 |

初始化容器 `happyro-api-init` 应执行完成并以状态码 `0` 退出。

### 访问入口

默认仅限部署机器本机访问：

- 游戏：`http://127.0.0.1:3338/applications/pwa/index.html`
- 游戏后台：`http://127.0.0.1:8000`

需要让局域网其他设备访问时，将 `.env` 中的GAME_PUBLIC_URL 和 ADMIN_PUBLIC_URL 改为部署机器的局域网 IP。

### 默认账号

首次使用空数据库启动时会创建：

| 用途 | 用户名 | 密码 | 权限 |
| --- | --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">用途</span>游戏 | <span class="table-cell-label" aria-hidden="true">用户名</span>`happyro` | <span class="table-cell-label" aria-hidden="true">密码</span>`happyro` | <span class="table-cell-label" aria-hidden="true">权限</span>GM |
| <span class="table-cell-label" aria-hidden="true">用途</span>Go API 与管理前端 | <span class="table-cell-label" aria-hidden="true">用户名</span>`admin` | <span class="table-cell-label" aria-hidden="true">密码</span>`admin` | <span class="table-cell-label" aria-hidden="true">权限</span>超级管理员 |


### 默认角色：罗安

从 v0.5.0 起，首次空库初始化会在 `happyro/happyro` 的第一个角色位自动创建拍照角色“罗安”，登录后即可选择进入游戏。

| 项目 | 初始配置 |
| --- | --- |
| <span class="table-cell-label" aria-hidden="true">项目</span>性别与职业 | <span class="table-cell-label" aria-hidden="true">初始配置</span>男剑士，职业 ID 1，Base 99 / Job 50 |
| <span class="table-cell-label" aria-hidden="true">项目</span>六维属性 | <span class="table-cell-label" aria-hidden="true">初始配置</span>STR 70、AGI 60、VIT 40、INT 10、DEX 40、LUK 1 |
| <span class="table-cell-label" aria-hidden="true">项目</span>生命与魔力 | <span class="table-cell-label" aria-hidden="true">初始配置</span>HP 5758、SP 228，均为满值 |
| <span class="table-cell-label" aria-hidden="true">项目</span>点数 | <span class="table-cell-label" aria-hidden="true">初始配置</span>剩余属性点、技能点、特性点均为 0 |
| <span class="table-cell-label" aria-hidden="true">项目</span>金钱 | <span class="table-cell-label" aria-hidden="true">初始配置</span>10,000 Zeny |
| <span class="table-cell-label" aria-hidden="true">项目</span>外观 | <span class="table-cell-label" aria-hidden="true">初始配置</span>发型 1、默认颜色，无头饰 |
| <span class="table-cell-label" aria-hidden="true">项目</span>装备与物品 | <span class="table-cell-label" aria-hidden="true">初始配置</span>普通剑（1101，已装备）、红色药水 ×100、蓝色药水 ×100、波利蛋 ×1 |
| <span class="table-cell-label" aria-hidden="true">项目</span>宠物 | <span class="table-cell-label" aria-hidden="true">初始配置</span>波利已收回蛋，亲密度 950、饥饿度 100，可正常孵化 |
| <span class="table-cell-label" aria-hidden="true">项目</span>出生位置 | <span class="table-cell-label" aria-hidden="true">初始配置</span>普隆德拉 `prontera`，164,185 |
| <span class="table-cell-label" aria-hidden="true">项目</span>存档位置 | <span class="table-cell-label" aria-hidden="true">初始配置</span>普隆德拉 `prontera`，159,189 |

已学技能：基本技能 Lv.9、单手剑使用熟练度 Lv.10、快速恢复 Lv.4、狂击 Lv.10、怒爆 Lv.10、挑衅 Lv.5、霸体 Lv.10。前六个快捷栏依次配置狂击、怒爆、挑衅、霸体、红色药水、蓝色药水，技能使用上述等级，桌面与移动端共用。

不带截图账号的好友、邮件、队伍、公会或测试记录。此配置仅用于新数据库，重启或升级已有数据库不会创建、替换角色或补发物品；本机专用截图账号 `readmecapture` 不受影响。

## 下一步

- [日常维护](/deploy/maintenance)
- [备份与恢复](/deploy/backup-restore)
- [升级](/deploy/upgrade)
- [自定义 NPC、数据库与资源](/deploy/customization)
