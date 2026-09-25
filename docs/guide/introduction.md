# 项目简介

HappyRO 是一个基于 [roBrowserLegacy](https://github.com/MrAntares/roBrowserLegacy) 与 [rAthena](https://github.com/rathena/rathena) 构建的开源中文《仙境传说 Online》Web 项目。玩家打开浏览器即可登录、创建角色并进入游戏，无需安装桌面客户端；GM 可以通过独立管理后台维护玩家、资料和游戏参数。

## 核心能力

- 浏览器 PWA：登录、角色选择、地图渲染、音效与完整查看器启动页。
- 多端界面：提供 [电脑桌面](/game/desktop) 与 [手机平板](/game/mobile) 界面，触屏支持移动、快捷技能和自动战斗。
- 中文本地化：客户端 UI、系统消息、物品、技能、魔物、地图和 NPC。
- 冒险工具：在游戏内查询地图、魔物、NPC、物品，并进行导航和角色维护。
- 管理后台：用户管理、运营发放、在线控制、参数修改和审计记录；在线体验见 [happyro-admin.kugarocks.com](https://happyro-admin.kugarocks.com)。
- 离线部署：同时提供 `linux/amd64` 与 `linux/arm64` 镜像、运行资源、校验、备份和恢复工具。

## 项目组成

| 仓库 | 职责 |
| --- | --- |
| [happyro](https://github.com/happyro/happyro) | 部署脚本、配置、本地化资源、文档和发布编排 |
| [happyro-client](https://github.com/happyro/happyro-client) | 浏览器客户端、PWA 与游戏内冒险工具 |
| [happyro-server](https://github.com/happyro/happyro-server) | rAthena 登录、角色、地图和 Web API 服务 |
| [happyro-gateway](https://github.com/happyro/happyro-gateway) | Node.js 网关、静态资源、HTTP 与 WebSocket 代理 |
| [happyro-admin](https://github.com/happyro/happyro-admin) | 管理后台、Laravel API 与 Ant Design Pro 前端 |

根仓库与四个应用仓库维护独立 Git 历史，长期中文产品分支均为 `main`。

## 运行关系

```text
浏览器 / PWA
      │ HTTP / WebSocket
      ▼
HappyRO Gateway
      ├── PWA 与 kRO 运行资源
      ├── login / char / map / web
      └── Admin API
              │
              ▼
           MariaDB
```

浏览器只访问 Gateway。Gateway 提供 PWA 与运行资源，并将连接转发到 Server；Admin 通过受控 Game Control 通道读取和维护游戏世界；Server 与 Admin 使用 MariaDB 保存玩家、日志和管理数据。

## 技术基线

| 项目 | 基线 |
| --- | --- |
| kRO 客户端资源 | 2021-11-05 |
| `PACKETVER` | `20211103` |
| 服务端模式 | Renewal |
| Node.js | 22 或更高版本 |
| MariaDB | 10.11 |
| 当前发布版本 | `v0.3.2`（离线包与 Docker Hub） |
