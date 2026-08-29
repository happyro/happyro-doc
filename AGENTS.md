# HappyRO 文档代理说明

本仓库是 HappyRO 文档站，使用 VitePress 构建。

## Git 规则

- HappyRO 自有提交必须使用 `type(scope): subject` 格式。
- scope 必须存在并使用小写英文；破坏性变更使用 `type(scope)!: subject`，并在正文说明迁移方式。
- 允许的 type：feat、fix、config、docs、refactor、test、build、ci、chore、perf、style、revert。
- subject 使用祈使语气的英文，不以句号结尾，首行总长度不超过 72 个字符。
- 一个提交只包含一个逻辑变更。
- `main` 是默认维护分支，只推送到 `origin`。
- 未经用户明确要求，不提交、不推送。

## 更新日志

- 文档站的更新日志只记录 HappyRO 产品变更，不记录本仓库自身的文档、导航、主题或部署变更。
- HappyRO 根仓库的 `changelog/<年>/<月>/YYYY-MM-DD.md` 是更新日志的唯一内容源。
- 日期文件必须原样复制到本仓库的 `docs/changelog/<年>/<月>/`，不得在文档站内单独改写内容。
- 侧栏按 `YYYY-MM` 分类并默认折叠；同步日期文件时必须同时维护对应的侧栏链接。

## 仓库边界

- `docs/` 保存站点页面和公开资源。
- `docs/.vitepress/` 保存导航、主题和构建配置。
- `docs/.vitepress/dist/` 和缓存目录属于生成内容，不得提交。
- 安装和架构文档必须以 HappyRO 根仓库当前脚本、配置和锁定版本为准。
- kRO 客户端资源属于第三方版权内容，不得加入本仓库。

## 验证

- 修改页面、导航或主题后运行 `npm run docs:build`。
- 提交前运行 `git diff --check`，并检查站内链接和已删除页面的残留引用。
