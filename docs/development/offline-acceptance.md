# 离线包运行与基础验收

打包后，通过根仓库的 `tools/acceptance/offline/manage.py` 在独立测试目录运行最终 ZIP。普通打包命令不会启动服务、执行验收或修改测试数据库。

源码按职责分开：`tools/release/` 管打包与发布，`tools/deployment/` 管包内运行，`tools/acceptance/` 管测试环境和证据。一次测试的安装目录、日志、截图和报告按版本与批次放在一起。

::: info 验证边界
已通过真实离线包的本机 Linux arm64 部署、服务健康、HTTP 入口及罗安登录进图和移动验收。amd64 和 arm64 镜像均完成构建与归档校验，但本机运行结果只覆盖 arm64，不代表另一架构或手机真机已通过。每次新包仍须重新执行检查。
:::

## 环境与输入

需要 Python 3.11+、Docker Compose、可运行本机架构 Linux 容器的 Docker，以及已完成的完整离线 ZIP。浏览器验收另需 Node.js 22+、根仓库工具依赖（`npm ci --prefix tools`）和 Chrome；其它 Chromium 可通过 `--browser-path` 指定。

包内需要当前部署工具的 `--compose-override` 功能。更新源码不会更新已经生成的 ZIP；旧包不支持该参数时，重新完整打包，不手工修改包内受校验文件。

默认读取 `artifacts/releases/<版本>/happyro-<版本>.zip`。也可以显式指定 `--archive /path/to/happyro-<版本>.zip`，版本必须与包内一致。输入完整 ZIP；拆分交付内容的一致性由拆分工具检查，本入口不直接读取两份拆分 ZIP。

## 执行进度与容器名称

运行命令默认显示彩色阶段、完成／失败状态、耗时和日志路径；耗时阶段每 10 秒输出一次等待提示。黄色表示开始、青色表示进行中、绿色表示完成、红色表示未完成；这不是完成百分比，也不会自动重试失败操作。所有命令支持 `--no-color`，日志文件中的子工具输出保持无色。

::: details 容器命名与批次隔离规则
新批次的容器命名为 `happyro-test-<批次名>-<16 位哈希>-<服务名>`，例如 `happyro-test-manual-1-0123456789abcdef-gateway`。批次名转换为小写，点和下划线显示为连字符；哈希仍按原始工作区完整路径、版本和批次名生成，避免显示名称相似时相互混淆。已经登记的项目名保持不变，停止和清理按登记操作，不重命名运行中的容器。
:::

包内部署工具的进度提示需要重新打包后生效；源码更新不会修改已有 ZIP。新包包含标准库进度模块，并纳入文件完整性校验。

## 启动独立测试部署

在根仓库执行，批次名自行指定，例如 `smoke-1`：

```bash
python3 tools/acceptance/offline/manage.py start --version "$(cat deploy/docker/VERSION)" --batch smoke-1
```

命令会解压完整包、校验资源和双架构镜像、生成本批次密钥和自定义目录、导入 Docker daemon 对应架构的镜像，再调用包内部署工具启动服务。启动完成会打印游戏启动页和后台地址。

Docker 的 host/none 等无子网网络不会参与测试网段分配。自动选择两个空闲本机端口，也可指定 `--gateway-port 13338 --admin-port 18000`。端口只绑定 `127.0.0.1`；独立容器名、Compose 项目和网络避免占用现有服务。工具从 `172.31.0.0/16` 中选择不与现有 Docker 网络重叠的测试网段，无可用网段时停止。端口／网段在检查后被其它进程抢占时，保留失败现场，不修改现有服务来腾位置。

Docker 镜像存储仍由本机共享，导入会更新相同版本的本地镜像标签；不会替换正在运行的其它容器。需要完全独立的镜像存储时，使用专用 Docker context 或测试机器。

同批次已有目录时拒绝覆盖，不重新初始化数据库。启动失败保留目录和日志，不自动删除失败现场。执行 clean --execute 彻底清理后可以复用原批次名；需要保留历史证据时使用新批次名。

## 执行基础验收

检查服务与罗安进图移动：

```bash
python3 tools/acceptance/offline/manage.py check --version "$(cat deploy/docker/VERSION)" --batch smoke-1
```

检查范围：

1. 包内文件、资源及两种架构的镜像归档完整性。
2. 八个常驻服务运行健康，`api-init` 正常退出且退出码为 0。
3. 游戏启动页、后台页面、Gateway 和 API 健康接口可访问。
4. 用隔离测试环境的默认账号 `happyro/happyro` 登录，选择第一角色位“罗安”，进入地图，确认服务端返回正确角色，再通过正常鼠标操作确认坐标移动，保存进图和移动后截图。

不会注入客户端代码、传送角色、修改角色职业或执行战斗与技能测试。角色不匹配时停止，不操作其它角色。游戏角色使用本批次独立数据库，不操作原环境中的罗安。

`--health-timeout 300` 控制等待容器健康的秒数；浏览器阶段另有最多 300 秒的总超时。默认启动本机 Chrome，也可加 `--browser-path /path/to/chromium`。首次加载资源可能较慢。

通过时写入 `report.json`，失败时命令返回非零并记录失败类型，浏览器失败原因也写入报告；详细错误查看同批次日志。每次检查单独保存证据，根目录的 `report.json` 代表最近一次已开始执行的检查。基础验收不会替代技能、任务、备份恢复、升级、双架构运行或手机真机验收。

## 停止与清理

停止本批次容器并移除其 Compose 网络，保留数据库、密钥和证据：

```bash
python3 tools/acceptance/offline/manage.py stop --version "$(cat deploy/docker/VERSION)" --batch smoke-1
```

清理默认只预览：

```bash
python3 tools/acceptance/offline/manage.py clean --version "$(cat deploy/docker/VERSION)" --batch smoke-1
```

确认后执行，先停止该批次服务，再删除整个批次目录（包括测试数据库、密钥、自定义状态、报告、日志、截图和批次登记）：

```bash
python3 tools/acceptance/offline/manage.py clean --version "$(cat deploy/docker/VERSION)" --batch smoke-1 --execute
```

::: warning 执行清理会删除测试数据
清理会永久删除该批次的全部数据和验收证据，清理成功后可以复用批次名。
:::

不删除原始 ZIP、发布产物、其它批次、共享 Docker 镜像或批次目录外的锁文件。任务正在运行、停止失败、网络仍被占用、Docker 不可用、归属异常或配置被改写时，拒绝删除。需要保留数据和证据时使用 stop。

不要手工修改本批次 `.env`、Compose 模板和隔离配置；它们的摘要用于防止清理或启动指向错误环境。需要不同端口或设置时建立新的测试批次。不要删除锁文件绕过正在运行的任务。

## 目录与报告

```text
work/releases/<版本>/acceptance/<批次>/
├── install/happyro-<版本>/     # 独立解压、密钥、数据和自定义目录
├── compose.acceptance.json    # 本批次 Compose 隔离配置
├── state.json                 # 来源 ZIP 摘要及批次归属
├── logs/                      # 初始化、导入、部署和浏览器日志
├── evidence/<检查批次>/       # 截图、浏览器结果和报告历史
└── report.json                # 最近一次检查报告
```

普通 `release.py offline clean / offline create --rebuild` 不删除这些测试目录。测试清理由本页的独立命令负责。日志和截图仅保存在本机工作目录，不自动发布。

不带参数只显示帮助，支持 `--no-color`。只需要正式部署时使用[Docker 离线部署](/deploy/docker)；打包和拆分用法见[构建离线包](/development/offline-package)。

## 查询批次与状态

只读列出全部登记批次：

```bash
python3 tools/acceptance/offline/manage.py list
```

按版本筛选批次：

```bash
python3 tools/acceptance/offline/manage.py list --version v0.6.0
```

查看登记状态、安装目录、报告是否存在，以及当前 Docker 服务健康状态：

```bash
python3 tools/acceptance/offline/manage.py status --version v0.6.0 --batch smoke-1
```

list 不访问 Docker，不创建批次目录或锁文件；status 只读查询容器，不启动或停止服务。recorded_status 是历史登记，runtime_healthy 才是当前容器健康观察；Docker 不可用时显示未知及原因。两者不执行包内容校验，也不会根据旧 report.json 宣称当前验收通过，完整验收仍需 check。
