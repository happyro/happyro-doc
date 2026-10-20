# HappyRO 文档站

[HappyRO](https://github.com/happyro/happyro) 的公开产品与安装文档，使用 VitePress 构建。

- 项目站点：[happyro.kugarocks.com](https://happyro.kugarocks.com)
- GitHub Pages：[happyro.org](https://happyro.org)

## 本地开发

文档目录与侧栏分类对应；新增或移动页面时，同步维护导航、正文链接及首页轮播引用。

| 目录 | 侧栏分类 |
| --- | --- |
| `docs/guide/` | 文档：项目简介、管理后台、关于汉化、资源下载 |
| `docs/game/` | 玩家指南：电脑桌面、手机平板、战斗与拾取、职业外观与随行 |
| `docs/strategy/job-change/` | 游戏攻略 → 转职：共用流程与十三个职业分支 |
| `docs/container/` | 容器化部署 |
| `docs/native/` | 原生部署 |
| `docs/community/` | 社区 |
| `docs/changelog/` | 更新日志，按年／月归档 |

首页位于 `docs/index.md`。图片位于 `docs/public/images/`，按 `brand/`、`admin/`、`game/desktop/` 和 `game/mobile/` 分类。

```bash
npm ci
npm run docs:dev
```

构建检查：

```bash
npm run docs:build
```

## 内容维护

- docs 是公开站点正文；根 README 保存仓库开发说明，.vitepress 保存导航与主题。当前分类已与读者任务对应，不为减少文件数合并安装和玩家操作页。
- changelog 日期页与版本摘要的唯一来源是 HappyRO 根仓库；在根仓库执行 `python3 tools/changelog/manage.py sync`，再执行 `check`，不要在本站单独改写镜像正文。
- 页面移动时同步侧栏、首页、正文、图片及锚点引用；删除已过时页面前将有效规则并入当前页面，不建 archive 或保留无用转向页。
- 已发布版本的下载和 Release 保持原事实，开发中功能明确标记未发布；旧截图不能作为最新布局验收证据。
- 本地验证运行 docs:build，再核对生成页面的站内链接、锚点和 public 图片。生成的 dist、缓存与临时审计结果不提交。
- 推送 main 会触发 GitHub Pages 工作流；本地构建不等于部署完成。提交与发布仍遵守 AGENTS。

## 攻略维护

游戏攻略侧栏按主题折叠，转职以职业线为单篇单位，诗人／舞娘分开。正文说明玩家条件、NPC 坐标、材料和操作；随机要求与已验证路线明确区分，不复制测试账号、工具参数和强化属性。转职来源为根仓库 `docs/development/job-change-review/`，四转条件核对 Server 的 `npc/custom/happyro/fourth_job.txt`；规则变化时同步检查共用说明和受影响分支。

攻略配图放在 `docs/public/images/strategy/job-change/`。现有四张场景 WebP 来源于根仓库转职审计的 `swordman-npc.png`、`knight-npc-complete.png`、`wizard-npc-complete.png` 与 `warlock-npc-complete.png`，仅裁剪场景／对话并压缩，去除角色信息和聊天栏；四张 SVG 为按攻略步骤编排的流程示意，不代表游戏地图或可步行路线。正文使用 `job-guide-figure`，最大宽度 420px，手机端随内容缩放，点击图片可查看大图。后续新增截图先核对其对应步骤，不把管理工具截图用作原生转职操作图。

NPC 定位图位于 `images/strategy/job-change/locations/`，按服务端 `db/map_cache.dat` 与 Renewal 覆盖 `db/re/map_cache.dat` 的碰撞格重绘，使用自定义地形配色，不拷贝 kRO 客户端小地图或运行资源。坐标按左下原点映射，每个红点都核对 NPC 清单或实际脚本声明；输入哈希、地图尺寸与逐图坐标保存在 `docs/strategy/job-change/location-sources.json`。二转／三转图放在各线相应章节，共用入口放总览；定位图不表示动态障碍、剧情前置或跨房间直线路径。
