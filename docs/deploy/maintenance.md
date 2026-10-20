# 日常维护

::: info 适用版本
本页按当前主分支说明，对应已发布的 v0.5.0；下载与摘要以[下载页](/guide/downloads)和[版本说明](/changelog/releases/v0.5.0)为准。
:::

## 日常维护

```bash
docker compose ps -a
docker compose logs --tail=100 gateway admin web-api
docker compose restart
docker compose down
```

`docker compose down` 不删除 bind mount 到包内 `data/` 的数据库和设置。完整步骤见[升级、备份与恢复](/deploy/upgrade)，并核对所用离线包的 README 和勘误。首次引入 custom 必须采用完整新版配置和工具，不能只替换镜像。

## 更新与故障

修改配置后先确认影响的服务；需要替换版本时按[升级](/deploy/upgrade)操作。涉及数据替换或大批量自定义修改前按[备份与恢复](/deploy/backup-restore)停写备份。不要用删除数据库作为普通故障排查步骤。

需要制作自己的发行包时，按根仓库的[镜像构建与交付流程](https://github.com/happyro/happyro/blob/main/docs/operations/docker-release.md)执行，构建流程由根仓库维护。
