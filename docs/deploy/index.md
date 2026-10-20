# 安装运维

推荐使用完整 Docker 离线包，应用与数据库以容器运行，客户端资源从配套目录挂载。源码开发见[开发指南](/development/)，不需要为了安装游戏先编译源码。

## 首次部署

[选择下载版本](/guide/downloads) → [Docker 安装](/deploy/docker) → [访问地址配置](/deploy/configuration) → [登录与角色](/game/getting-started)。

使用域名、HTTPS 或手机添加到主屏幕时，继续阅读[反向代理](/deploy/reverse-proxy)。

## 已有环境

| 需求 | 文档 |
| --- | --- |
| 状态、日志、重启与停服 | [日常维护](/deploy/maintenance) |
| 保存存档、异机恢复、回退准备 | [备份与恢复](/deploy/backup-restore) |
| 更新完整离线包 | [升级](/deploy/upgrade) |
| 增加 NPC、数据库条目和资源 | [自定义功能](/deploy/customization) |
| 无法登录、旧资源或导入失败 | [故障排查](/deploy/troubleshooting) |

部署命令须使用与离线包匹配的版本。本站 v0.5.0 内容是开发中说明，不能直接套用于旧 v0.3.2 工具；已下载包的 README 和发布说明同样需要核对。
