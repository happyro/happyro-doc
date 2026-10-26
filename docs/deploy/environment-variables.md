---
pageClass: environment-reference
outline: [2, 3]
---

# 环境变量配置参考

按当前代码与部署模板说明。使用配套程序、资源和配置；下列值是公开默认值或示例，不代表某台服务器的实际环境。

## 常用配置

- 战斗范围与随机瞬移：[客户端默认值](#自动战斗与瞬移)、[服务端同步范围](#搜怪范围与服务端同步范围)。
- HP／SP 恢复及拾取：[自动恢复](#自动恢复)、[自动拾取](#自动拾取)。
- 新手出生位置：[游戏服务端](#游戏服务端)中的 `HAPPYRO_CHARACTER_START_MODE`。
- 传送、召怪与工具权限：[玩法权限](#玩法与工具权限环境变量)。
- 游戏地址、端口与后台开关：[Docker 部署入口](#docker-部署入口)。
- 镜头、画质和声音：[客户端设置](#客户端默认设置-gateway)。

### 常用示例

```dotenv
# 地图服（下面一项由地图服读取）
HAPPYRO_GAME_ENTITY_SYNC_RANGE_CELLS=14
# 客户端默认值（下面各项由 Gateway 读取）
HAPPYRO_CLIENT_DEFAULT_AUTO_COMBAT_SEARCH_RANGE=14
HAPPYRO_CLIENT_DEFAULT_AUTO_COMBAT_ACTIVITY_RANGE=30
HAPPYRO_CLIENT_DEFAULT_AUTO_TELEPORT_ENABLED=true
HAPPYRO_CLIENT_DEFAULT_AUTO_TELEPORT_WAIT_SECONDS=2
HAPPYRO_CLIENT_DEFAULT_AUTO_TELEPORT_INTERVAL_SECONDS=2
```

Docker 在部署目录 `.env` 填写；原生部署将地图服项放入 profile，`HAPPYRO_CLIENT_DEFAULT_*` 放入 Gateway 环境。修改后按下一节生效，已有玩家偏好可能优先于默认值。

## 配置位置与生效方式

| 场景 | 配置位置 | 修改后如何生效 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">场景</span>Docker 离线包 | <span class="table-cell-label" aria-hidden="true">配置位置</span>部署目录 `.env`，参照同包 `.env.example` | <span class="table-cell-label" aria-hidden="true">修改后如何生效</span>重新创建受影响容器；仅 restart 不会更新容器环境 |
| <span class="table-cell-label" aria-hidden="true">场景</span>Gateway 原生运行 | <span class="table-cell-label" aria-hidden="true">配置位置</span>`repos/happyro-gateway/.env`，参照根仓库 `deploy/remote-client/.env.example` | <span class="table-cell-label" aria-hidden="true">修改后如何生效</span>重启 Gateway；客户端配置还需刷新网页 |
| <span class="table-cell-label" aria-hidden="true">场景</span>Linux 原生游戏服务 | <span class="table-cell-label" aria-hidden="true">配置位置</span>根仓库 `deploy/rathena/profile.env`，通过配套启动脚本传入 | <span class="table-cell-label" aria-hidden="true">修改后如何生效</span>重启相关服务 |
| <span class="table-cell-label" aria-hidden="true">场景</span>macOS 原生地图服 | <span class="table-cell-label" aria-hidden="true">配置位置</span>同一个 `deploy/rathena/profile.env` | <span class="table-cell-label" aria-hidden="true">修改后如何生效</span>`macos-services.sh start` 同步地图服 plist；已加载服务需 stop/start，单独 kickstart 不读取 profile |
| <span class="table-cell-label" aria-hidden="true">场景</span>独立 systemd 地图服 | <span class="table-cell-label" aria-hidden="true">配置位置</span>unit 的 `Environment=` 或 `EnvironmentFile=` | <span class="table-cell-label" aria-hidden="true">修改后如何生效</span>重载 unit 后重启地图服 |
| <span class="table-cell-label" aria-hidden="true">场景</span>Go API 原生运行 | <span class="table-cell-label" aria-hidden="true">配置位置</span>导出进程环境，或 systemd EnvironmentFile / launchd EnvironmentVariables | <span class="table-cell-label" aria-hidden="true">修改后如何生效</span>重启 API；Go API 不自动加载 `.env` |
| <span class="table-cell-label" aria-hidden="true">场景</span>Admin 前端 | <span class="table-cell-label" aria-hidden="true">配置位置</span>正式部署由独立 Admin 容器提供页面，API 提供运行配置 | <span class="table-cell-label" aria-hidden="true">修改后如何生效</span>下述 API 参数不是 Vite 构建变量；无需把数据库密码写入前端 |

Gateway 重启会断开其承载的游戏 WebSocket；地图服重启会影响在线角色，安排在合适维护时机。只调整已支持的客户端默认值无需重新构建 PWA。

## 完整参数

表头区分**模板默认值**与**程序默认值**；地图服覆盖项留空时读取当前文件配置，并非强制采用表中内置值。

### Docker 部署入口

本节默认值来自根仓库 `deploy/docker/.env.example` 与 Compose。相对路径以部署目录为基准。

| 变量 | 模板默认值 / 要求 | 用途 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">变量</span>`COMPOSE_PROJECT_NAME` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`happyro` | <span class="table-cell-label" aria-hidden="true">用途</span>Compose 项目名 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_RELEASE_VERSION` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>打包时由 `deploy/docker/VERSION` 填充 | <span class="table-cell-label" aria-hidden="true">用途</span>包版本；不要手工与镜像版本混用 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_IMAGE` / `HAPPYRO_SERVER_IMAGE` / `HAPPYRO_API_IMAGE` / `HAPPYRO_ADMIN_IMAGE` / `HAPPYRO_DATABASE_IMAGE` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>对应组件镜像，版本由打包填充 | <span class="table-cell-label" aria-hidden="true">用途</span>必须使用同一发布包中的镜像引用 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_RESOURCE_DIR` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`./resources` | <span class="table-cell-label" aria-hidden="true">用途</span>客户端和目录资源 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_DATA_DIR` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`./data` | <span class="table-cell-label" aria-hidden="true">用途</span>数据库、服务端配置和日志等持久数据 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_CUSTOM_DIR` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`./custom` | <span class="table-cell-label" aria-hidden="true">用途</span>自定义 NPC、数据库及资源 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GAME_PUBLIC_URL` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`http://127.0.0.1:3338` | <span class="table-cell-label" aria-hidden="true">用途</span>玩家可访问的游戏地址，局域网使用服务器地址 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_PUBLIC_URL` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`http://127.0.0.1:8000` | <span class="table-cell-label" aria-hidden="true">用途</span>后台公开地址，传入 API 的 HAPPYRO_ADMIN_PUBLIC_URL |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_CSRF_ORIGIN_CHECK_ENABLED` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`false` | <span class="table-cell-label" aria-hidden="true">用途</span>是否校验后台 Origin 与 Sec-Fetch-Site；`true` 时仅信任 HAPPYRO_ADMIN_PUBLIC_URL 对应来源。关闭来源校验仍要求有效 CSRF Token |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_PASSWORD_CHANGE_ENABLED` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`true` | <span class="table-cell-label" aria-hidden="true">用途</span>后台自助改密；演示环境设为 `false`，隐藏入口并拒绝请求，后台不能覆盖，CLI 不受影响 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_PUBLISH_ADDRESS` / `HAPPYRO_ADMIN_PUBLISH_ADDRESS` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`3338` / `8000` | <span class="table-cell-label" aria-hidden="true">用途</span>宿主机发布端口，支持 `地址:端口`；仅本机访问可设置 `127.0.0.1:3338` / `127.0.0.1:8000`。调整端口时同步公开 URL，修改后重建对应容器 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_PROXY_SUBNET` / `HAPPYRO_ADMIN_PROXY_DYNAMIC_RANGE` / `HAPPYRO_ADMIN_PROXY_IP` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`172.30.81.0/29` / `172.30.81.4/30` / `172.30.81.2` | <span class="table-cell-label" aria-hidden="true">用途</span>Admin 与 API 专用网段、动态地址池及池外的 Admin 固定地址；API 仅信任此代理 IP。网段冲突时三项配套调整并重建网络 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_CLIENT_SOCKET_PROXY_URL` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>空 | <span class="table-cell-label" aria-hidden="true">用途</span>可选外部 WebSocket 地址，空值保持同源 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_DB_PASSWORD` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>必填，敏感 | <span class="table-cell-label" aria-hidden="true">用途</span>游戏数据库用户密码 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_ADMIN_DB_PASSWORD` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>必填，敏感 | <span class="table-cell-label" aria-hidden="true">用途</span>API 管理库及游戏数据访问账号密码 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`MARIADB_ROOT_PASSWORD` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>必填，敏感 | <span class="table-cell-label" aria-hidden="true">用途</span>数据库 root 密码 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_INTERSERVER_PASSWORD` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>必填，敏感 | <span class="table-cell-label" aria-hidden="true">用途</span>游戏服务间认证密码，服务端入口限制不超过 23 字符 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GAME_CONTROL_TOKEN` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>必填，敏感 | <span class="table-cell-label" aria-hidden="true">用途</span>API 与游戏控制接口共享令牌 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_INITIAL_USERNAME` / `HAPPYRO_ADMIN_INITIAL_PASSWORD` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`admin` / `admin`（密码敏感） | <span class="table-cell-label" aria-hidden="true">用途</span>初始化后台账号；不是修改已有账号密码的入口 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_DEFAULT_CREDENTIALS_HINT_ENABLED` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`false` | <span class="table-cell-label" aria-hidden="true">用途</span>控制默认账号提示；还受初始化用户名和密码条件约束 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_SESSION_SECURE_COOKIE_ENABLED` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`false` | <span class="table-cell-label" aria-hidden="true">用途</span>HTTPS 部署设 `true`，让会话 Cookie 仅通过 HTTPS 发送 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_TIMEZONE` | <span class="table-cell-label" aria-hidden="true">模板默认值 / 要求</span>`Asia/Shanghai` | <span class="table-cell-label" aria-hidden="true">用途</span>同时传给 API 和 Gateway 的 IANA 显示时区 |

密码和令牌使用部署工具生成的值，不提交真实环境文件。Server 入口要求 HAPPYRO_SERVER_DB_PASSWORD、HAPPYRO_SERVER_INTERSERVER_PASSWORD、HAPPYRO_GAME_CONTROL_TOKEN 只含字母、数字、下划线或连字符。已有数据库换密码需要同步数据库账号本身；仅修改容器变量不会自动完成凭据迁移。

### 客户端默认设置（Gateway）

以下表格依据 `happyro-client/src/Core/ClientDefaults.schema.json` 核对。所有条目都可在 Gateway 环境配置；Docker 模板和 Compose 已透传。留空继承表中的 PWA 默认值。布尔值使用 `true` / `false`；类别列表使用逗号分隔且不重复。镜头数值是客户端距离参数，寻怪与活动范围单位为地图格。

#### 自动战斗与瞬移

| 配置项与环境变量 | 默认值 | 允许范围 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动战斗 · 搜怪范围<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_COMBAT_SEARCH_RANGE` | <span class="table-cell-label" aria-hidden="true">默认值</span>`14` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–50，整数 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动战斗 · 活动范围<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_COMBAT_ACTIVITY_RANGE` | <span class="table-cell-label" aria-hidden="true">默认值</span>`30` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–100，整数 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动战斗 · 无目标随机瞬移<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_TELEPORT_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动战斗 · 无目标等待<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_TELEPORT_WAIT_SECONDS` | <span class="table-cell-label" aria-hidden="true">默认值</span>`2` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–60，整数 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动战斗 · 最短瞬移间隔<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_TELEPORT_INTERVAL_SECONDS` | <span class="table-cell-label" aria-hidden="true">默认值</span>`2` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–300，整数 |

活动范围不能小于搜怪范围；实际搜怪上限还受[服务端同步范围](#搜怪范围与服务端同步范围)限制。默认随机瞬移开启不代表登录后自动开始战斗。

#### 自动恢复

| 配置项与环境变量 | 默认值 | 允许范围 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动恢复 · HP 低于（%）<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_RECOVERY_HP_TRIGGER_PERCENT` | <span class="table-cell-label" aria-hidden="true">默认值</span>`50` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–99，整数 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动恢复 · HP 恢复至（%）<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_RECOVERY_HP_TARGET_PERCENT` | <span class="table-cell-label" aria-hidden="true">默认值</span>`80` | <span class="table-cell-label" aria-hidden="true">允许范围</span>2–100，且高于触发比例，整数 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动恢复 · SP 低于（%）<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_RECOVERY_SP_TRIGGER_PERCENT` | <span class="table-cell-label" aria-hidden="true">默认值</span>`20` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–99，整数 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动恢复 · SP 恢复至（%）<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_RECOVERY_SP_TARGET_PERCENT` | <span class="table-cell-label" aria-hidden="true">默认值</span>`50` | <span class="table-cell-label" aria-hidden="true">允许范围</span>2–100，且高于触发比例，整数 |

HP／SP 的恢复目标必须高于各自触发比例；道具选择与启停由玩家设置，见[自动恢复](/game/combat#自动恢复)。

#### 自动拾取

| 配置项与环境变量 | 默认值 | 允许范围 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动拾取 · 开关<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_PICKUP_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动拾取 · 范围<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_PICKUP_RANGE` | <span class="table-cell-label" aria-hidden="true">默认值</span>`5` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–15，整数 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动拾取 · 每轮拾取时限<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_PICKUP_BATCH_SECONDS` | <span class="table-cell-label" aria-hidden="true">默认值</span>`5` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–30，整数 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>自动拾取 · 默认类别<br>`HAPPYRO_CLIENT_DEFAULT_AUTO_PICKUP_CATEGORIES` | <span class="table-cell-label" aria-hidden="true">默认值</span>`equipment,consumable,card,other` | <span class="table-cell-label" aria-hidden="true">允许范围</span>equipment, consumable, card, other |

#### 镜头

| 配置项与环境变量 | 默认值 | 允许范围 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>镜头 · 桌面距离<br>`HAPPYRO_CLIENT_DEFAULT_CAMERA_DESKTOP_ZOOM` | <span class="table-cell-label" aria-hidden="true">默认值</span>`125` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–325 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>镜头 · 手机横屏距离<br>`HAPPYRO_CLIENT_DEFAULT_CAMERA_PHONE_LANDSCAPE_ZOOM` | <span class="table-cell-label" aria-hidden="true">默认值</span>`95` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–325 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>镜头 · 手机竖屏距离<br>`HAPPYRO_CLIENT_DEFAULT_CAMERA_PHONE_PORTRAIT_ZOOM` | <span class="table-cell-label" aria-hidden="true">默认值</span>`170` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–325 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>镜头 · 平板/大屏横屏距离<br>`HAPPYRO_CLIENT_DEFAULT_CAMERA_TABLET_LANDSCAPE_ZOOM` | <span class="table-cell-label" aria-hidden="true">默认值</span>`125` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–325 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>镜头 · 平板/大屏竖屏距离<br>`HAPPYRO_CLIENT_DEFAULT_CAMERA_TABLET_PORTRAIT_ZOOM` | <span class="table-cell-label" aria-hidden="true">默认值</span>`155` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–325 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>镜头 · 平滑移动<br>`HAPPYRO_CLIENT_DEFAULT_CAMERA_SMOOTH_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |

镜头和音量等设置的「恢复默认」读取本次 Gateway 下发值。

#### 画质与地图显示

| 配置项与环境变量 | 默认值 | 允许范围 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>画质 · 渲染比例<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_QUALITY` | <span class="table-cell-label" aria-hidden="true">默认值</span>`100` | <span class="table-cell-label" aria-hidden="true">允许范围</span>25–100 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>画质 · 帧率上限<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_FPS_LIMIT` | <span class="table-cell-label" aria-hidden="true">默认值</span>`60` | <span class="table-cell-label" aria-hidden="true">允许范围</span>-1, 30, 60, 90, 120 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>画质 · 性能模式<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_PERFORMANCE_MODE_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>画质 · 显示范围<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_VIEW_AREA` | <span class="table-cell-label" aria-hidden="true">默认值</span>`14` | <span class="table-cell-label" aria-hidden="true">允许范围</span>4–20 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>画质 · 游戏光标<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CURSOR_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>画质 · 像素清晰显示<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_PIXEL_PERFECT_SPRITES_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 泛光开关<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLOOM_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 景深开关<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLUR_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 抗锯齿开关<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_FXAA_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 自然饱和度开关<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_VIBRANCE_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 卡通开关<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CARTOON_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 锐化开关<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CAS_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 泛光强度<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLOOM_INTENSITY` | <span class="table-cell-label" aria-hidden="true">默认值</span>`0.5` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0.1–3 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 景深范围<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLUR_AREA` | <span class="table-cell-label" aria-hidden="true">默认值</span>`14` | <span class="table-cell-label" aria-hidden="true">允许范围</span>3–20 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 景深强度<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLUR_INTENSITY` | <span class="table-cell-label" aria-hidden="true">默认值</span>`3` | <span class="table-cell-label" aria-hidden="true">允许范围</span>2–10 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 抗锯齿边缘阈值<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_FXAA_EDGE_THRESHOLD` | <span class="table-cell-label" aria-hidden="true">默认值</span>`0.125` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0.063–0.333 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 饱和强度<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_VIBRANCE` | <span class="table-cell-label" aria-hidden="true">默认值</span>`0.15` | <span class="table-cell-label" aria-hidden="true">允许范围</span>-0.9–0.9 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 卡通强度<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CARTOON_POWER` | <span class="table-cell-label" aria-hidden="true">默认值</span>`1.5` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0.1–9.9 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 描边强度<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CARTOON_EDGE_SLOPE` | <span class="table-cell-label" aria-hidden="true">默认值</span>`1.5` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1.5–5.9 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 锐化对比度<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CAS_CONTRAST` | <span class="table-cell-label" aria-hidden="true">默认值</span>`0` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0–1 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>高级画质 · 锐化强度<br>`HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CAS_SHARPENING` | <span class="table-cell-label" aria-hidden="true">默认值</span>`1` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0–1 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>地图显示 · 雾<br>`HAPPYRO_CLIENT_DEFAULT_MAP_FOG_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>地图显示 · 光照贴图<br>`HAPPYRO_CLIENT_DEFAULT_MAP_LIGHTMAP_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>地图显示 · 技能特效<br>`HAPPYRO_CLIENT_DEFAULT_MAP_EFFECTS_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>地图显示 · 简化特效<br>`HAPPYRO_CLIENT_DEFAULT_MAP_MIN_EFFECTS_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`false` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>地图显示 · 显示未命中<br>`HAPPYRO_CLIENT_DEFAULT_MAP_SHOW_MISS_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>地图显示 · 名称字体样式<br>`HAPPYRO_CLIENT_DEFAULT_MAP_NAME_STYLE_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>地图显示 · 光照平滑参数<br>`HAPPYRO_CLIENT_DEFAULT_MAP_SMOOTH_LIGHT_MODE` | <span class="table-cell-label" aria-hidden="true">默认值</span>`0` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0, 1, 2 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>地图显示 · 光环模式<br>`HAPPYRO_CLIENT_DEFAULT_MAP_AURA_MODE` | <span class="table-cell-label" aria-hidden="true">默认值</span>`1` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0, 1, 2 |

#### 声音

| 配置项与环境变量 | 默认值 | 允许范围 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>音频 · 背景音乐开关<br>`HAPPYRO_CLIENT_DEFAULT_BGM_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>音频 · 背景音乐音量<br>`HAPPYRO_CLIENT_DEFAULT_BGM_VOLUME` | <span class="table-cell-label" aria-hidden="true">默认值</span>`0.5` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0–1 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>音频 · 音效开关<br>`HAPPYRO_CLIENT_DEFAULT_SOUND_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>音频 · 音效音量<br>`HAPPYRO_CLIENT_DEFAULT_SOUND_VOLUME` | <span class="table-cell-label" aria-hidden="true">默认值</span>`0.5` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0–1 |

#### 文字与界面

| 配置项与环境变量 | 默认值 | 允许范围 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>脚本文字 · 最低对比度目标<br>`HAPPYRO_CLIENT_DEFAULT_SCRIPT_TEXT_MIN_CONTRAST` | <span class="table-cell-label" aria-hidden="true">默认值</span>`4.5` | <span class="table-cell-label" aria-hidden="true">允许范围</span>4.5–7 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>界面 · 通知显示时长<br>`HAPPYRO_CLIENT_DEFAULT_TOAST_DURATION_SECONDS` | <span class="table-cell-label" aria-hidden="true">默认值</span>`2` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–10，整数 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>界面 · 紧凑布局聊天预览行数<br>`HAPPYRO_CLIENT_DEFAULT_CHAT_PREVIEW_COMPACT_LINES` | <span class="table-cell-label" aria-hidden="true">默认值</span>`3` | <span class="table-cell-label" aria-hidden="true">允许范围</span>2, 3, 4, 5, 6, 7, 8 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>界面 · 宽松布局聊天预览行数<br>`HAPPYRO_CLIENT_DEFAULT_CHAT_PREVIEW_SPACIOUS_LINES` | <span class="table-cell-label" aria-hidden="true">默认值</span>`5` | <span class="table-cell-label" aria-hidden="true">允许范围</span>2, 3, 4, 5, 6, 7, 8 |
| <span class="table-cell-label" aria-hidden="true">配置项与环境变量</span>界面 · 聊天预览频道标签<br>`HAPPYRO_CLIENT_DEFAULT_CHAT_PREVIEW_TABS_ENABLED` | <span class="table-cell-label" aria-hidden="true">默认值</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |

脚本文字对比度是部署策略，不保存到玩家偏好；自动修正始终开启。背景无法达到目标时选黑白两端中对比度更高者。

### 游戏服务端

| 环境变量 | 默认值 | 范围 / 用途 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_ENTITY_SYNC_RANGE_CELLS` | <span class="table-cell-label" aria-hidden="true">默认值</span>`14` | <span class="table-cell-label" aria-hidden="true">范围 / 用途</span>5–50 的十进制整数，覆盖 area_size；影响实体同步、广播及部分 AI / 跟随逻辑 |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_MAX_WALK_PATH_CELLS` | <span class="table-cell-label" aria-hidden="true">默认值</span>`17` | <span class="table-cell-label" aria-hidden="true">范围 / 用途</span>1–32 的十进制整数，覆盖 max_walk_path；限制单次路径长度 |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_CHARACTER_START_MODE` | <span class="table-cell-label" aria-hidden="true">默认值</span>`classic` | <span class="table-cell-label" aria-hidden="true">范围 / 用途</span>`ship` 或 `classic`，新建人类角色出生策略，杜兰独立 |

同步范围与行走上限仅接受表内范围的十进制整数，非法非空值会令地图服报错退出。留空时继承文件配置，见[优先级和空值](#优先级和空值)。


#### 搜怪范围与服务端同步范围

服务端默认同步 14 格，客户端默认搜怪 14 格、活动 30 格，单次行走上限 17 格。同步范围决定收到哪些实体；搜怪范围筛选当前目标；活动范围限制目标相对起点的位置；单次行走上限限制路径长度。

地图服在登录、换图和配置变化时下发实际上限，客户端同步限制搜怪设置与执行（最高 50 格）。未收到时等待；断线清除旧上限，不清空其他偏好。具体行为和范围示意见[自动战斗](/game/combat#调整战斗范围)。

#### 同步范围与性能

扩大同步范围通常增加服务器、网络和客户端负担，实际影响取决于玩家与魔物密度。画质里的显示范围不会扩大服务端同步范围。修改后重启对应原生地图服或重建 `map` 容器，无需重编 PWA；具体步骤见[生效方式](#配置位置与生效方式)。

#### 玩法与工具权限环境变量

以下权限项由地图服进程读取。未设置或留空时保留当前 battle 文件和后台管理方式；非空值在配置导入后覆盖文件。权限与时间使用十进制整数，布尔环境变量统一使用 `true` / `false`；写入游戏规则时转换为 1 / 0。

| 环境变量 | 用途 | 当前默认 | 允许范围 |
| --- | --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_NAVIGATION_TELEPORT_POLICY` | <span class="table-cell-label" aria-hidden="true">用途</span>导航传送权限 | <span class="table-cell-label" aria-hidden="true">当前默认</span>`2` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0–2 |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_NAVIGATION_TELEPORT_CROSS_MAP_ENABLED` | <span class="table-cell-label" aria-hidden="true">用途</span>导航跨地图传送 | <span class="table-cell-label" aria-hidden="true">当前默认</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_NAVIGATION_TELEPORT_COOLDOWN_SECONDS` | <span class="table-cell-label" aria-hidden="true">用途</span>导航传送冷却（秒） | <span class="table-cell-label" aria-hidden="true">当前默认</span>`1` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0–3600 |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_POLICY` | <span class="table-cell-label" aria-hidden="true">用途</span>图鉴召怪权限 | <span class="table-cell-label" aria-hidden="true">当前默认</span>`2` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0–2 |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_COOLDOWN_SECONDS` | <span class="table-cell-label" aria-hidden="true">用途</span>召怪冷却（秒） | <span class="table-cell-label" aria-hidden="true">当前默认</span>`1` | <span class="table-cell-label" aria-hidden="true">允许范围</span>0–3600 |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_DURATION_SECONDS` | <span class="table-cell-label" aria-hidden="true">用途</span>召怪存活时间（秒） | <span class="table-cell-label" aria-hidden="true">当前默认</span>`600` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–3600 |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_ALLOW_BOSS_ENABLED` | <span class="table-cell-label" aria-hidden="true">用途</span>允许召唤 Boss / MVP | <span class="table-cell-label" aria-hidden="true">当前默认</span>`true` | <span class="table-cell-label" aria-hidden="true">允许范围</span>true / false |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_TOOLS_CHARACTER_MAINTENANCE_POLICY` | <span class="table-cell-label" aria-hidden="true">用途</span>角色维护权限 | <span class="table-cell-label" aria-hidden="true">当前默认</span>`2` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–2 |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_TOOLS_GAME_SETTINGS_POLICY` | <span class="table-cell-label" aria-hidden="true">用途</span>游戏设置工具权限 | <span class="table-cell-label" aria-hidden="true">当前默认</span>`2` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–2 |
| <span class="table-cell-label" aria-hidden="true">环境变量</span>`HAPPYRO_GAME_TOOLS_ITEM_GRANT_POLICY` | <span class="table-cell-label" aria-hidden="true">用途</span>物品发放权限 | <span class="table-cell-label" aria-hidden="true">当前默认</span>`2` | <span class="table-cell-label" aria-hidden="true">允许范围</span>1–2 |

权限值：`0` 关闭（仅支持范围含 0 的项目）、`1` 仅管理员、`2` 所有玩家。角色维护、游戏设置及物品发放仅支持 1 / 2，不支持 0。默认值以当前配置为准。

非空环境变量控制的项目，在后台或游戏内设置提交时会被 API 明确拒绝，提示具体环境变量名；检查发生在写入配置文件之前，整批请求均不执行。地图服控制接口也会在修改前拒绝含受控项的整批请求。当前表单仍可输入，限制在提交时反馈。需要恢复后台管理时清空对应变量，并重新创建地图服容器或重启原生地图服。

API 从地图服读取覆盖状态，不需要复制这些变量到 API 环境。修改后的操作统一见[生效方式](#配置位置与生效方式)。

示例：保持普通玩家可以导航，限制召怪和发放为管理员操作：

```dotenv
HAPPYRO_GAME_NAVIGATION_TELEPORT_POLICY=2
HAPPYRO_GAME_NAVIGATION_TELEPORT_CROSS_MAP_ENABLED=true
HAPPYRO_GAME_NAVIGATION_TELEPORT_COOLDOWN_SECONDS=1
HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_POLICY=1
HAPPYRO_GAME_TOOLS_ITEM_GRANT_POLICY=1
```

这些项目沿用地图服原有 GM 临时命令行为；GM 临时改值不等于改写部署配置，下次 battle 重载或进程重启会重新应用环境变量。经验、掉落、精炼、地图分线也支持环境覆盖，完整名称和范围见下方自动核对清单。倍率使用百分整数：100 表示 1 倍；死亡惩罚不在当前后台开放范围。

#### 服务连接参数

以下为 Docker Server 入口变量，通常由 Compose 固定或映射，不能只在部署 `.env` 随意新增同名变量。原生脚本采用 profile 生成的配置文件。

| 变量 | Server 入口默认值 / 要求 | 用途 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_DB_HOST` / `HAPPYRO_SERVER_DB_PORT` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>`database` / `3306` | <span class="table-cell-label" aria-hidden="true">用途</span>游戏库连接 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_DB_USERNAME` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>`happyro` | <span class="table-cell-label" aria-hidden="true">用途</span>游戏服务数据库用户（与 API 游戏库访问账号独立） |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_DB_NAME` / `HAPPYRO_SERVER_LOG_DB_NAME` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>`happyro` / `happyro_log` | <span class="table-cell-label" aria-hidden="true">用途</span>游戏库、日志库 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_DB_PASSWORD` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>必填，敏感 | <span class="table-cell-label" aria-hidden="true">用途</span>数据库密码 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_INTERSERVER_USERNAME` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>`happyro_interserver` | <span class="table-cell-label" aria-hidden="true">用途</span>服务间账号 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_INTERSERVER_PASSWORD` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>必填，敏感 | <span class="table-cell-label" aria-hidden="true">用途</span>服务间密码 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_PUBLIC_HOST` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>`127.0.0.1` | <span class="table-cell-label" aria-hidden="true">用途</span>发给客户端的服务地址，Docker 由 Gateway 转发 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_LOGIN_PORT` / `HAPPYRO_SERVER_CHAR_PORT` / `HAPPYRO_SERVER_MAP_PORT` / `HAPPYRO_SERVER_WEB_PORT` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>`6900` / `6121` / `5121` / `8889` | <span class="table-cell-label" aria-hidden="true">用途</span>服务内部端口，不等同于宿主机网页端口 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GAME_PUBLIC_URL` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>Compose 使用 HAPPYRO_GAME_PUBLIC_URL | <span class="table-cell-label" aria-hidden="true">用途</span>游戏 Web API 允许的来源 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GAME_CONTROL_TOKEN` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>必填，敏感 | <span class="table-cell-label" aria-hidden="true">用途</span>与 API 保持一致 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_SERVER_CUSTOM_NPC_DIR` | <span class="table-cell-label" aria-hidden="true">Server 入口默认值 / 要求</span>Compose：`/opt/happyro/custom/npc` | <span class="table-cell-label" aria-hidden="true">用途</span>定制 NPC 挂载目录 |

原生 `deploy/rathena/profile.env` 另有 `HAPPYRO_SERVER_PUBLIC_HOST=127.0.0.1`、`HAPPYRO_SERVER_WEB_LISTEN_HOST=127.0.0.1` 和 `HAPPYRO_GAME_PUBLIC_URL=http://127.0.0.1:3338`，由配置脚本使用，不是通用的地图服 getenv 参数。

### Gateway 服务与资源

本节列程序默认值，并标明部署模板差异。路径以程序约定的工作目录或项目根解析，多个 HAPPYRO_GATEWAY_RESOURCE_OVERRIDE_DIRS 使用系统路径分隔符。

| 变量 | 程序默认值 | 用途 / 说明 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_LISTEN_HOST` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>未指定监听地址 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>原生模板使用 `127.0.0.1`，容器按部署设置 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_LISTEN_PORT` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`3338` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>HTTP / WebSocket 监听端口 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`NODE_ENV` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>未设 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>`production` 启用生产行为；生产启动脚本设为 production |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GAME_PUBLIC_URL` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`http://127.0.0.1:3338` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>客户端公开入口，Docker 映射 HAPPYRO_GAME_PUBLIC_URL |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_WS_PROXY_ENABLED` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>默认 false，非法非空值拒绝启动 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>true / false；HappyRO 模板开启 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_STATIC_SERVE_ENABLED` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>默认 false，非法非空值拒绝启动 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>true / false；HappyRO 模板开启 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_PWA_DIR` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`../../repos/happyro-client/dist/Web` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>PWA 静态目录 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_PWA_PUBLIC_PATH` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`/` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>HappyRO 原生模板使用 `/applications/pwa` |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_WS_ALLOWED_TARGETS` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`127.0.0.1:6900,127.0.0.1:6121,127.0.0.1:5121` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>逗号分隔 host:port 白名单 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_WS_TARGET_REDIRECTS` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>空 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>逗号分隔 `来源host:port=目标host:port`，容器映射到内部服务 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_CLIENT_RESOURCE_URL` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>空 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>可选 HTTP(S) 资源入口，空值同源 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_CLIENT_SOCKET_PROXY_URL` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>空 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>可选 WS(S) 封包代理入口，空值同源 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_GAME_WEB_UPSTREAM_URL` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>空 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>游戏 Web API 上游；原生模板 `http://127.0.0.1:8889` |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_API_UPSTREAM_URL` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`http://127.0.0.1:18081` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>Go API 上游 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_HTTP_PROXY_TIMEOUT_MS` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`5000` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>上游 HTTP 超时，毫秒 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_TIMEZONE` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`Asia/Shanghai` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>IANA 显示时区，非法名称拒绝启动 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_CACHE_MAX_FILES` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`5000` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>内存资源缓存文件数 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_CACHE_MAX_MEMORY_MB` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`1024` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>缓存内存预算，MB |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_CACHE_WARMUP_ENABLED` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>默认 false，非法非空值拒绝启动 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>true / false 控制启动预热；模板开启 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_CACHE_WARMUP_MAX_FILES` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`500` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>启动预热文件数 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_RESOURCE_OVERRIDE_DIRS` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>空 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>内置散装资源目录列表 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_CUSTOM_RESOURCE_DIR` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>空 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>用户自定义资源目录 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_CLIENT_DIAGNOSTICS_DIR` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>空，关闭上传 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>可选浏览器诊断接收目录 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_ESRGAN_ENABLED` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>默认 false，非法非空值拒绝启动 | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>HappyRO 模板关闭；开启需另行安装插件及准备缓存 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GATEWAY_ESRGAN_CACHE_DIR` | <span class="table-cell-label" aria-hidden="true">程序默认值</span>`./upscaled_cache` | <span class="table-cell-label" aria-hidden="true">用途 / 说明</span>可选放大资源缓存 |

### Go API 与后台

以下为 API 程序默认值，不是 `.env.example` 的示例值。例如程序 HAPPYRO_API_LISTEN_ADDRESS 默认 `:8080`，原生示例写为 `0.0.0.0:18081`；程序 HAPPYRO_ADMIN_PUBLIC_URL 默认 `http://localhost:8080`，Docker 将 HAPPYRO_ADMIN_PUBLIC_URL 映射到它。Docker 中未映射的变量须明确加入相应服务 environment。

| 变量 | 程序默认值 / 要求 | 用途 / 允许值 |
| --- | --- | --- |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_TIMEZONE` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`Asia/Shanghai` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>显式 IANA 时区，禁止空值和 Local；存储仍为 UTC |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_LISTEN_ADDRESS` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`:8080` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>HTTP 监听地址 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_PUBLIC_URL` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`http://localhost:8080` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>HTTP(S) 绝对地址，不含凭据、查询或 fragment |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_CSRF_ORIGIN_CHECK_ENABLED` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`false` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>是否校验后台 Origin 与 Sec-Fetch-Site；`true` 时仅信任 HAPPYRO_ADMIN_PUBLIC_URL 对应来源。关闭来源校验仍要求有效 CSRF Token |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_PASSWORD_CHANGE_ENABLED` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`true` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>后台自助改密；演示环境设为 `false`，隐藏入口并拒绝请求，后台不能覆盖，CLI 不受影响 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_LOG_LEVEL` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`info` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>日志级别 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`GIN_MODE` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>按 Gin 运行环境 | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>原生示例使用 release |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_TRUSTED_PROXIES` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>空列表 | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>逗号分隔的受信代理地址 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_ADMIN_DB_HOST` / `HAPPYRO_API_ADMIN_DB_PORT` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`127.0.0.1` / `3306` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>管理库连接；端口为 uint16 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_ADMIN_DB_NAME` / `HAPPYRO_API_ADMIN_DB_USERNAME` / `HAPPYRO_API_ADMIN_DB_PASSWORD` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>无默认，密码敏感 | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>管理库名称、用户和密码 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_GAME_DB_HOST` / `HAPPYRO_API_GAME_DB_PORT` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`127.0.0.1` / `3306` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>游戏库连接 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_GAME_DB_NAME` / `HAPPYRO_API_GAME_DB_USERNAME` / `HAPPYRO_API_GAME_DB_PASSWORD` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>无默认，密码敏感 | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>游戏库名称、用户和密码 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_GAME_LOG_DB_NAME` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`happyro_log` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>游戏日志库 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_INITIAL_USERNAME` / `HAPPYRO_ADMIN_INITIAL_PASSWORD` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`admin` / `admin`（敏感） | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>初始化账号 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_DEFAULT_CREDENTIALS_HINT_ENABLED` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`false` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>默认账号提示开关 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_SESSION_LIFETIME` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`2h` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>正数时长 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_SESSION_REMEMBER_LIFETIME` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`720h` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>记住登录时长，不能小于 HAPPYRO_ADMIN_SESSION_LIFETIME |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_ADMIN_SESSION_SECURE_COOKIE_ENABLED` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`false` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>HTTPS Cookie 开关 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_GAME_CONTROL_UPSTREAM_URL` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`http://127.0.0.1:8889` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>控制接口 HTTP(S) 绝对地址 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GAME_CONTROL_TOKEN` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>无默认，敏感 | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>与游戏服务共享的令牌 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_GAME_CONTROL_TIMEOUT` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`3s` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>控制请求正数超时 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_GAME_ADMIN_GROUP_IDS` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`2,3,4,10,99` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>逗号分隔的整数 GM 分组 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_ITEM_IMAGE_DIR` / `HAPPYRO_API_MONSTER_IMAGE_DIR` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>空 | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>物品 / 魔物图片根目录 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_MAP_INDEX_PATH` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`../happyro-server/db/map_index.txt` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>地图索引 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_WORLD_ASSET_DIR` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>`resources/game-data/world` | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>世界目录资源 |
| <span class="table-cell-label" aria-hidden="true">变量</span>`HAPPYRO_API_BATTLE_CONFIG_PATH` | <span class="table-cell-label" aria-hidden="true">程序默认值 / 要求</span>HTTP 服务必填绝对路径 | <span class="table-cell-label" aria-hidden="true">用途 / 允许值</span>后台维护的 battle 配置文件；与地图服共享所在目录，支持原子替换 |

数据库连接按访问身份区分：HAPPYRO_API_ADMIN_DB_* 为 API 管理库连接，HAPPYRO_API_GAME_DB_* 为 API 游戏库访问连接，HAPPYRO_SERVER_DB_* 为游戏服连接。即使访问同一数据库，也不要混用不同账号的密码。Go 时长使用 `3s`、`2h` 等格式，不能只填无单位数字。

## 注意事项

### 注册默认权限

`HAPPYRO_REGISTRATION_DEFAULT_GROUP_ID` 留空保留数据库策略，设为 `0`（普通玩家）或 `99`（GM）时在每次 API 启动应用；只影响之后新注册的账号，不修改已有账号。`HAPPYRO_REGISTRATION_DEFAULT_GROUP_EDITABLE` 独立控制后台编辑，设为 `true` 时即使配置了启动默认组也允许修改；下次 API 重启仍会重新应用非空的启动默认组。

`HAPPYRO_REGISTRATION_DEFAULT_GROUP_EDITABLE` 默认 `true`，允许后台修改注册默认权限组；设为 `false` 并重启 API 后禁用选择并拒绝修改请求，保存按钮仍可点击，无修改时提示“没有需要保存的修改”。该开关不影响启动默认组的应用；Docker 修改环境后需重新创建 API 容器。

### 优先级和空值

- 玩家设置：浏览器保存值 > Gateway 提供的默认值 > PWA 内置默认值。自动战斗设置按服务器、账号和角色区分，不写入游戏数据库，也不跨设备同步。
- 地图服覆盖：非空环境变量 > battle 配置文件及 import > 内置默认值。空值保留文件配置；battle 重载会重新应用当前进程环境。
- 空值语义不统一：`HAPPYRO_CLIENT_DEFAULT_*` 空值继承内置默认值；地图服覆盖空值继承文件；Compose 的 `:-` 把空值视为未配置，其他变量应按各自说明填写。
- 环境变量修改默认配置，不直接切换玩家正在运行的自动战斗状态。

未列入部署模板的进程变量，不会仅因写入 Docker `.env` 就进入容器，必须有 Compose `environment` 映射。不同服务的同名变量也可能用途不同，按对应表格配置。

### 核对与维护

本文依据以下源码和模板整理；更新参数时同时更新对应文档表格：

- 根仓库：`deploy/docker/.env.example`、`deploy/docker/compose.yml`、`deploy/docker/server/entrypoint.sh`、`deploy/remote-client/.env.example`、`deploy/rathena/profile.env`。
- Client：`src/Core/ClientDefaults.schema.json`，57 项客户端字段及默认值来源。
- Gateway：`index.js`、`runtime-config.js`、`client-defaults.js`、`src/controllers/clientController.js`。
- Server：`src/map/battle.cpp`、`conf/battle/client.conf`、`src/char/new_player_start.hpp`。
- API：`internal/config/config.go`、`.env.example`。

排障时先确认变量是否进入目标进程，再检查配置优先级、个人保存值及代码版本。不要在工单或日志中粘贴包含密码的完整环境。其他操作见[访问地址与目录](/deploy/configuration)、[日常维护](/deploy/maintenance)和[自定义配置](/deploy/customization)。

<!-- environment-registry:start -->
## 配置清单（自动核对）

来源：`deploy/environment/registry.json`。默认值为空的覆盖项保留现有配置；下表不是本机正在运行的配置。

| 变量 | 所有者 | 类型／范围 | 默认值 | 配置模式 |
| --- | --- | --- | --- | --- |
| `COMPOSE_PROJECT_NAME` | 部署入口 | string | `"happyro"` | 部署输入 |
| `HAPPYRO_ADMIN_CSRF_ORIGIN_CHECK_ENABLED` | API | boolean | `false` | 进程配置 |
| `HAPPYRO_ADMIN_DEFAULT_CREDENTIALS_HINT_ENABLED` | API | boolean | `false` | 进程配置 |
| `HAPPYRO_ADMIN_IMAGE` | 部署入口 | string | `"docker.io/kugarocks/happyro-admin:@VERSION@"` | 部署输入 |
| `HAPPYRO_ADMIN_INITIAL_PASSWORD` | API | string | 敏感；见初始化要求 | 进程配置 |
| `HAPPYRO_ADMIN_INITIAL_USERNAME` | API | string | `"admin"` | 进程配置 |
| `HAPPYRO_ADMIN_PASSWORD_CHANGE_ENABLED` | API | boolean | 敏感；见初始化要求 | 进程配置 |
| `HAPPYRO_ADMIN_PROXY_DYNAMIC_RANGE` | 部署入口 | string | `"172.30.81.4/30"` | 部署输入 |
| `HAPPYRO_ADMIN_PROXY_IP` | 部署入口 | string | `"172.30.81.2"` | 部署输入 |
| `HAPPYRO_ADMIN_PROXY_SUBNET` | 部署入口 | string | `"172.30.81.0/29"` | 部署输入 |
| `HAPPYRO_ADMIN_PUBLIC_URL` | API | string | `"http://localhost:8080"` | 进程配置 |
| `HAPPYRO_ADMIN_PUBLISH_ADDRESS` | 部署入口 | string | `"8000"` | 部署输入 |
| `HAPPYRO_ADMIN_SESSION_LIFETIME` | API | duration | `"2h"` | 进程配置 |
| `HAPPYRO_ADMIN_SESSION_REMEMBER_LIFETIME` | API | duration | `"720h"` | 进程配置 |
| `HAPPYRO_ADMIN_SESSION_SECURE_COOKIE_ENABLED` | API | boolean | `false` | 进程配置 |
| `HAPPYRO_API_ADMIN_DB_HOST` | API | string | `"127.0.0.1"` | 进程配置 |
| `HAPPYRO_API_ADMIN_DB_NAME` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_ADMIN_DB_PASSWORD` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_ADMIN_DB_PORT` | API | integer | `3306` | 进程配置 |
| `HAPPYRO_API_ADMIN_DB_USERNAME` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_BATTLE_CONFIG_PATH` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_GAME_CONTROL_TIMEOUT` | API | duration | `"3s"` | 进程配置 |
| `HAPPYRO_API_GAME_CONTROL_UPSTREAM_URL` | API | string | `"http://127.0.0.1:8889"` | 进程配置 |
| `HAPPYRO_API_GAME_DB_HOST` | API | string | `"127.0.0.1"` | 进程配置 |
| `HAPPYRO_API_GAME_DB_NAME` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_GAME_DB_PASSWORD` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_GAME_DB_PORT` | API | integer | `3306` | 进程配置 |
| `HAPPYRO_API_GAME_DB_USERNAME` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_GAME_LOG_DB_NAME` | API | string | `"happyro_log"` | 进程配置 |
| `HAPPYRO_API_IMAGE` | 部署入口 | string | `"docker.io/kugarocks/happyro-api:@VERSION@"` | 部署输入 |
| `HAPPYRO_API_ITEM_IMAGE_DIR` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_LISTEN_ADDRESS` | API | string | `":8080"` | 进程配置 |
| `HAPPYRO_API_LOG_LEVEL` | API | string | `"info"` | 进程配置 |
| `HAPPYRO_API_MAP_INDEX_PATH` | API | string | `"../happyro-server/db/map_index.txt"` | 进程配置 |
| `HAPPYRO_API_MONSTER_IMAGE_DIR` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_TRUSTED_PROXIES` | API | string-list | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_API_WORLD_ASSET_DIR` | API | string | `"resources/game-data/world"` | 进程配置 |
| `HAPPYRO_CHARACTER_START_MODE` | 角色服 | enum classic, ship | `"classic"` | 进程配置 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_COMBAT_ACTIVITY_RANGE` | Gateway | number [1, 100] | `30` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_COMBAT_SEARCH_RANGE` | Gateway | number [1, 50] | `14` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_PICKUP_BATCH_SECONDS` | Gateway | number [1, 30] | `5` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_PICKUP_CATEGORIES` | Gateway | list | `["equipment", "consumable", "card", "other"]` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_PICKUP_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_PICKUP_RANGE` | Gateway | number [1, 15] | `5` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_RECOVERY_HP_TARGET_PERCENT` | Gateway | number [2, 100] | `80` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_RECOVERY_HP_TRIGGER_PERCENT` | Gateway | number [1, 99] | `50` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_RECOVERY_SP_TARGET_PERCENT` | Gateway | number [2, 100] | `50` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_RECOVERY_SP_TRIGGER_PERCENT` | Gateway | number [1, 99] | `20` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_TELEPORT_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_TELEPORT_INTERVAL_SECONDS` | Gateway | number [1, 300] | `2` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_AUTO_TELEPORT_WAIT_SECONDS` | Gateway | number [1, 60] | `2` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_BGM_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_BGM_VOLUME` | Gateway | number [0, 1] | `0.5` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_CAMERA_DESKTOP_ZOOM` | Gateway | number [1, 325] | `125` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_CAMERA_PHONE_LANDSCAPE_ZOOM` | Gateway | number [1, 325] | `95` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_CAMERA_PHONE_PORTRAIT_ZOOM` | Gateway | number [1, 325] | `170` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_CAMERA_SMOOTH_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_CAMERA_TABLET_LANDSCAPE_ZOOM` | Gateway | number [1, 325] | `125` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_CAMERA_TABLET_PORTRAIT_ZOOM` | Gateway | number [1, 325] | `155` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_CHAT_PREVIEW_COMPACT_LINES` | Gateway | number | `3` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_CHAT_PREVIEW_SPACIOUS_LINES` | Gateway | number | `5` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_CHAT_PREVIEW_TABS_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLOOM_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLOOM_INTENSITY` | Gateway | number [0.1, 3] | `0.5` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLUR_AREA` | Gateway | number [3, 20] | `14` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLUR_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_BLUR_INTENSITY` | Gateway | number [2, 10] | `3` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CARTOON_EDGE_SLOPE` | Gateway | number [1.5, 5.9] | `1.5` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CARTOON_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CARTOON_POWER` | Gateway | number [0.1, 9.9] | `1.5` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CAS_CONTRAST` | Gateway | number [0, 1] | `0` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CAS_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CAS_SHARPENING` | Gateway | number [0, 1] | `1` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_CURSOR_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_FPS_LIMIT` | Gateway | number | `60` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_FXAA_EDGE_THRESHOLD` | Gateway | number [0.063, 0.333] | `0.125` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_FXAA_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_PERFORMANCE_MODE_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_PIXEL_PERFECT_SPRITES_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_QUALITY` | Gateway | number [25, 100] | `100` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_VIBRANCE` | Gateway | number [-0.9, 0.9] | `0.15` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_VIBRANCE_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_GRAPHICS_VIEW_AREA` | Gateway | number [4, 20] | `14` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_MAP_AURA_MODE` | Gateway | number | `1` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_MAP_EFFECTS_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_MAP_FOG_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_MAP_LIGHTMAP_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_MAP_MIN_EFFECTS_ENABLED` | Gateway | boolean | `false` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_MAP_NAME_STYLE_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_MAP_SHOW_MISS_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_MAP_SMOOTH_LIGHT_MODE` | Gateway | number | `0` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_SCRIPT_TEXT_MIN_CONTRAST` | Gateway | number [4.5, 7] | `4.5` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_SOUND_ENABLED` | Gateway | boolean | `true` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_SOUND_VOLUME` | Gateway | number [0, 1] | `0.5` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_DEFAULT_TOAST_DURATION_SECONDS` | Gateway | number [1, 10] | `2` | 客户端偏好默认，可被玩家设置覆盖 |
| `HAPPYRO_CLIENT_RESOURCE_URL` | Gateway | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_CLIENT_SOCKET_PROXY_URL` | Gateway | string | `""` | 部署输入 |
| `HAPPYRO_CUSTOM_DIR` | 部署入口 | string | `"./custom"` | 部署输入 |
| `HAPPYRO_DATABASE_IMAGE` | 部署入口 | string | `"docker.io/kugarocks/happyro-database:@VERSION@"` | 部署输入 |
| `HAPPYRO_DATA_DIR` | 部署入口 | string | `"./data"` | 部署输入 |
| `HAPPYRO_GAME_ADMIN_GROUP_IDS` | API | integer-list | `"2,3,4,10,99"` | 进程配置 |
| `HAPPYRO_GAME_BASE_EXP_RATE_PERCENT` | 地图服 | integer [0, 2147483647] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_CONTROL_TOKEN` | API | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_GAME_ENTITY_SYNC_RANGE_CELLS` | 地图服 | integer [5, 50] | `14` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_CARD_BOSS_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_CARD_MVP_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_CARD_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_COMMON_BOSS_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_COMMON_MVP_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_COMMON_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_EQUIP_BOSS_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_EQUIP_MVP_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_EQUIP_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_HEAL_BOSS_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_HEAL_MVP_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_HEAL_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_USE_BOSS_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_USE_MVP_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_ITEM_RATE_USE_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_JOB_EXP_RATE_PERCENT` | 地图服 | integer [0, 2147483647] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_MAX_WALK_PATH_CELLS` | 地图服 | integer [1, 32] | `17` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_NAVIGATION_MAP_CHANNELS_ENABLED` | 地图服 | boolean [0, 1] | `false` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_NAVIGATION_TELEPORT_COOLDOWN_SECONDS` | 地图服 | integer [0, 3600] | `1` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_NAVIGATION_TELEPORT_CROSS_MAP_ENABLED` | 地图服 | boolean [0, 1] | `true` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_NAVIGATION_TELEPORT_POLICY` | 地图服 | integer [0, 2] | `2` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_PUBLIC_URL` | Gateway | url | `"http://127.0.0.1:3338"` | 进程配置 |
| `HAPPYRO_GAME_REFINE_ALWAYS_SUCCESS_ENABLED` | 地图服 | boolean [0, 1] | `false` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_REFINE_CHANCE_RATE_PERCENT` | 地图服 | integer [0, 1000000] | `100` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_TOOLS_CHARACTER_MAINTENANCE_POLICY` | 地图服 | integer [1, 2] | `2` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_TOOLS_GAME_SETTINGS_POLICY` | 地图服 | integer [1, 2] | `2` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_TOOLS_ITEM_GRANT_POLICY` | 地图服 | integer [1, 2] | `2` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_ALLOW_BOSS_ENABLED` | 地图服 | boolean [0, 1] | `true` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_COOLDOWN_SECONDS` | 地图服 | integer [0, 3600] | `1` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_DURATION_SECONDS` | 地图服 | integer [1, 3600] | `600` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_POLICY` | 地图服 | integer [0, 2] | `2` | 部署覆盖，页面不能修改 |
| `HAPPYRO_GATEWAY_API_UPSTREAM_URL` | Gateway | url | `"http://127.0.0.1:18081"` | 进程配置 |
| `HAPPYRO_GATEWAY_CACHE_MAX_FILES` | Gateway | integer [1, 1000000] | `5000` | 进程配置 |
| `HAPPYRO_GATEWAY_CACHE_MAX_MEMORY_MB` | Gateway | integer [1, 1048576] | `1024` | 进程配置 |
| `HAPPYRO_GATEWAY_CACHE_WARMUP_ENABLED` | Gateway | boolean | `false` | 进程配置 |
| `HAPPYRO_GATEWAY_CACHE_WARMUP_MAX_FILES` | Gateway | integer [1, 1000000] | `500` | 进程配置 |
| `HAPPYRO_GATEWAY_CLIENT_DIAGNOSTICS_DIR` | Gateway | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_GATEWAY_CUSTOM_RESOURCE_DIR` | Gateway | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_GATEWAY_ESRGAN_CACHE_DIR` | Gateway | string | `"./upscaled_cache"` | 进程配置 |
| `HAPPYRO_GATEWAY_ESRGAN_ENABLED` | Gateway | boolean | `false` | 进程配置 |
| `HAPPYRO_GATEWAY_GAME_WEB_UPSTREAM_URL` | Gateway | url | `""` | 进程配置 |
| `HAPPYRO_GATEWAY_GRF_SCAN_MAX_FILES` | Gateway | integer [0, 10000000] | `0` | 进程配置 |
| `HAPPYRO_GATEWAY_HTTP_PROXY_TIMEOUT_MS` | Gateway | integer [1, 300000] | `5000` | 进程配置 |
| `HAPPYRO_GATEWAY_IMAGE` | 部署入口 | string | `"docker.io/kugarocks/happyro-gateway:@VERSION@"` | 部署输入 |
| `HAPPYRO_GATEWAY_LISTEN_HOST` | Gateway | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_GATEWAY_LISTEN_PORT` | Gateway | integer [1, 65535] | `3338` | 进程配置 |
| `HAPPYRO_GATEWAY_PUBLISH_ADDRESS` | 部署入口 | string | `"3338"` | 部署输入 |
| `HAPPYRO_GATEWAY_PWA_DIR` | Gateway | string | `"../../repos/happyro-client/dist/Web"` | 进程配置 |
| `HAPPYRO_GATEWAY_PWA_PUBLIC_PATH` | Gateway | string | `"/"` | 进程配置 |
| `HAPPYRO_GATEWAY_RESOURCE_OVERRIDE_DIRS` | Gateway | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_GATEWAY_STATIC_SERVE_ENABLED` | Gateway | boolean | `false` | 进程配置 |
| `HAPPYRO_GATEWAY_WS_ALLOWED_TARGETS` | Gateway | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_GATEWAY_WS_PROXY_ENABLED` | Gateway | boolean | `false` | 进程配置 |
| `HAPPYRO_GATEWAY_WS_TARGET_REDIRECTS` | Gateway | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_REGISTRATION_DEFAULT_GROUP_EDITABLE` | API | boolean | `true` | 进程配置 |
| `HAPPYRO_REGISTRATION_DEFAULT_GROUP_ID` | API | integer 0, 99 | 留空保留已有配置 | 启动应用，独立开关控制编辑 |
| `HAPPYRO_RELEASE_VERSION` | 部署入口 | string | `"@VERSION@"` | 部署输入 |
| `HAPPYRO_RESOURCE_DIR` | 部署入口 | string | `"./resources"` | 部署输入 |
| `HAPPYRO_SERVER_CUSTOM_NPC_DIR` | server | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_SERVER_DB_HOST` | server | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_SERVER_DB_NAME` | server | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_SERVER_DB_PASSWORD` | 部署入口 | string | 敏感；见初始化要求 | 部署输入 |
| `HAPPYRO_SERVER_DB_USERNAME` | server | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_SERVER_IMAGE` | 部署入口 | string | `"docker.io/kugarocks/happyro-server:@VERSION@"` | 部署输入 |
| `HAPPYRO_SERVER_INTERSERVER_PASSWORD` | 部署入口 | string | 敏感；见初始化要求 | 部署输入 |
| `HAPPYRO_SERVER_INTERSERVER_USERNAME` | server | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_SERVER_LOG_DB_NAME` | server | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_SERVER_PUBLIC_HOST` | server | string | 见用途／程序定义 | 进程配置 |
| `HAPPYRO_TIMEZONE` | api-and-gateway | string | `"Asia/Shanghai"` | 进程配置 |
| `MARIADB_DATABASE` | database | string | 见用途／程序定义 | 进程配置 |
| `MARIADB_PASSWORD` | database | string | 见用途／程序定义 | 进程配置 |
| `MARIADB_ROOT_PASSWORD` | 部署入口 | string | 敏感；见初始化要求 | 部署输入 |
| `MARIADB_USER` | database | string | 见用途／程序定义 | 进程配置 |

<!-- environment-registry:end -->
