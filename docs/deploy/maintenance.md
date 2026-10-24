# 日常维护

以下服务名对应当前 Go API 部署模板；旧版离线包按同包 README 操作，先用 `docker compose config --services` 核对。

## 查看与启停

```bash
docker compose ps -a
docker compose logs --tail=100 gateway api web-api
docker compose restart
docker compose down
```

`docker compose down` 不删除 bind mount 到包内 `data/` 的数据库和设置。完整步骤见[升级、备份与恢复](/deploy/upgrade)，并核对所用离线包的 README 和勘误。首次引入 custom 必须采用完整新版配置和工具，不能只替换镜像。

## 更新与故障

修改 `.env` 后重新创建对应容器，`restart` 不重新注入环境变量；已挂载的配置文件按各功能要求重载。完整配置见[环境变量参考](/deploy/environment-variables)。需要替换版本时按[升级](/deploy/upgrade)操作。涉及数据替换或大批量自定义修改前按[备份与恢复](/deploy/backup-restore)停写备份。不要用删除数据库作为普通故障排查步骤。

需要制作自己的发行包时，按根仓库的[镜像构建与交付流程](https://github.com/happyro/happyro/blob/main/docs/operations/docker-release.md)执行，构建流程由根仓库维护。
