# 管理后台

HappyRO Admin 是独立的 Laravel API 与 Ant Design Pro 应用，面向服务器管理人员，提供资料查询、用户管理、运营发放、在线控制、参数修改和审计记录。

## 后台登录

![HappyRO 管理后台登录](/images/features/happyro-admin-login.png)

后台不开放公开注册。离线部署首次初始化会创建 `admin / admin` 超级管理员账号；其他后台用户由管理员维护。

## 魔物资料与在线召唤

![HappyRO 管理后台魔物图鉴](/images/features/happyro-admin-monsters.png)

魔物图鉴支持按名称、种族、属性、体型和首领类型组合查询，集中展示形象与关键数值，并提供详情查看和在线召唤入口。

## 游戏参数

![HappyRO 管理后台掉落倍率设置](/images/features/happyro-admin-drops.png)

游戏参数按经验、掉落、地图传送、魔物召唤和冒险工具分组维护。每项设置标明对应 rAthena 配置来源，保存后进入统一修改记录。

## 功能范围

- 查询和维护游戏账号、角色与登录记录。
- 查询物品、魔物、NPC 和地图资料。
- 向目标角色发放物品与 Zeny。
- 召唤魔物、维护角色状态和调整服务器参数。
- 记录管理员操作、配置版本和执行结果。
