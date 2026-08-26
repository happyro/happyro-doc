# HappyRO

## Git 规则

- HappyRO 自有提交必须使用 type(scope): subject 格式。
- scope 必须存在，使用小写英文；破坏性变更使用 type(scope)!: subject，并在正文说明迁移方式。
- 允许的 type：feat、fix、config、docs、refactor、test、build、ci、chore、perf、style、revert。
- subject 使用祈使语气的英文，不以句号结尾，首行总长度不超过 72 个字符。
- 一个提交只包含一个逻辑变更；上游合并提交和上游作者提交不受此限制。
- 产品改动如果需要提交，必须自动添加或更新对应的 changelog 记录；只有用户明确说明不写 changelog 时才可跳过。
- changelog 记录必须与对应的实际变更位于同一个 Git 仓库，并包含在同一个提交中；禁止创建只包含 changelog 的独立提交。
- 客户端和服务端属于独立 Git 仓库，根仓库的集中 changelog 不能替代产品仓库内与实际变更同提交的记录；产品仓库缺少 changelog 时，应先在该仓库建立对应记录。
- main 是长期中文产品分支，也是默认维护分支。
- demo 是中文演示环境分支；演示专属改动只提交到 demo，并持续同步 main。
- 三个仓库只推送到各自的 origin，不推送到 upstream。
- 未经用户明确要求，不提交、不推送。
