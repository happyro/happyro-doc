# 访问地址与目录配置

## 配置访问地址

默认仅允许部署机器本机访问。编辑 `.env`，需要局域网访问时再将以下值同步改为部署机器的局域网地址：

```dotenv
HAPPYRO_GAME_PUBLIC_URL=http://127.0.0.1:3338
HAPPYRO_ADMIN_PUBLIC_URL=http://127.0.0.1:8000
```

镜像变量与 HAPPYRO_RELEASE_VERSION 保持包内版本。HAPPYRO_RESOURCE_DIR 指向本版资源；HAPPYRO_DATA_DIR 和 HAPPYRO_CUSTOM_DIR 可设为版本目录外的专用绝对路径。若改变 HAPPYRO_DATA_DIR，需准备完整数据子目录；改变 HAPPYRO_CUSTOM_DIR 后执行：

初始化自定义目录：

```bash
python3 tools/deployment/manage.py initialize-custom --directory .
```

该命令只补缺少模板，不覆盖已有定制。具体操作见[自定义 NPC、数据库与资源](/deploy/customization)。

## 配置来源

以当前包的 `.env.example` 为准；不要将另一版本的完整环境文件直接覆盖新模板。修改地址后重新部署并检查网页、登录、选角、进图及后台接口。后台与游戏使用不同入口，局域网设备不能使用部署机器的 `127.0.0.1`。

数据库密码和控制令牌须保留在自己的环境文件中。每次安装重新初始化配置与密钥，不复用旧环境。

## 显示时区

部署 `.env` 中的 `HAPPYRO_TIMEZONE` 默认为 `Asia/Shanghai`（北京时间，UTC+8）。可以使用 `UTC`、`America/New_York` 等 IANA 时区；非法值会使服务启动失败。

```dotenv
HAPPYRO_TIMEZONE=Asia/Shanghai
```

API 与 Gateway 使用同一个值。修改后重建这两个服务的容器并刷新页面，后台及游戏内日期时间都会按新时区显示，无需重新构建前端。原生部署则在 API 和 Gateway 环境文件中设置相同值并重启服务。

数据库与 API 时间统一为 UTC。该配置只改变显示时区，不改写历史数据、不改变会话到期时间和服务端 NPC 日历事件；不提供旧时间格式或历史时区的兼容处理。

## 全部环境变量

客户端默认设置、服务端视野、Gateway 缓存以及 API 会话等参数见[环境变量配置参考](/deploy/environment-variables)。
