# 架构与仓库边界

## 项目组成

| 仓库 | 职责 |
| --- | --- |
| [happyro](https://github.com/happyro/happyro) | 部署脚本、配置、本地化资源、文档和发布编排 |
| [happyro-client](https://github.com/happyro/happyro-client) | 浏览器客户端、PWA 与游戏内冒险工具 |
| [happyro-server](https://github.com/happyro/happyro-server) | rAthena 登录、角色、地图和 Web API 服务 |
| [happyro-gateway](https://github.com/happyro/happyro-gateway) | Node.js 网关、静态资源、HTTP 与 WebSocket 代理 |
| [happyro-admin](https://github.com/happyro/happyro-admin) | 管理后台 React / Umi / Ant Design 前端（当前开发源码） |
| [happyro-api](https://github.com/happyro/happyro-api) | 新增独立 Go / Gin 后端，为后台与游戏工具提供 API；尚未正式发布 |
| [happyro-doc](https://github.com/happyro/happyro-doc) | 公开文档站、玩家指南与安装说明 |

根仓库、五个应用仓库与文档仓库维护独立 Git 历史，长期中文产品分支均为 `main`。

## 运行关系

```text
浏览器 / PWA
      │ HTTP / WebSocket
      ▼
HappyRO Gateway
      ├── PWA 与 kRO 运行资源
      ├── login / char / map / web
      └── Go API ← Admin 管理前端
              │
              ▼
           MariaDB
```

游戏浏览器访问 Gateway，管理人员使用 Admin 前端。Gateway 提供 PWA 与运行资源，代理 Server 连接和玩家工具 API；Admin 前端调用同一 Go API 的管理接口。Go API 通过受控 Game Control 通道读取和维护游戏世界，在线状态由 Server 裁决；玩家、日志和管理数据分别存放在 MariaDB 的独立数据库中。


## 文档归属

玩家指南、攻略、后台操作和公开部署说明维护在本文档站；内部设计、实现计划、测试证据与发行构建流程维护在根仓库或对应应用仓库。对外文档引用实现入口，不复制内部进度和临时验收记录。

更新日志以根仓库为唯一内容源，通过 `python3 tools/changelog/manage.py sync` 同步本站，不在本站单独改写发布记录。
