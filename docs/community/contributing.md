# 贡献指南

HappyRO 接受客户端、服务端、Gateway、Admin、部署、文档和中文本地化改进。开始修改前先确认代码归属，避免把一个产品变更拆到错误仓库。

## 仓库

| 仓库 | 内容 |
| --- | --- |
| [happyro](https://github.com/happyro/happyro) | 跨仓库编排、部署、资源、本地化和文档 |
| [happyro-client](https://github.com/happyro/happyro-client) | 浏览器客户端和冒险工具 |
| [happyro-server](https://github.com/happyro/happyro-server) | rAthena 服务端 |
| [happyro-gateway](https://github.com/happyro/happyro-gateway) | HTTP、WebSocket 和资源网关 |
| [happyro-admin](https://github.com/happyro/happyro-admin) | 管理后台 |

## 基本流程

1. 从目标仓库 `main` 创建主题分支。
2. 阅读目标仓库的 `AGENTS.md` 和相关设计文档。
3. 一次提交只处理一个逻辑变更，并补充对应 changelog。
4. 运行相关测试、构建和真实交互验收。
5. 检查工作区，避免提交 kRO 资源、密钥、数据库、日志和中间产物。

HappyRO 自有提交使用 `type(scope): subject` 格式。玩家可见文本使用中文；代码标识、技术日志和上游内容保持其约定语言。
