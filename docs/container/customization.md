# 自定义 NPC、数据库与资源

适用于包含自定义工具和挂载的 v0.4.0 及后续离线包。先完成 [Docker 安装](/container/docker)，已有旧环境按[升级与恢复](/container/upgrade)迁移。本文命令在解压后的部署包根目录执行。

游戏重载与后台目录刷新需要分别执行。核心功能已在 Mac arm64 隔离环境验收，完整真机和负向边界仍需按自身环境验证。

推荐将 DATA_DIR 与 CUSTOM_DIR 放在版本目录外。发行包只带 examples/custom 模板；首次 initialize 创建默认 custom/。若编辑 .env 将 CUSTOM_DIR 改到其它路径，必须执行 initialize-custom 为该位置初始化。这个命令可重复执行，只补缺少的模板，不覆盖已有文件。资源不复制原始 GRF，自定义目录初始为空。

| 宿主机 | 容器 | 使用方 |
|---|---|---|
| CUSTOM_DIR/npc | /opt/happyro/custom/npc | Server，只读 |
| CUSTOM_DIR/db | /opt/rathena/db/import | Server，只读 |
| CUSTOM_DIR/resources | /opt/happyro/custom/resources | Gateway，只读 |
| CUSTOM_DIR | /opt/happyro/custom | Admin 目录刷新任务，只读 |

内置 npc、db、conf 仍由镜像提供。后台战斗设置仍存放 DATA_DIR/server-settings，不增加第二份配置来源。容器只读不妨碍在宿主机编辑。

## 新增及覆盖 NPC

以下 `custom/` 指 `.env` 的实际 CUSTOM_DIR。例如在 `npc/additions/review.txt` 写入测试脚本（声明行各字段之间必须使用 Tab）：

```text
prontera,150,180,4	script	ReviewCustom	100,{
    mes "自定义 NPC 已生效。";
    close;
}
```

该地图、坐标及外观在本轮隔离环境验证可用；正式使用前确认位置没有冲突，NPC 名称不得与其他脚本重复。


新增 `custom/npc/additions/example.txt`，然后在 `custom/npc/scripts.conf` 中登记：

```text
npc: additions/example.txt
// 子清单同样以 custom/npc 为根，不以清单所在目录为根：
// import: additions/events.conf
```

只加载显式登记的 additions/*.txt，清单支持 import additions/*.conf，拒绝循环、父目录路径和符号链接。内置文件 `npc/custom/healer.txt` 对应覆盖文件 `custom/npc/overrides/custom/healer.txt`。覆盖保留原加载顺序、原逻辑文件名，启动、@reloadscript、@loadnpc 均使用同一读取规则；@unloadnpcfile 按原内置路径卸载文件内定义，@unloadnpc 则按 NPC 名称卸载。自定义新增脚本手动加载时使用容器内完整路径。仅 .txt 支持覆盖，内置 .conf 清单不支持覆盖。注释文件可停用该文件内所有定义。移除覆盖并重载即可恢复当前镜像的内置文件。

在有权限的游戏账号中执行：

```text
@reloadscript
@unloadnpcfile npc/cities/prontera.txt
@loadnpc npc/cities/prontera.txt
```

后两条演示按原路径卸载、重载整个内置文件，会影响该文件中的全部 NPC；仅在维护或隔离验收环境操作。覆盖测试须选取当前确实启用的脚本，不能假设 `npc/custom/healer.txt` 默认被加载。

不会将覆盖文件再额外加载一遍，不自动加载已被新版取消引用的旧覆盖。目录刷新会提示未使用覆盖文件。加载错误写入 map-server 日志，不静默退回内置脚本；重载中断对话并重新初始化脚本，不是事务发布，不保证失败时保持先前 NPC 状态。

## 数据库扩展

custom/db 初始化为与当前服务端版本对应的 import-tmpl 文件。常见入口为 item_db.yml 和 mob_db.yml，可用 Footer.Imports 拆分文件，引用写作 `db/import/文件.yml`。遵循各数据库原生合并规则，不能把所有字段都视为整记录替换。物品脚本直接编辑 Script、EquipScript、UnEquipScript。

例如保留初始化得到的 `item_db.yml` Header，在已有 Body 中增加或修改已知物品（不要重复写第二个 Body）：

```yaml
Body:
  - Id: 501
    Buy: 42
```

该示例只修改服务端红色药水购买价格。客户端名称、说明和外观不由这段 YAML 改变；Header 版本以当前包模板为准。若需拆分，在主文件 Footer 中引用同一 custom/db 下的子文件：

```yaml
Footer:
  Imports:
    - Path: db/import/review-items.yml
      Mode: Renewal
```

子文件也必须有相应 Header 和 Body。修改魔物时使用 `mob_db.yml` 及当前包 Header；`Script`、`EquipScript`、`UnEquipScript` 和掉落字段仍遵循服务端原生语义，逐项在测试角色上验证。

NPC 和数据库保存后仍需按类型执行 GM 重载命令，或维护时重启相关服务。无保存后自动重载；大批量修改应在停服后应用。

## 自定义资源与缓存

custom/resources 的路径相对于客户端 data/，例如 `custom/resources/texture/유저인터페이스/item/example.bmp`。不要再嵌套一层 data/。Gateway 先读用户文件，再读取内置本地文件、资源目录和 GRF；自定义文件不进入进程 LRU，配置了自定义目录的 data/ 请求使用 no-store，避免替换或删除资源后命中旧响应。已有浏览器旧缓存可能仍需强制刷新；游戏内已解码的资源需要重新进入游戏。

只支持当前客户端可读取的资源格式与相对路径，不提供任意 PNG 到 SPR/ACT 的转换。新增外观还需要相应客户端映射；新增物品的客户端名称、说明也不能仅靠服务端 YAML 完成。资源目录不提供网页代码覆盖，不自动生成后台缩略图。

## 刷新冒险工具和后台资料

```bash
python3 tools/deployment/manage.py refresh-custom-catalogs --directory .
```

需要数据库已运行且已有 Admin schema；此命令使用已导入的当前镜像、不构建镜像、不重载游戏脚本。先根据内置目录快照和实际加载清单生成 NPC、物品、魔物声明资料，全部解析成功后调用原有三条导入命令。升级的 admin-init 自动执行相同流程。快照仅用于导入，不生成或替换服务端 runtime 目录。删除覆盖或自定义条目后再次刷新，会从内置基线重建，避免残留旧的用户条目。

刷新覆盖 item_db.yml、mob_db.yml 及其 Renewal 导入、静态 NPC 定义；不执行脚本，不推断动态创建 NPC、运行时奖励或战斗倍率修正，不渲染新外观的缩略图。其它数据库仍由服务端正常加载，但不属于这三类目录资料。修改坐标的新 NPC 支持按坐标寻路；没有匹配官方导航 ID 的 NPC 不伪造 ID 开启 NPC 导航传送。原有外观可复用已发布图片，新外观需要另行准备预览资源。

## 升级与另一台机器验收

未覆盖内容自动随镜像更新；用户覆盖始终优先，不要求文本合并，也不会自动获得该文件的新修复。脚本指令、数据库结构变化仍可能需要手动适配。回退文件不会撤销脚本已经发出的奖励或更改过的任务状态。

在另一台机器按 docker-release.md 全量构建后，至少验收：空目录部署；旧存档首次引入 custom；修改原 NPC、移除覆盖恢复内置；新增脚本及重载；物品和魔物扩展及目录刷新；资源替换和删除恢复；保留用户文件升级；完整备份恢复。源码级测试不替代这组容器和游戏验收。


## 修改后的生效顺序与撤销

| 修改内容 | 游戏侧生效 | 后台/冒险工具资料 |
| --- | --- | --- |
| NPC additions / overrides | GM `@reloadscript` 或维护重启 map | `refresh-custom-catalogs` |
| item_db / mob_db | 相应原生数据库重载或维护重启 map | `refresh-custom-catalogs` |
| resources | 后续 HTTP 请求读取新文件；游戏内已解码图片需重新进入游戏 | 不自动生成缩略图或外观映射 |
| 后台战斗设置 | 通过后台保存与现有应用流程 | 唯一持久来源为 DATA_DIR/server-settings |

重启 map 的命令是 `docker compose restart map`，会中断地图连接，应安排维护时间。`refresh-custom-catalogs` 不重载游戏，也不执行 NPC 动态脚本。先确保自定义文件合法，再分别完成游戏重载和目录刷新，最后核对结果。

撤销新增 NPC：删除清单登记；撤销内置 NPC 覆盖：删除对应 overrides 文件；撤销数据库修改：恢复原模板或移除相应 Body/Imports 条目。之后分别重载游戏、刷新目录。删除资源覆盖后恢复内置资源。撤销文件不会自动收回脚本已发放的奖励或恢复已修改的任务状态，需要匹配备份或另外处理游戏数据。

## 常见问题

- NPC 不出现：确认 additions 已登记、子清单路径相对于 custom/npc、地图/坐标合法，并检查 `docker compose logs --tail=100 map`。
- 覆盖无效：确认原脚本当前被加载，路径为去掉开头 npc/ 后的相对路径；内置 `.conf` 不支持覆盖。
- 游戏已更新但后台还是旧值：执行目录刷新；反之后台已更新不代表游戏已重载。
- 资源无效：确认没有额外一层 data/、路径大小写和编码一致、格式受客户端支持；查看 Gateway 日志并重新进入游戏。
- admin-init 提示缺少 `server-base/conf/import/script_conf.txt`：这是 v0.4.0 首轮候选镜像的缺陷，正式验收包已修复；使用完整修复包，不手工修改容器补文件。
- `verify` 失败：先检查是否混用了不同包的配置、镜像或工具，不改清单哈希来掩盖损坏。用户只应编辑 `.env`、custom 和持久化数据，不编辑受清单校验的发行文件。


## 本次功能如何接入

这次通过宿主机持久目录、服务端加载规则、网关资源读取和后台目录刷新共同实现：

1. 部署配置增加 CUSTOM_DIR，把 npc、db、resources 分别只读挂载到使用它们的容器；发行包只提供初始化模板，不携带用户定制。
2. Server 在加载内置 NPC 时优先读取相同相对路径的覆盖文件，同时保留原文件身份；新增脚本只读登记清单。数据库直接沿用原生 db/import，不增加第二套数据库规则。
3. Gateway 在缓存与内置资源前检查自定义文件，更新或删除影响后续 HTTP 请求；不需要重新制作资源镜像。
4. Admin 从镜像内基线和有效用户声明生成三类静态资料，再执行目录导入。游戏数据重载仍独立进行，动态脚本效果不靠静态解析推测。
5. 部署工具增加 initialize-custom 和 refresh-custom-catalogs；备份加入 custom-files.tar，恢复精确替换，移除备份外文件。已有模板不被新版自动覆盖或合并。

首轮验收曾发现 Admin 快照缺少默认脚本 import 配置。修复后使用与 Server 初始化相同的版本化模板，并全量重建四类双架构镜像；最终本机包通过空库初始化。源码实现及维护说明位于 HappyRO 根仓库的 `docs/architecture/customization.md`。
