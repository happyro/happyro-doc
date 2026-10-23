---
outline: [2, 3]
---

# 武僧系转职攻略

<JobProgression :jobs='["服事", "武僧", "武术宗师", "修罗", "审判者"]' />

[选择其它职业线](index.md) · [共用转职流程](common.md)

## 阶段速查

| 目标阶段 | 本篇准备条件 | 下一站 |
| --- | --- | --- |
| [一转：服事](#一转-服事) | Job 10，完成基础技能 | `prt_church 184,41` |
| [二转：武僧](#二转-武僧) | 本文建议 Job 50；技能点用完 | `prt_monk 59,247` |
| [转生](common.md#转生与进阶二转) | 二转 Base 99 / Job 50，技能点用完 | `yuno_in02 88,164` |
| [进阶二转：武术宗师](#转生与进阶二转-武术宗师) | 高阶一转 Job 50，技能点用完 | `valkyrie 53,42` |
| [三转：修罗](#三转-修罗) | 武术宗师 Base 99 / Job 70，技能点用完 | `ve_in 237,125` |
| [四转：审判者](#四转-审判者) | 进阶三转 Base 200 / Job 70，技能点用完 | `prontera 153,193` |

## 关键准备

- 二转随机材料与誓言按当前 NPC 要求，本篇采用十圈马拉松路线。
- 三转需实际击杀一百只沙漠之狼，再完成五分钟冥想生存试炼。

## 一转：服事

职业等级 Job 10、完成基础技能后，前往 `prt_church 184,41`。找神父，选择「转职为服事」并完成对话。

[查看一转 NPC 定位图](common.md#一转-npc-定位)。

## 二转：武僧

<figure class="job-guide-figure">
  <a href="/images/strategy/job-change/locations/monk-second.webp" target="_blank" rel="noopener" aria-label="查看定位图：武僧报名处 · prt_monk (59, 247)">
    <img src="/images/strategy/job-change/locations/monk-second.webp" alt="武僧报名处 · prt_monk (59, 247)，红点标出 NPC 或触发点，浅色为可通行区域" width="640" height="570" loading="lazy" decoding="async" />
  </a>
  <figcaption>武僧报名处 · prt_monk (59, 247)<br />地形定位示意 · 点击查看大图</figcaption>
</figure>

### 报名与誓言

1. 服事 Job 50、用完技能点，找 `prt_monk 59,247` 报名，再找 `monk_in 99,58` 师范穆海领取随机材料。已记录一组为黏稠液体 5、蚯蚓皮 10、绿色药草 20。
2. 交材料后找 `prt_monk 251,255` 图哈，记住并复述本轮誓言；誓言随机，以当前对话为准。

### 马拉松十圈

3. 找 `prt_monk 57,179` 布海，沿「打扰」「图哈派我」「我们宣读神圣誓言」「他改造身体」推进，选择马拉松。
4. 找 `monk_test 329,61` 巴修，选择「自制力」。普通步行完成十圈，避开陷阱；完成后自动返回 `prt_monk 194,168`。此处介绍马拉松路线，未展开替代考试。

### 迷宫与最终宣誓

5. 找 `monk_test 319,139` 图门接受最后测试，传到 `88,74` 后，找 `82,85` 考官进入迷宫。
6. 从 `125,277` 穿过迷宫，清理挡路怪物，走到 `166,278` 出口，返回 `prt_monk 196,168`。
7. 再找图门领取绿色药水并使用。回穆海，依次选「是、否、是、是、否、否、是、我发誓遵守这些誓言」，成为武僧。

## 转生与进阶二转：武术宗师

按[共用转生流程](common.md#转生与进阶二转)成为高阶初心者。Job 10、完成基础技能后回 `prt_church 184,41`，办理高阶服事。

练到 Job 50 并用完技能点，再阅读 `yuno_in02 93,207` 的伊米尔之书进入英灵殿，找 `valkyrie 53,42` 的武术宗师导师，选择「是」完成进阶二转。各分支最低门槛可能不同，本篇按 Job 50 路线继续。

## 三转：修罗

**本篇准备：**武术宗师 Base 99 / Job 70，用完技能点并留出奖励栏位。具体材料、负重与时限见下列步骤。

<figure class="job-guide-figure">
  <a href="/images/strategy/job-change/locations/monk-third.webp" target="_blank" rel="noopener" aria-label="查看定位图：酒馆争执（任务入口） · ve_in (237, 125)">
    <img src="/images/strategy/job-change/locations/monk-third.webp" alt="酒馆争执（任务入口） · ve_in (237, 125)，红点标出 NPC 或触发点，浅色为可通行区域" width="640" height="570" loading="lazy" decoding="async" />
  </a>
  <figcaption>酒馆争执（任务入口） · ve_in (237, 125)<br />地形定位示意 · 点击查看大图</figcaption>
</figure>

1. 找 `ve_in 237,125` 听酒馆争执，到 `98,149` 附近触发剧情，再找 `98,159` 斗士，选择「但我还是想知道更多」。
2. 领取并完成击杀一百只沙漠之狼任务，看到 100/100 公告后回 NPC 交付。
3. 找 `yuno_fild07 254,176` 巴迪，听完对话传入客厅，加入 `sword_1-1 223,243` 附近的等候室。
4. 完成五分钟冥想试炼，期间可攻击幻觉怪物，需要保持存活。
5. 时间结束后找 `sword_2-1 223,205` 巴迪，经出口到 `sword_1-1 216,168`，再找 `223,167` 师父读完对话，成为修罗。用完技能点并留出负重与奖励栏位。

## 四转：审判者

以经过转生的修罗达到 **Base 200 / Job 70**，用完剩余技能点，前往 `prontera 153,193` 找「四转职业导师」，选择「确认四转」。转为审判者后保留基础等级，职业等级从 1 开始，开启四转特性与 AP。

这些是 HappyRO 当前自定义四转条件；未经过转生的普通三转不适用本路线。更多说明见[四转条件](common.md#四转条件)。

::: details 资料来源与验证范围

依据[本职业线流程记录](https://github.com/happyro/happyro/blob/main/docs/development/job-change-review/walkthroughs/09-sura.md)整理。现有记录验证了任务主流程，不代表全部随机题目、材料组合及普通装备难度都已验证；随机要求以当前 NPC 对话为准。

:::
