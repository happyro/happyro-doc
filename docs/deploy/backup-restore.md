# 备份与恢复

本文命令对应 v0.6.0 五镜像离线包的 Go API 栈（`api` / `api-init`）。操作旧版离线包时使用该包配套的工具和服务名称，不混用新旧命令。

## 停写备份

先确认 api-init 已完成，再停止游戏及后台写入，并暂停宿主机 custom 文件编辑，仅保留 database 运行。数据库含非事务表，不能在有写入时仅凭 single-transaction 获得一致备份。

停止游戏和后台写入：

```bash
docker compose stop gateway admin api web-api map char login
```

创建备份：

```bash
python3 tools/deployment/manage.py backup --directory . --output ../backups/before-upgrade
```

普通备份完成后可运行 deploy 恢复服务；准备升级时保持停写。备份包含三个数据库（happyro、happyro_log、happyro_admin）、server-settings、整个 CUSTOM_DIR（脚本、数据库扩展、资源）、.env 和部署清单。备份含密钥，应复制到异机；无 checksums.json 的部分备份不可恢复。备份输出目录必须不存在，示例路径用过后须换新目录。完整离线包另行保存，备份不会重复复制镜像和资源。

## 恢复到匹配版本

恢复优先使用匹配版本的完整包及新的宿主机数据目录。复制备份 .env、核对 DATA_DIR、CUSTOM_DIR、资源路径和地址，保留数据库密码和控制令牌，不重新 initialize。`initialize-custom` 只准备 `CUSTOM_DIR`，不会创建 `DATA_DIR`。若使用新建的外部数据目录，先在 `.env` 设置其实际路径，再创建全部五个数据子目录；Compose 的 bind mount 不会自动创建缺失路径。

以下示例中的 `/srv/happyro/restore-data` 必须替换为 `.env` 中 `DATA_DIR` 指定的同一目录。使用全新解压包自带的 `./data` 时，这五个空子目录已包含在包中。

设置恢复数据目录：

```bash
restore_data_dir=/srv/happyro/restore-data
```

创建数据子目录：

```bash
mkdir -p "${restore_data_dir}/database" "${restore_data_dir}/control-socket"  "${restore_data_dir}/server-settings" "${restore_data_dir}/server-logs"  "${restore_data_dir}/gateway-logs"
```

目录准备完成后，初始化自定义目录、导入镜像并恢复：

准备自定义目录：

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
```

导入匹配版本镜像：

```bash
python3 tools/deployment/manage.py import-images --directory .
```

启动数据库：

```bash
docker compose up -d --wait --pull never --no-build database
```

恢复备份：

```bash
python3 tools/deployment/manage.py restore --directory . --backup ../backups/before-upgrade --confirm-replace
```

启动服务：

```bash
python3 tools/deployment/manage.py deploy --directory .
```

restore 校验备份哈希，并拒绝其它服务仍运行的环境；它替换备份涉及的表和文件；CUSTOM_DIR 精确恢复到备份内容，移除备份中不存在的额外文件。不自动替换镜像、内置资源或密钥。覆盖已有数据前另做备份。跨数据库版本或不兼容 schema 回退，必须同时恢复配套备份。

## 从源码部署迁移

从现有 systemd 环境迁移需单独安排停服，导出三个库、battle_conf.txt 和自定义目录，并保留数据库密码与控制令牌，再导入新的宿主机数据目录。工具不会自动搬迁旧主机存档。
