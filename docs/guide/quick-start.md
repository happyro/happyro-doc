# 快速开始

根据你的目的选择入口，不需要先阅读整站文档。

| 我想做什么 | 从这里开始 |
| --- | --- |
| 先体验游戏 | 打开[游戏演示](https://happyro-demo.kugarocks.com/applications/pwa/index.html)，再看[登录与角色](/game/getting-started) |
| 在手机或平板游玩 | [界面与操作](/game/controls) → [添加到主屏幕](/game/pwa) |
| 自己部署服务器 | [资源下载](/guide/downloads) → [安装运维](/deploy/) → [Docker 安装](/deploy/docker) |
| 管理已有服务器 | [管理后台](/admin/)与[日常维护](/deploy/maintenance) |
| 修改源码或贡献文档 | [开发指南](/development/) |
| 完成职业转职任务 | [转职攻略](/strategy/job-change/) |

## 版本与功能

本次更新内容较多，项目版本从 v0.3.x 直接升级到 v0.5.0，涵盖跨端 UI、游戏功能、中文内容和部署维护等多个方面。详细更新内容见 [v0.5.0 更新日志](/changelog/releases/v0.5.0)。

本轮 v0.5.0 更新还包含 **PHP 后端向 Go 的迁移**：原 `happyro-admin` 同时包含 PHP 后端和管理前端，现在只保留前端，接口由独立的 Go 服务 `happyro-api` 提供。此次迁移由 PHP 官方于 2026-10-21 公布的两个严重漏洞推动：**CVE-2026-109618、CVE-2026-109619**，均可能导致未经认证的远程代码执行，详见[官方安全公告](https://www.php.net/archive/2026.php#2026-10-21-5)。

## 认识项目

HappyRO 由浏览器客户端、游戏服务端、网关和管理后台组成。项目定位及资源基线见[项目简介](/guide/introduction)，汉化范围见[关于汉化](/guide/localization)。
