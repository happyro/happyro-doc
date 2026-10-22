# 环境变量配置参考

::: info 适用范围
本页按当前源码维护，包含尚未随正式离线包发布的配置；不代表 v0.5.0 已支持全部条目。请以所用版本的 `.env.example`、程序和发布说明为准。新增客户端配置需要匹配的 PWA 与 Gateway，新增地图服配置需要更新服务端二进制。
:::

本页汇总部署模板、Gateway、客户端默认设置、地图服与 Go API 的配置入口。以下均为公开默认值或占位符，不是某台运行服务器的真实环境。未列入部署 `.env.example` 的进程变量，不会仅因写进 Docker `.env` 就自动进入容器。

## 配置位置与生效方式

| 场景 | 配置位置 | 修改后如何生效 |
| --- | --- | --- |
| Docker 离线包 | 部署目录 `.env`，参照同包 `.env.example` | 重新创建受影响容器；仅 restart 不会更新容器环境 |
| Gateway 原生运行 | `repos/happyro-gateway/.env`，参照根仓库 `deploy/remote-client/.env.example` | 重启 Gateway；客户端配置还需刷新网页 |
| Linux 原生游戏服务 | 根仓库 `deploy/rathena/profile.env`，通过配套启动脚本传入 | 重启相关服务 |
| macOS 原生地图服 | 同一个 `deploy/rathena/profile.env` | `macos-services.sh start` 同步地图服 plist；已加载服务需 stop/start，单独 kickstart 不读取 profile |
| 独立 systemd 地图服 | unit 的 `Environment=` 或 `EnvironmentFile=` | 重载 unit 后重启地图服 |
| Go API 原生运行 | 导出进程环境，或 systemd EnvironmentFile / launchd EnvironmentVariables | 重启 API；Go API 不自动加载 `.env` |
| Admin 前端 | 正式部署由 API 提供前端和运行配置 | 下述 API 参数不是 Vite 构建变量；无需把数据库密码写入前端 |

Gateway 重启会断开其承载的游戏 WebSocket；地图服重启会影响在线角色，安排在合适维护时机。只调整已支持的客户端默认值无需重新构建 PWA。

### 优先级和空值

- 玩家设置：浏览器保存值 > Gateway 提供的默认值 > PWA 内置默认值。自动战斗设置按服务器、账号和角色区分，不写入游戏数据库，也不跨设备同步。
- 脚本文字对比度是部署显示策略，不保存到玩家 localStorage；自动修正始终开启。
- 地图服覆盖：非空环境变量 > battle 配置文件及 import > 内置默认值。空值保留文件配置；battle 重载会重新应用当前进程环境。
- 空值语义不统一：`CLIENT_*` 空值继承内置默认值；地图服覆盖空值继承文件；Compose 的 `:-` 把空值视为未配置，其他变量应按各自说明填写。
- 环境变量没有修改玩家当前自动战斗开关的权限；默认瞬移开启不代表登录后自动开始战斗。

## Docker 部署入口

本节默认值来自根仓库 `deploy/docker/.env.example` 与 Compose。相对路径以部署目录为基准。

| 变量 | 模板默认值 / 要求 | 用途 |
| --- | --- | --- |
| `COMPOSE_PROJECT_NAME` | `happyro` | Compose 项目名 |
| `RELEASE_VERSION` | 打包时由 `deploy/docker/VERSION` 填充 | 包版本；不要手工与镜像版本混用 |
| `GATEWAY_IMAGE` / `SERVER_IMAGE` / `API_IMAGE` / `DATABASE_IMAGE` | 对应组件镜像，版本由打包填充 | 必须使用同一发布包中的镜像引用 |
| `RESOURCE_DIR` | `./resources` | 客户端和目录资源 |
| `DATA_DIR` | `./data` | 数据库、服务端配置和日志等持久数据 |
| `CUSTOM_DIR` | `./custom` | 自定义 NPC、数据库及资源 |
| `GAME_PUBLIC_URL` | `http://127.0.0.1:3338` | 玩家可访问的游戏地址，局域网使用服务器地址 |
| `ADMIN_PUBLIC_URL` | `http://127.0.0.1:8000` | 后台公开地址，传入 API 的 APP_URL |
| `GATEWAY_PORT` / `ADMIN_PORT` | `3338` / `8000` | 宿主机发布端口，调整时同步公开 URL |
| `SOCKET_PROXY_URL` | 空 | 可选外部 WebSocket 地址，空值保持同源 |
| `DB_PASSWORD` | 必填，敏感 | 游戏数据库用户密码 |
| `ADMIN_DB_PASSWORD` | 必填，敏感 | API 管理库及游戏数据访问账号密码 |
| `MARIADB_ROOT_PASSWORD` | 必填，敏感 | 数据库 root 密码 |
| `INTERSERVER_PASSWORD` | 必填，敏感 | 游戏服务间认证密码，服务端入口限制不超过 23 字符 |
| `GAME_CONTROL_TOKEN` | 必填，敏感 | API 与游戏控制接口共享令牌 |
| `ADMIN_INITIAL_USERNAME` / `ADMIN_INITIAL_PASSWORD` | `admin` / `admin`（密码敏感） | 初始化后台账号；不是修改已有账号密码的入口 |
| `SHOW_DEFAULT_CREDENTIALS` | `false` | 控制默认账号提示；还受初始化用户名和密码条件约束 |
| `SESSION_SECURE_COOKIE` | `false` | HTTPS 部署设 `true`，让会话 Cookie 仅通过 HTTPS 发送 |
| `APP_TIMEZONE` | `Asia/Shanghai` | 同时传给 API 和 Gateway 的 IANA 显示时区 |

密码和令牌使用部署工具生成的值，不提交真实环境文件。Server 入口要求 DB_PASSWORD、INTERSERVER_PASSWORD、GAME_CONTROL_TOKEN 只含字母、数字、下划线或连字符。已有数据库换密码需要同步数据库账号本身；仅修改容器变量不会自动完成凭据迁移。

## 客户端默认设置（Gateway）

以下表格依据 `happyro-client/src/Core/ClientDefaults.schema.json` 核对。所有条目都可在 Gateway 环境配置；Docker 模板和 Compose 已透传。留空继承表中的 PWA 默认值。布尔值使用 `true` / `false`；类别列表使用逗号分隔且不重复。镜头数值是客户端距离参数，寻怪与活动范围单位为地图格。

| 分类 | 配置项 | 环境变量 | 内置默认值 | 允许范围 |
| --- | --- | --- | --- | --- |
| 脚本文字 | 最低对比度目标 | `CLIENT_SCRIPT_TEXT_MIN_CONTRAST` | `4.5` | 4.5–7 |
| 镜头 | 桌面距离 | `CLIENT_CAMERA_DESKTOP_ZOOM` | `125` | 1–325 |
| 镜头 | 手机横屏距离 | `CLIENT_CAMERA_PHONE_LANDSCAPE_ZOOM` | `95` | 1–325 |
| 镜头 | 手机竖屏距离 | `CLIENT_CAMERA_PHONE_PORTRAIT_ZOOM` | `170` | 1–325 |
| 镜头 | 平板/大屏横屏距离 | `CLIENT_CAMERA_TABLET_LANDSCAPE_ZOOM` | `125` | 1–325 |
| 镜头 | 平板/大屏竖屏距离 | `CLIENT_CAMERA_TABLET_PORTRAIT_ZOOM` | `155` | 1–325 |
| 镜头 | 平滑移动 | `CLIENT_CAMERA_SMOOTH` | `true` | true / false |
| 自动战斗 | 搜怪范围 | `CLIENT_AUTO_COMBAT_SEARCH_RANGE` | `20` | 1–50，整数 |
| 自动战斗 | 活动范围 | `CLIENT_AUTO_COMBAT_ACTIVITY_RANGE` | `30` | 1–100，整数 |
| 自动战斗 | 无目标随机瞬移 | `CLIENT_AUTO_TELEPORT_ENABLED` | `true` | true / false |
| 自动战斗 | 无目标等待 | `CLIENT_AUTO_TELEPORT_WAIT_SECONDS` | `2` | 1–60，整数 |
| 自动战斗 | 最短瞬移间隔 | `CLIENT_AUTO_TELEPORT_INTERVAL_SECONDS` | `2` | 1–300，整数 |
| 自动拾取 | 开关 | `CLIENT_AUTO_PICKUP_ENABLED` | `false` | true / false |
| 自动拾取 | 范围 | `CLIENT_AUTO_PICKUP_RANGE` | `5` | 1–15，整数 |
| 自动拾取 | 每轮拾取时限 | `CLIENT_AUTO_PICKUP_BATCH_SECONDS` | `5` | 1–30，整数 |
| 自动拾取 | 默认类别 | `CLIENT_AUTO_PICKUP_CATEGORIES` | `equipment,consumable,card,other` | equipment, consumable, card, other |
| 画质 | 渲染比例 | `CLIENT_GRAPHICS_QUALITY` | `100` | 25–100 |
| 画质 | 帧率上限 | `CLIENT_GRAPHICS_FPS_LIMIT` | `60` | -1, 30, 60, 90, 120 |
| 画质 | 性能模式 | `CLIENT_GRAPHICS_PERFORMANCE_MODE` | `false` | true / false |
| 画质 | 显示范围 | `CLIENT_GRAPHICS_VIEW_AREA` | `14` | 4–20 |
| 画质 | 游戏光标 | `CLIENT_GRAPHICS_CURSOR` | `true` | true / false |
| 画质 | 像素清晰显示 | `CLIENT_GRAPHICS_PIXEL_PERFECT_SPRITES` | `false` | true / false |
| 高级画质 | 泛光开关 | `CLIENT_GRAPHICS_BLOOM_ENABLED` | `false` | true / false |
| 高级画质 | 景深开关 | `CLIENT_GRAPHICS_BLUR_ENABLED` | `false` | true / false |
| 高级画质 | 抗锯齿开关 | `CLIENT_GRAPHICS_FXAA_ENABLED` | `false` | true / false |
| 高级画质 | 自然饱和度开关 | `CLIENT_GRAPHICS_VIBRANCE_ENABLED` | `false` | true / false |
| 高级画质 | 卡通开关 | `CLIENT_GRAPHICS_CARTOON_ENABLED` | `false` | true / false |
| 高级画质 | 锐化开关 | `CLIENT_GRAPHICS_CAS_ENABLED` | `false` | true / false |
| 高级画质 | 泛光强度 | `CLIENT_GRAPHICS_BLOOM_INTENSITY` | `0.5` | 0.1–3 |
| 高级画质 | 景深范围 | `CLIENT_GRAPHICS_BLUR_AREA` | `14` | 3–20 |
| 高级画质 | 景深强度 | `CLIENT_GRAPHICS_BLUR_INTENSITY` | `3` | 2–10 |
| 高级画质 | 抗锯齿边缘阈值 | `CLIENT_GRAPHICS_FXAA_EDGE_THRESHOLD` | `0.125` | 0.063–0.333 |
| 高级画质 | 饱和强度 | `CLIENT_GRAPHICS_VIBRANCE` | `0.15` | -0.9–0.9 |
| 高级画质 | 卡通强度 | `CLIENT_GRAPHICS_CARTOON_POWER` | `1.5` | 0.1–9.9 |
| 高级画质 | 描边强度 | `CLIENT_GRAPHICS_CARTOON_EDGE_SLOPE` | `1.5` | 1.5–5.9 |
| 高级画质 | 锐化对比度 | `CLIENT_GRAPHICS_CAS_CONTRAST` | `0` | 0–1 |
| 高级画质 | 锐化强度 | `CLIENT_GRAPHICS_CAS_SHARPENING` | `1` | 0–1 |
| 音频 | 背景音乐开关 | `CLIENT_BGM_ENABLED` | `true` | true / false |
| 音频 | 背景音乐音量 | `CLIENT_BGM_VOLUME` | `0.5` | 0–1 |
| 音频 | 音效开关 | `CLIENT_SOUND_ENABLED` | `true` | true / false |
| 音频 | 音效音量 | `CLIENT_SOUND_VOLUME` | `0.5` | 0–1 |
| 界面 | 通知显示时长 | `CLIENT_TOAST_DURATION_SECONDS` | `2` | 1–10，整数 |
| 界面 | 紧凑布局聊天预览行数 | `CLIENT_CHAT_PREVIEW_COMPACT_LINES` | `3` | 2, 3, 4, 5, 6, 7, 8 |
| 界面 | 宽松布局聊天预览行数 | `CLIENT_CHAT_PREVIEW_SPACIOUS_LINES` | `5` | 2, 3, 4, 5, 6, 7, 8 |
| 界面 | 聊天预览频道标签 | `CLIENT_CHAT_PREVIEW_TABS` | `true` | true / false |
| 地图显示 | 雾 | `CLIENT_MAP_FOG` | `false` | true / false |
| 地图显示 | 光照贴图 | `CLIENT_MAP_LIGHTMAP` | `true` | true / false |
| 地图显示 | 技能特效 | `CLIENT_MAP_EFFECTS` | `true` | true / false |
| 地图显示 | 简化特效 | `CLIENT_MAP_MIN_EFFECTS` | `false` | true / false |
| 地图显示 | 显示未命中 | `CLIENT_MAP_SHOW_MISS` | `true` | true / false |
| 地图显示 | 名称字体样式 | `CLIENT_MAP_SHOW_NAME_STYLE` | `true` | true / false |
| 地图显示 | 光照平滑参数 | `CLIENT_MAP_SMOOTH_LIGHT` | `0` | 0, 1, 2 |
| 地图显示 | 光环模式 | `CLIENT_MAP_AURA` | `1` | 0, 1, 2 |

活动范围必须大于或等于寻怪范围。扩大寻怪数值不能让客户端发现服务端尚未同步的怪物；扩大视野也不会解除单次行走路径限制。当前客户端默认寻怪 20、活动 30；地图服默认视野 18、行走上限 17，四者不是同一个参数。

镜头和音量等设置的“恢复默认”读取本次 Gateway 下发的值。高对比度目标可能使字体偏离原色；背景无法达到指定比值时，选择黑白两端中对比度较高的颜色。

### 常用示例

```dotenv
# 地图服（下面一项由地图服读取）
HAPPYRO_AREA_SIZE=18
# 客户端默认值（下面各项由 Gateway 读取）
CLIENT_AUTO_COMBAT_SEARCH_RANGE=18
CLIENT_AUTO_COMBAT_ACTIVITY_RANGE=40
CLIENT_AUTO_TELEPORT_ENABLED=true
CLIENT_AUTO_TELEPORT_WAIT_SECONDS=2
CLIENT_AUTO_TELEPORT_INTERVAL_SECONDS=2
CLIENT_SCRIPT_TEXT_MIN_CONTRAST=4.5
```

这是配置示例，不会覆盖玩家已保存的自动战斗偏好，也不是所有地形和负载的性能保证。Docker 可以在同一部署 `.env` 配置；原生部署应分别放入地图服 profile 和 Gateway `.env`。

## 游戏服务端

| 环境变量 | 默认值 | 范围 / 用途 |
| --- | --- | --- |
| `HAPPYRO_AREA_SIZE` | `18` | 5–50 的十进制整数，覆盖 area_size；影响实体同步、广播及部分 AI / 跟随逻辑 |
| `HAPPYRO_MAX_WALK_PATH` | `17` | 1–32 的十进制整数，覆盖 max_walk_path；限制单次路径长度 |
| `HAPPYRO_NEW_PLAYER_START` | `ship` | `ship` 或 `classic`，新建人类角色出生策略，杜兰独立 |

视野与行走变量为空时保留 battle 文件值；已有 import 显式设为 14 时仍会覆盖新的内置视野 18。非空变量拒绝小数、负数、空白、符号、溢出及越界，非法配置会令地图服报错退出。GM 的 `@setbattleflag` 是临时运行时修改，下次重载恢复配置优先级。环境变量覆盖同名配置后，后台写入 battle 文件不会在重载时胜过环境变量。


### 玩法与工具权限环境变量

以下 10 项是新增的地图服进程变量。未设置或留空时保留当前 battle 文件和后台管理方式；非空值在配置导入后覆盖文件。均使用十进制整数，布尔项填 `0` / `1`，不接受 `true` / `false`。

| 环境变量 | 用途 | 当前默认 | 允许范围 |
| --- | --- | --- | --- |
| `HAPPYRO_NAVIGATION_TELEPORT_POLICY` | 导航传送权限 | `2` | 0–2 |
| `HAPPYRO_NAVIGATION_TELEPORT_CROSS_MAP` | 导航跨地图传送 | `1` | 0–1 |
| `HAPPYRO_NAVIGATION_TELEPORT_COOLDOWN` | 导航传送冷却（秒） | `1` | 0–3600 |
| `HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_POLICY` | 图鉴召怪权限 | `2` | 0–2 |
| `HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_COOLDOWN` | 召怪冷却（秒） | `1` | 0–3600 |
| `HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_DURATION` | 召怪存活时间（秒） | `600` | 1–3600 |
| `HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_ALLOW_BOSS` | 允许召唤 Boss / MVP | `1` | 0–1 |
| `HAPPYRO_GAME_TOOLS_CHARACTER_MAINTENANCE_POLICY` | 角色维护权限 | `2` | 1–2 |
| `HAPPYRO_GAME_TOOLS_GAME_SETTINGS_POLICY` | 游戏设置工具权限 | `2` | 1–2 |
| `HAPPYRO_GAME_TOOLS_ITEM_GRANT_POLICY` | 物品发放权限 | `2` | 1–2 |

权限值：`0` 关闭（仅支持范围含 0 的项目）、`1` 仅管理员、`2` 所有玩家。角色维护、游戏设置及物品发放仅支持 1 / 2，不支持 0。默认值沿用当前配置，本次没有改变功能开放范围。

非空环境变量控制的项目，在后台或游戏内设置提交时会被 API 明确拒绝，提示具体环境变量名；检查发生在写入配置文件之前，整批请求均不执行。地图服控制接口也会在修改前拒绝含受控项的整批请求。当前表单仍可输入，限制在提交时反馈。需要恢复后台管理时清空对应变量，并重新创建地图服容器或重启原生地图服。

新增功能需同时更新地图服与 API；旧镜像不会因加入变量自动获得支持。更新后的 Docker Compose 已映射这些变量，调整值只需重新创建地图服容器，无须再次构建镜像。API 从地图服读取覆盖状态，不需要复制这些变量到 API 环境。

示例：保持普通玩家可以导航，限制召怪和发放为管理员操作：

```dotenv
HAPPYRO_NAVIGATION_TELEPORT_POLICY=2
HAPPYRO_NAVIGATION_TELEPORT_CROSS_MAP=1
HAPPYRO_NAVIGATION_TELEPORT_COOLDOWN=1
HAPPYRO_GAME_TOOLS_MONSTER_SPAWN_POLICY=1
HAPPYRO_GAME_TOOLS_ITEM_GRANT_POLICY=1
```

这些项目沿用地图服原有 GM 临时命令行为；GM 临时改值不等于改写部署配置，下次 battle 重载或进程重启会重新应用环境变量。经验、掉落、精炼、死亡惩罚等候选项本轮未新增环境变量，继续使用原有配置和已开放的后台入口。

### 服务连接参数

以下为 Docker Server 入口变量，通常由 Compose 固定或映射，不能只在部署 `.env` 随意新增同名变量。原生脚本采用 profile 生成的配置文件。

| 变量 | Server 入口默认值 / 要求 | 用途 |
| --- | --- | --- |
| `DB_HOST` / `DB_PORT` | `database` / `3306` | 游戏库连接 |
| `DB_USER` | `happyro` | 游戏服务数据库用户（不是 API 的 DB_USERNAME） |
| `DB_MAIN_DATABASE` / `DB_LOG_DATABASE` | `happyro` / `happyro_log` | 游戏库、日志库 |
| `DB_PASSWORD` | 必填，敏感 | 数据库密码 |
| `INTERSERVER_USER` | `happyro_interserver` | 服务间账号 |
| `INTERSERVER_PASSWORD` | 必填，敏感 | 服务间密码 |
| `GAME_SERVER_IP` | `127.0.0.1` | 发给客户端的服务地址，Docker 由 Gateway 转发 |
| `LOGIN_PORT` / `CHAR_PORT` / `MAP_PORT` / `WEB_PORT` | `6900` / `6121` / `5121` / `8889` | 服务内部端口，不等同于宿主机网页端口 |
| `WEB_ALLOWED_ORIGIN` | Compose 使用 GAME_PUBLIC_URL | 游戏 Web API 允许的来源 |
| `GAME_CONTROL_TOKEN` | 必填，敏感 | 与 API 保持一致 |
| `HAPPYRO_CUSTOM_NPC_PATH` | Compose：`/opt/happyro/custom/npc` | 定制 NPC 挂载目录 |

原生 `deploy/rathena/profile.env` 另有 `SERVER_LAN_IP=127.0.0.1`、`WEB_BIND_IP=127.0.0.1` 和 `WEB_ALLOWED_ORIGIN=http://127.0.0.1:3338`，由配置脚本使用，不是通用的地图服 getenv 参数。

## Gateway 服务与资源

本节列程序默认值，并标明部署模板差异；修改后重启 Gateway。路径以程序约定的工作目录或项目根解析，多个 DATA_OVERRIDE_PATH 使用系统路径分隔符。

| 变量 | 程序默认值 | 用途 / 说明 |
| --- | --- | --- |
| `HOST` | 未指定监听地址 | 原生模板使用 `127.0.0.1`，容器按部署设置 |
| `PORT` | `3338` | HTTP / WebSocket 监听端口 |
| `NODE_ENV` | 未设 | `production` 启用生产行为；生产启动脚本设为 production |
| `CLIENT_PUBLIC_URL` | `http://localhost:8000` | 客户端公开入口，Docker 映射 GAME_PUBLIC_URL |
| `ENABLE_WSPROXY` | 未设时关闭 | 精确 `true` 开启；HappyRO 模板开启 |
| `ENABLE_STATIC_SERVE` | 未设时关闭 | 精确 `true` 开启；HappyRO 模板开启 |
| `ROBROWSER_PATH` | `../../repos/happyro-client/dist/Web` | PWA 静态目录 |
| `ROBROWSER_PUBLIC_PATH` | `/` | HappyRO 原生模板使用 `/applications/pwa` |
| `WS_ALLOWED_TARGETS` | `127.0.0.1:6900,127.0.0.1:6121,127.0.0.1:5121` | 逗号分隔 host:port 白名单 |
| `WS_TARGET_REDIRECTS` | 空 | 逗号分隔 `来源host:port=目标host:port`，容器映射到内部服务 |
| `REMOTE_CLIENT_URL` | 空 | 可选 HTTP(S) 资源入口，空值同源 |
| `SOCKET_PROXY_URL` | 空 | 可选 WS(S) 封包代理入口，空值同源 |
| `RATHENA_WEB_API_URL` | 空 | 游戏 Web API 上游；原生模板 `http://127.0.0.1:8889` |
| `HAPPYRO_API_URL` | `http://127.0.0.1:18081` | Go API 上游 |
| `HTTP_PROXY_TIMEOUT_MS` | `5000` | 上游 HTTP 超时，毫秒 |
| `APP_TIMEZONE` | `Asia/Shanghai` | IANA 显示时区，非法名称拒绝启动 |
| `CACHE_MAX_FILES` | `5000` | 内存资源缓存文件数 |
| `CACHE_MAX_MEMORY_MB` | `1024` | 缓存内存预算，MB |
| `CACHE_WARM_UP` | 未设时关闭 | 精确 true 开启启动预热；模板开启 |
| `CACHE_WARM_UP_LIMIT` | `500` | 启动预热文件数 |
| `DATA_OVERRIDE_PATH` | 空 | 内置散装资源目录列表 |
| `CUSTOM_RESOURCE_PATH` | 空 | 用户自定义资源目录 |
| `CLIENT_DIAGNOSTICS_DIR` | 空，关闭上传 | 可选浏览器诊断接收目录 |
| `ESRGAN_ENABLED` | 未设时关闭 | HappyRO 模板关闭；开启需另行安装插件及准备缓存 |
| `ESRGAN_CACHE_DIR` | `./upscaled_cache` | 可选放大资源缓存 |

## Go API 与后台

以下为 API 程序默认值，不是 `.env.example` 的示例值。例如程序 HTTP_LISTEN 默认 `:8080`，原生示例写为 `0.0.0.0:18081`；程序 APP_URL 默认 `http://localhost:8080`，Docker 将 ADMIN_PUBLIC_URL 映射到它。修改后重启 API；Docker 中未映射的变量须明确加入相应服务 environment。

| 变量 | 程序默认值 / 要求 | 用途 / 允许值 |
| --- | --- | --- |
| `APP_TIMEZONE` | `Asia/Shanghai` | 显式 IANA 时区，禁止空值和 Local；存储仍为 UTC |
| `HTTP_LISTEN` | `:8080` | HTTP 监听地址 |
| `APP_URL` | `http://localhost:8080` | HTTP(S) 绝对地址，不含凭据、查询或 fragment |
| `FRONTEND_DIR` | `../happyro-admin/dist` | Admin 静态产物目录 |
| `LOG_LEVEL` | `info` | 日志级别 |
| `GIN_MODE` | 按 Gin 运行环境 | 原生示例使用 release |
| `HTTP_TRUSTED_PROXIES` | 空列表 | 逗号分隔的受信代理地址 |
| `DB_HOST` / `DB_PORT` | `127.0.0.1` / `3306` | 管理库连接；端口为 uint16 |
| `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | 无默认，密码敏感 | 管理库名称、用户和密码 |
| `GAME_DB_HOST` / `GAME_DB_PORT` | `127.0.0.1` / `3306` | 游戏库连接 |
| `GAME_DB_DATABASE` / `GAME_DB_USERNAME` / `GAME_DB_PASSWORD` | 无默认，密码敏感 | 游戏库名称、用户和密码 |
| `GAME_LOG_DB_DATABASE` | `happyro_log` | 游戏日志库 |
| `ADMIN_INITIAL_USERNAME` / `ADMIN_INITIAL_PASSWORD` | `admin` / `admin`（敏感） | 初始化账号 |
| `SHOW_DEFAULT_CREDENTIALS` | `false` | 默认账号提示开关 |
| `SESSION_LIFETIME` | `2h` | 正数时长 |
| `SESSION_REMEMBER_LIFETIME` | `720h` | 记住登录时长，不能小于 SESSION_LIFETIME |
| `SESSION_SECURE_COOKIE` | `false` | HTTPS Cookie 开关 |
| `GAME_CONTROL_BASE_URL` | `http://127.0.0.1:8889` | 控制接口 HTTP(S) 绝对地址 |
| `GAME_CONTROL_TOKEN` | 无默认，敏感 | 与游戏服务共享的令牌 |
| `GAME_CONTROL_TIMEOUT` | `3s` | 控制请求正数超时 |
| `GAME_ADMIN_GROUP_IDS` | `2,3,4,10,99` | 逗号分隔的整数 GM 分组 |
| `GAME_ITEM_IMAGE_ROOT` / `GAME_MONSTER_IMAGE_ROOT` | 空 | 物品 / 魔物图片根目录 |
| `GAME_MAP_INDEX_PATH` | `../happyro-server/db/map_index.txt` | 地图索引 |
| `GAME_WORLD_ASSET_ROOT` | `resources/game-data/world` | 世界目录资源 |
| `GAME_SERVER_BATTLE_CONFIG_PATH` | HTTP 服务必填绝对路径 | 后台维护的 battle 配置文件；与地图服共享所在目录，支持原子替换 |

API 的 DB_* 与 Server 的 DB_* 不完全同义：API 连接的是后台管理库，Server 连接的是游戏库。不要直接把一套服务环境复制给另一套服务。Go 时长使用 `3s`、`2h` 等格式，不能只填无单位数字。

## 核对与维护

本文依据以下源码和模板整理；更新参数时同时更新对应文档表格：

- 根仓库：`deploy/docker/.env.example`、`deploy/docker/compose.yml`、`deploy/docker/server/entrypoint.sh`、`deploy/remote-client/.env.example`、`deploy/rathena/profile.env`。
- Client：`src/Core/ClientDefaults.schema.json`，53 项客户端字段及默认值来源。
- Gateway：`index.js`、`runtime-config.js`、`client-defaults.js`、`src/controllers/clientController.js`。
- Server：`src/map/battle.cpp`、`conf/battle/client.conf`、`src/char/new_player_start.hpp`。
- API：`internal/config/config.go`、`.env.example`。

排障时先确认变量是否进入目标进程，再检查配置优先级、个人保存值及代码版本。不要在工单或日志中粘贴包含密码的完整环境。其他操作见[访问地址与目录](/deploy/configuration)、[日常维护](/deploy/maintenance)和[自定义配置](/deploy/customization)。
