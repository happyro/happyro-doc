# 备份与恢复

::: info 适用版本
本页按当前主分支说明，对应已发布的 v0.5.0；下载与摘要以[下载页](/guide/downloads)和[版本说明](/changelog/releases/v0.5.0)为准。
:::

## 停写备份

先确认 admin-init 已完成，再停止游戏及后台写入，并暂停宿主机 custom 文件编辑，仅保留 database 运行。数据库含非事务表，不能在有写入时仅凭 single-transaction 获得一致备份。

```bash
docker compose stop gateway admin web-api map char login
python3 tools/deployment/manage.py backup --directory . --output ../backups/before-upgrade
```

普通备份完成后可运行 deploy 恢复服务；准备升级时保持停写。备份包含三个数据库（happyro、happyro_log、happyro_admin）、Admin storage、server-settings、整个 CUSTOM_DIR（脚本、数据库扩展、资源）、.env 和部署清单。备份含密钥，应复制到异机；无 checksums.json 的部分备份不可恢复。备份输出目录必须不存在，示例路径用过后须换新目录。完整离线包另行保存，备份不会重复复制镜像和资源。

## 恢复到匹配版本

恢复优先使用匹配版本的完整包及新的宿主机数据目录。复制备份 .env、核对 DATA_DIR、CUSTOM_DIR、资源路径和地址，保留原 APP_KEY，不重新 initialize。先执行 initialize-custom 建立容器需要的挂载目录，再恢复：

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --wait --pull never --no-build database
python3 tools/deployment/manage.py restore --directory . --backup ../backups/before-upgrade --confirm-replace
python3 tools/deployment/manage.py deploy --directory .
```

restore 校验备份哈希，并拒绝其它服务仍运行的环境；它替换备份涉及的表和文件；CUSTOM_DIR 精确恢复到备份内容，移除备份中不存在的额外文件。不自动替换镜像、内置资源或密钥。覆盖已有数据前另做备份。跨数据库版本或不兼容 schema 回退，必须同时恢复配套备份。

## 从源码部署迁移

从现有 systemd 环境迁移需单独安排停服，导出三个库、storage、battle_conf.txt 并保留 APP_KEY，再导入新的宿主机数据目录。工具不会自动搬迁旧主机存档。
