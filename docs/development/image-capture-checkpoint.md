# 文档图片逐张重截图断点

更新时间：2026-10-30

## 当前进度

文档当前引用 75 张唯一 PNG。已从当前 PWA 实机重新截图并完成视觉复核、来源记录和固化规则的图片共 61 张，待处理 14 张。

- 截图来源：`http://127.0.0.1:3338/applications/pwa/index.html`
- 当前构建：`mvtwo79r`
- 截图规则：`docs/public/images/capture-rules.json`
- 来源与哈希：`docs/public/images/sources.json`
- 账号：`work/runtime/readme-capture.json`（未跟踪，不写入仓库）
- 当前角色：罗安，剑士，Base 99 / Job 50

## 当前断点与下一张

已完成任务页及手机选角、动作、坐下、表情、快捷键、帮助和物品返回页面。

罗安改用手机竖屏会话：430×860、DPR 2、zoom 20，控制端口仍为 9501。当前 alberta (25,238)，站立，向导对话正常结束，右下显示工具店导航的打开地图/取消按钮，目标 (98,154)。旧平板会话已结束。新会话启动命令为 `node work/docs-all-audit/primary.mjs phone --hold-select`，已手动进入游戏，不要发送 continue。

玛雅会话 9503 仍为平板，已移动到 prontera (180,190)，未装备手推车。邮箱最新「冒险补给」有红色药水 1 个附件未领取。摊位关闭，交易已取消。

罗安已实际领取伊甸园任务 4181「处理岩石龟」，进度 0/30；新增背包乐园团徽章 ID 22508。波利已收回宠物蛋。

下一步手机交易和战斗；之后桌面和宣传组合图。75 张 Markdown 引用 PNG 中剩余 14 张未登记（含品牌 Logo，须核验保留），最终还需审查非 PNG 与主页组合素材。临时目录可能含旧图片，只采用本轮工具成功输出并视觉复核的文件，手机新增文件带 recaptured 后缀。

## 继续操作

启动单个实机会话：

```bash
node work/docs-all-audit/primary.mjs tablet
```

等待输出 `LIVE_READY` 后，用控制脚本执行逐张操作：

```bash
node /tmp/run-control.mjs /tmp/action.js
```

截图完成后停止会话：在启动命令对应的终端发送 `Ctrl-C`。同一个测试账号只能保持一个游戏会话，不能同时启动多个实机登录；并行登录会提示「账号已在其他地方登录」或互相踢下线。因此截图阶段应保持单会话连续处理，避免每张重新登录。

每张图片必须按以下顺序完成：

1. 从当前 PWA 实机进入目标页面并操作到固定状态。
2. 写入 `work/current-doc-capture/` 临时截图并用 `view_image` 视觉复核。
3. 复制到 `docs/public/images/` 对应路径。
4. 计算 SHA-256，更新 `docs/public/images/sources.json`。
5. 在 `docs/public/images/capture-rules.json` 增加设备、视口、缩放、入口和状态。
6. 核对来源记录和固化规则一一对应，再处理下一张。

不要批量重新编码旧图片冒充实机截图；不要提交或推送，除非用户另行明确要求。

## 恢复原断点后的实拍进度

用户要求丢弃其他 agent 的未提交截图与规则，已恢复至提交 `7ee167b`，然后重新拍摄以下 49 张（另重拍原有宠物状态图）。每张均已视觉复核、更新 SHA-256 并单独固化：

- `game/npc/tablet-npc-options.png`
- `game/npc/tablet-shop-buy.png`
- `game/npc/tablet-shop-sell.png`
- `game/storage/tablet-bank.png`
- `game/controls/tablet-menu.png`
- `game/controls/tablet-skills.png`
- `game/controls/tablet-shortcuts.png`
- `game/mail/tablet-mail-compose.png`
- `game/text-links/tablet-tipbox.png`
- `game/text-links/tablet-navi-map.png`
- `game/social/tablet-social-friend.png`
- `game/social/tablet-social-party.png`
- `game/storage/tablet-cart.png`
- `game/trading/tablet-vending-setup.png`

- `game/trading/tablet-vending-buy.png`
- `game/trading/tablet-vending-owned.png`
- `game/trading/tablet-trade.png`
- `game/trading/tablet-trade-confirm.png`
- `game/mail/tablet-mail-read.png`
- `game/companions/tablet-pet-hatch.png`
- `game/social/tablet-chat.png`
- `game/storage/tablet-cart-rental.png`
- `game/storage/tablet-storage.png`

- `game/controls/tablet-quests.png`
- `game/controls/phone-character.png`
- `game/controls/phone-actions.png`
- `game/controls/phone-sitting.png`
- `game/controls/phone-emotions.png`
- `game/controls/phone-shortcuts.png`
- `game/text-links/phone-tipbox.png`
- `game/text-links/phone-item-return.png`
- `game/text-links/phone-npc-navi-actions.png`

- `game/trading/phone-trade.png`
- `game/combat/phone-combat.png`
- `game/social/desktop-chat-room.png`
- `game/controls/desktop-achievements.png`
- `game/npc/desktop-cash-shop.png`
- `game/text-links/desktop-tipbox.png`
- `game/text-links/desktop-npc-navi-toast.png`
- `game/text-links/desktop-npc-navi-actions.png`

- `game/npc/desktop-refinement.png`
- `overview/happyro-combat.png`

- `overview/happyro-three-devices.png`
- `overview/happyro-responsive-skills.png`
- `overview/happyro-admin-settings.png`

- `strategy/job-change/swordman-npc.webp`
- `strategy/job-change/knight-guild.webp`
- `strategy/job-change/wizard-guild.webp`
- `strategy/job-change/warlock-guild.webp`

另重新拍摄 `game/companions/tablet-pet.png`：旧图未显示宠物，与正文不符，现为真实波利状态与进化材料要求。

当前清单以 `capture-rules.json` 的 78 条为准；仓库页已通过：结束 NPC 对话后要等待实际仓库标题可见，短延时截屏可能过早。任务页已用实际领取的岩石龟狩猎任务完成。邮件阅读页已用实际测试角色之间寄送的药水附件完成。

罗安会话控制端口为 9501；玛雅使用独立账号，控制端口为 9503，脚本 `work/current-doc-capture/maya.mjs`。罗安现在为桌面（1280×800、DPR 1），位于 spl_in02(80,106)，无窗口；玛雅为平板，设备参数见当前断点。快捷栏使用 touchscreen.tap；输入值必须在弹出的编辑框中填写并确认。恢复前先检查控制端口是否存活，避免重复登录踢掉同账号。后续不得沿用已丢弃的其他 agent 图片。

阶段校验：52 张时 `npm run docs:build` 通过（仅包体大小提示）；后续图片仍须在最终验收中重新构建。当前 78 张已逐张视觉复核、登记 SHA-256 与规则；未提交或推送。

正文引用的 74 张 PNG 截图均已完成并固化，五张宣传图已同步根仓库。中间阶段待验收项已在下方最终验收中完成。sources.json 共 123 项，四张攻略场景WebP已重新实拍并固化；37张定位图及8张品牌/示意资源的检查结果见下方最终验收。合成原图位于 work/current-doc-capture/composition，输入哈希与视口已记录到 capture-rules.json。桌面 NPC 菜单需选择后点击“确定”，最后点击“关闭”；不能复用手机版直接点选流程。

## 最终验收（2026-10-30）

本轮已完成，不再从前述中间会话状态继续。全站共有 **123 个图片资源**：78 张游戏/后台截图及合成图已完成独立固化规则，37 张地图定位图、6 张 SVG 示意图和2张品牌素材经核验保留。未使用被丢弃的其他 agent 未提交截图与规则。

- `capture-rules.json`：78 条，包含设备、入口、前置条件、画面状态；合成图另记输入哈希与模板，裁剪图另记坐标。
- `sources.json`：123 项，文件 SHA-256 全部吻合；定位图均补充当前NPC源码位置，37处坐标全部匹配。
- 123个资源全部存在正文/主题引用，无缺失和无引用资源。
- 根仓库五张宣传图与本站 overview 文件逐字节一致。
- `npm run docs:build` 通过，仅有包体大小提示；根仓库和文档仓库 `git diff --check` 通过。
- 本机4178逐项读取123个资源，均与磁盘字节一致；36个含图页面在390、1024、1440宽度下检查，共108次页面验收，无图片加载失败。检查须等待Vue挂载及懒加载图片解码，不能在初始DOM阶段提前判断。
- 本轮原始截图、合成输入、验证脚本与JSON结果位于根仓库 `work/current-doc-capture/`；该目录为生成证据，不提交。可复拍规则以本仓库公开JSON及根仓库 `docs/development/readme-images/` 为准。

未提交、未推送。后续更新图片时从当前规则重新实拍，每完成一张立即复核和登记；勿按旧计数重复重拍。
