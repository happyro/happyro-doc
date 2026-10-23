# HappyRO 文档站

[HappyRO](https://github.com/happyro/happyro) 的公开文档站，使用 VitePress 构建。入口：[happyro.kugarocks.com](https://happyro.kugarocks.com) · [happyro.org](https://happyro.org)。

## 内容与目录

| 目录 | 读者与职责 |
| --- | --- |
| `docs/index.md` | 产品主页，保留顶部标题与功能卡片文案，展示新截图 |
| `docs/guide/` | 项目介绍、快速开始、下载与汉化范围 |
| `docs/game/` | 玩家操作，按功能组织，平台差异在同页说明 |
| `docs/strategy/` | 游戏任务攻略；转职按职业线组织 |
| `docs/deploy/` | 安装、配置、反向代理、维护、备份恢复、升级及定制 |
| `docs/admin/` | 后台账号角色、运营发放和游戏设置 |
| `docs/development/` | 公开开发准备、平台差异、架构与贡献 |
| `docs/community/` | 联系与反馈 |
| `docs/changelog/` | 从根仓库同步的产品日志与版本摘要 |

顶栏按读者任务分类，侧栏统一展示可折叠的栏目、主题与页面层级。旧 `container/`、`native/`、设备指南及后台入口仅保留跳转页，正文只维护新位置；迁移清单见 `docs/.vitepress/redirects.json`。该清单记录旧路径、默认目标及拆分页的旧锚点，`LegacyRedirect.vue` 在浏览器转向，禁用 JavaScript 时仍有可点击入口。跳转页标记 noindex 和 canonical，不作为新的正文或搜索内容来源。

## 本地开发与验证

```bash
npm ci
npm run docs:dev
npm run docs:build
```

构建后核对所有生成 HTML 的站内链接、锚点和图片，特别检查旧地址带锚点的跳转。桌面、平板和手机查看首页与代表性正文；根 README 跨站链接同样更新。生成的 dist、缓存与审计结果不提交。推送 main 会触发站点工作流；本地构建不等于发布完成，未经用户要求不提交或推送。

## 单一内容来源

- 玩家指南、攻略、公开安装运维及后台使用说明在本站维护；根 README 保留概要与专题链接，避免复制整篇教程。
- 内部架构决策、实现计划、进度、测试证据及镜像发布流程在根仓库或对应应用仓库维护，本站开发页链接到权威入口。
- 产品日期日志与版本摘要只在根仓库修改；从根仓库运行 `python3 tools/changelog/manage.py sync` 和 `check`。纯文档、导航和主题改动不写产品日志。
- 普通使用与配置文档按最新版维护，不重复适用版本提示；下载页和发布记录保留真实发布日期、制品及摘要，不用当前截图改写历史交付事实。
- 页面移动同时更新新导航、所有维护中的正文链接、根仓库引用和重定向清单；历史日志保持原文，通过旧入口跳转承接。

## 图片来源与更新

主页顶部和四张功能卡片恢复 Git 原版的全部文案、字号与样式；顶部恢复 VitePress 原有响应式布局，桌面左侧显示标题与演示按钮，右侧显示原有 Logo。下方 `HomeGallery.vue` 轮播依次展示三端整合图、跨端技能、图鉴、战斗与后台的新图。`docs/public/images/overview/` 的五张 PNG 原样同步根仓库 `docs/assets/readme/`；前两张透明、无阴影，设备样式、坐标和镜头以根仓库[README 图片规范](https://github.com/happyro/happyro/tree/main/docs/development/readme-images)为准。

新增教程截图用本机 99 级剑士“罗安”，不切换为管理角色或伪造职业能力。具体截图来源、视口和哈希保存在 `docs/public/images/sources.json`；凭据、账号 ID、数据库和临时输出不进入站点。剑士无法演示的摆摊或其他职业能力，用经源码核对的步骤说明，新增实际操作图须具备相应角色条件。

图片按用途放入 `overview/`、`game/controls/`、`game/social/`、`game/adventure/`、`game/trading/`、`game/mail/` 和 `strategy/job-change/`。旧图只有仍被正文引用时才保留；更新截图时同时检查界面文案与教程步骤。

## 攻略维护

游戏攻略侧栏按主题折叠，转职以职业线为单篇单位，诗人／舞娘分开。正文说明玩家条件、NPC 坐标、材料和操作；随机要求与已验证路线明确区分，不复制测试账号、工具参数和强化属性。转职来源为根仓库 `docs/development/job-change-review/`，四转条件核对 Server 的 `npc/custom/happyro/fourth_job.txt`；规则变化时同步检查共用说明和受影响分支。

攻略配图放在 `docs/public/images/strategy/job-change/`。现有四张场景 WebP 来源于根仓库转职审计的 `swordman-npc.png`、`knight-npc-complete.png`、`wizard-npc-complete.png` 与 `warlock-npc-complete.png`，仅裁剪场景／对话并压缩，去除角色信息和聊天栏；四张 SVG 为按攻略步骤编排的流程示意，不代表游戏地图或可步行路线。正文使用 `job-guide-figure`，最大宽度 420px，手机端随内容缩放，点击图片可查看大图。后续新增截图先核对其对应步骤，不把管理工具截图用作原生转职操作图。

NPC 定位图位于 `images/strategy/job-change/locations/`，按服务端 `db/map_cache.dat` 与 Renewal 覆盖 `db/re/map_cache.dat` 的碰撞格重绘，使用自定义地形配色，不拷贝 kRO 客户端小地图或运行资源。坐标按左下原点映射，每个红点都核对 NPC 清单或实际脚本声明；输入哈希、地图尺寸与逐图坐标保存在 `docs/strategy/job-change/location-sources.json`。二转／三转图放在各线相应章节，共用入口放总览；定位图不表示动态障碍、剧情前置或跨房间直线路径。

转职攻略统一采用「阶段速查 → 关键准备 → 分阶段操作」结构，三级小节进入页面目录。共用条件与 NPC 图维护在 `common.md`，`index.md` 仅承担路线选择；各篇保留本职业线的具体导师与任务，推荐准备等级和最低报名门槛分开表达。定位图默认展开，补充场景截图及审计范围按需展开，避免打断操作步骤。

职业线顶部使用共享 `JobProgression` 组件，按顺序传入五个职业名称；组件以简洁职业标签和箭头展示路线，链接到当前页的对应章节，末项轻微强调，窄屏自然换行。修改阶段标题时同步检查跳转锚点。
