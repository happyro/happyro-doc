# 升级、备份与恢复

适用于 v0.4.0 及后续工具。当前已验证本机 arm64 备份恢复和同版本重部署，真实跨版本升级仍须用旧版测试存档验收。首次部署见 [Docker 安装](/container/docker)，定制目录见[自定义功能](/container/customization)。

## 保留数据和定制升级

新增 custom 支持的升级应使用完整新版包，不能沿用旧 Compose/工具而只替换镜像。运行前先完成以下准备：

- 用旧版配套工具停写备份，保留旧完整包及旧 `.env`。新旧包不得同时连接同一份存档。
- 记录 DATA_DIR、CUSTOM_DIR 的实际绝对路径及 custom 文件哈希；旧版无 custom 时使用新的专用目录。
- 新目录复制旧 `.env`，保留 `APP_KEY`、数据库密码、令牌、公开 URL 和 Compose 项目名；按新版 `.env.example` 核对新增变量，仅更新版本与四个镜像引用等明确需要变更的值。
- `DATA_DIR=./data` 等相对路径会随包目录改变，须改成原数据的绝对路径；`RESOURCE_DIR` 指向新包资源。若搬迁数据，需在停写状态复制完整结构，而非只复制数据库目录。
- 固定容器名会冲突。备份完成后在旧包目录执行 `docker compose down`，再启动新版；bind mount 数据会保留。

1. 保留新版完整包并执行 verify；先在旧部署目录停止写入并备份（见下节）。同一存档只能有一套游戏服务运行。
2. 在新版包根目录复制旧 .env，保留 APP_KEY、数据库密码和控制令牌；从新版 .env.example 更新 RELEASE_VERSION 和四个 IMAGE 变量。
3. 将 DATA_DIR 指向旧部署已停止写入的数据目录（建议绝对路径），CUSTOM_DIR 指向旧的自定义目录（同样建议绝对路径），RESOURCE_DIR 使用新版包内资源。不要把新的空 data/ 或 custom/ 当成旧内容。
4. 执行 `python3 tools/deployment/manage.py initialize-custom --directory .`：首次引入自定义功能时建立目录；后续仅补齐新版新增的模板文件，已有文件不覆盖，不合并。旧版本备份需使用旧版本配套工具恢复，不能直接交给新工具。
5. 导入本版镜像，再启动 database；如涉及 Server schema，先按发布说明审查并执行对应 SQL，再显式执行 Admin 迁移和快照导入，成功后启动整栈。

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --pull never database
docker compose run --rm --no-deps --pull never admin-init
python3 tools/deployment/manage.py deploy --directory .
```

原有 Compose 项目名应保持一致。数据库初始化 SQL 只对空目录执行；Server schema 变化需先审查该版本升级 SQL，并在停写后显式执行。工具不盲目执行历史升级脚本。

已有环境不要重新运行 `initialize`，只运行 `initialize-custom` 补齐模板。升级后核对七服务健康、admin-init 退出 0、角色/仓库数据、后台设置及 custom 哈希，再分别检查未覆盖 NPC 随镜像更新、覆盖文件仍优先、删除覆盖后恢复新版内置文件。只重部署同一版本应记录为流程演练。

`admin-init` 每次都会完整重跑迁移和三条导入命令，所以正常升级流程已经覆盖新增的导入步骤。只有跳过 `admin-init`、只对已有数据库单独执行 `migrate` 的场景才需要注意：新迁移建出的表（例如 `game_npcs`）不会自动有数据，必须单独补跑对应的 `artisan game-data:import-*` 命令，否则查询接口会一直返回空结果。

## 备份与恢复

先确认 admin-init 已完成，再停止游戏及后台写入，并暂停宿主机 custom 文件编辑，仅保留 database 运行。数据库含非事务表，不能在有写入时仅凭 single-transaction 获得一致备份。

```bash
docker compose stop gateway admin web-api map char login
python3 tools/deployment/manage.py backup --directory . --output ../backups/before-upgrade
```

普通备份完成后可运行 deploy 恢复服务；准备升级时保持停写。备份包含三个数据库（happyro、happyro_log、happyro_admin）、Admin storage、server-settings、整个 CUSTOM_DIR（脚本、数据库扩展、资源）、.env 和部署清单。备份含密钥，应复制到异机；无 checksums.json 的部分备份不可恢复。备份输出目录必须不存在，示例路径用过后须换新目录。完整离线包另行保存，备份不会重复复制镜像和资源。

恢复优先使用匹配版本的完整包及新的宿主机数据目录。复制备份 .env、核对 DATA_DIR、CUSTOM_DIR、资源路径和地址，保留原 APP_KEY，不重新 initialize。先执行 initialize-custom 建立容器需要的挂载目录，再恢复：

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
python3 tools/deployment/manage.py import-images --directory .
docker compose up -d --pull never database
python3 tools/deployment/manage.py restore --directory . --backup ../backups/before-upgrade --confirm-replace
python3 tools/deployment/manage.py deploy --directory .
```

restore 校验备份哈希，并拒绝其它服务仍运行的环境；它替换备份涉及的表和文件；CUSTOM_DIR 精确恢复到备份内容，移除备份中不存在的额外文件。不自动替换镜像、内置资源或密钥。覆盖已有数据前另做备份。跨数据库版本或不兼容 schema 回退，必须同时恢复配套备份。

从现有 systemd 环境迁移需单独安排停服，导出三个库、storage、battle_conf.txt 并保留 APP_KEY，再导入新的宿主机数据目录。工具不会自动搬迁旧主机存档。

