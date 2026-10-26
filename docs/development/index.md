# 开发指南

公开开发文档帮助贡献者准备环境、理解仓库分工并提交修改。内部设计、实现计划和验收证据继续保留在根仓库或对应应用仓库。

1. 阅读[架构与仓库边界](/development/architecture)和[服务调用关系](/development/service-calls)。
2. 完成[源码与运行资源准备](/development/setup/)。
3. 按 [Linux](/development/setup/linux)、[macOS](/development/setup/macos) 或 [Windows / WSL2](/development/setup/windows) 准备环境。
4. 使用[功能测试账号](/development/test-accounts)验收摆摊、宠物、佣兵和生命体。
5. 按[贡献指南](/development/contributing)验证改动。

## 离线包构建

[构建离线包](/development/offline-package)：一键打包、同版本重建、产物清理和中断处理。

[离线包运行与基础验收](/development/offline-acceptance)：隔离启动、罗安进图检查、报告与测试环境清理。

## 维护入口

- [根仓库开发文档](https://github.com/happyro/happyro/tree/main/docs/development)：功能设计、进度和验收。
- [服务管理](https://github.com/happyro/happyro/blob/main/docs/operations/services.md)：本机进程、配置和构建生效方式。
- [镜像构建与交付](https://github.com/happyro/happyro/blob/main/docs/operations/docker-release.md)：发行包与镜像发布的权威流程。
- [README 图片规范](https://github.com/happyro/happyro/tree/main/docs/development/readme-images)：专用角色、真实截图与设备合成参数。

只需要部署服务器时直接使用[Docker 离线包](/deploy/docker)。
