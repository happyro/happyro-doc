# 安装运维

推荐使用完整 Docker 离线包，应用与数据库以容器运行，客户端资源从配套目录挂载。源码开发见[开发指南](/development/)，不需要为了安装游戏先编译源码。

## 首次部署

[选择下载版本](/guide/downloads) → [Docker 安装](/deploy/docker) → [访问地址配置](/deploy/configuration) → [登录与角色](/game/getting-started)。

使用域名、HTTPS 或手机添加到主屏幕时，继续阅读[反向代理](/deploy/reverse-proxy)。

## 已有环境

| 需求 | 文档 |
| --- | --- |
| 查询环境变量、默认值和生效方式 | [环境变量配置参考](/deploy/environment-variables) |
| 状态、日志、重启与停服 | [日常维护](/deploy/maintenance) |
| 保存存档、异机恢复、回退准备 | [备份与恢复](/deploy/backup-restore) |
| 更新完整离线包 | [升级](/deploy/upgrade) |
| 增加 NPC、数据库条目和资源 | [自定义功能](/deploy/customization) |
| 无法登录、旧资源或导入失败 | [故障排查](/deploy/troubleshooting) |

部署命令、镜像和资源使用同一完整包，升级与备份操作分别按对应专题执行。
