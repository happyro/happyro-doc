# 游戏体验

HappyRO Client 在浏览器中运行完整 PWA，并通过游戏内冒险工具把中文资料查询、导航和 GM 操作集中到同一界面。

## 登录游戏

![HappyRO 游戏登录界面](/images/features/happyro-game-login.png)

登录界面直接连接 HappyRO Gateway 转发的登录、角色和地图服务。离线部署首次初始化会创建游戏 GM 账号 `happyro / happyro`。

## 地图图鉴与导航

![HappyRO 游戏内地图图鉴](/images/features/happyro-game-map.png)

地图图鉴提供中文名称、地图代码、缩略图、当前角色位置和 NPC 坐标。支持按名称或代码搜索、路线预览、自动寻路，以及权限允许时的地图传送。

## 魔物图鉴

![HappyRO 游戏内魔物图鉴](/images/features/happyro-game-monsters.png)

魔物图鉴展示等级、HP、种族、属性、经验、掉落物品和出现地图。GM 可以召唤魔物或传送到对应地图，普通玩家可以将它作为游戏资料库使用。

## NPC 图鉴

![HappyRO 游戏内 NPC 图鉴](/images/features/happyro-game-npc.png)

NPC 图鉴整合服务器 NPC 实例、中文名称、形象、地图和精确坐标，可筛选当前地图并在地图上定位；具备权限时可以传送至 NPC 附近。

## 物品图鉴

![HappyRO 游戏内物品图鉴](/images/features/happyro-game-items.png)

物品图鉴支持按中文名、英文名、AegisName 或 ID 搜索，并展示图标、插画、类型、重量、价格、洞数和中文说明。GM 可以向当前角色发放物品或 Zeny。

## 角色维护

![HappyRO 游戏内角色属性维护](/images/features/happyro-game-char.png)

角色属性页汇总职业、等级、技能点、基础属性和生命状态。GM 可以调整职业与等级、应用属性，以及执行状态恢复、属性重置和技能重置。

## 游戏设置

![HappyRO 游戏内游戏设置](/images/features/happyro-game-settings.png)

游戏设置覆盖经验倍率、分类掉落倍率、地图传送、地图分流和魔物召唤。修改经由 Admin 与 Game Control 应用到服务器，并由服务端统一校验。
