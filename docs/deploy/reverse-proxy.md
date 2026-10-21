# HTTPS 与反向代理

::: info 适用版本
本页适用于已发布的 v0.5.0；下载与摘要以[下载页](/guide/downloads)和[版本说明](/changelog/releases/v0.5.0)为准。
:::

域名应指向部署主机，由反向代理提供 HTTPS。游戏入口代理到 Gateway，后台入口代理到 Admin；浏览器不能直接访问数据库或内部 Game Control 服务。

## 保持登录与反向代理

游戏的“保持登录”在 HTTP 与 HTTPS 均可使用，不由 `SESSION_SECURE_COOKIE` 控制。该变量仅用于 Admin 后台；游戏由 Gateway 根据请求 Origin 的协议选择 Cookie，HTTPS 设置 Secure，HTTP 使用独立名称且不设置 Secure。HTTP 与 HTTPS、不同主机入口需要分别首次登录。

反向代理须将 `/api/game-session/*` 原路径转发到 Gateway，保留浏览器的 Host（包括非默认端口）、Origin、Cookie 和 Set-Cookie，不缓存该接口响应；Gateway 会返回 `Cache-Control: no-store`。Nginx 可用 `proxy_set_header Host $http_host;` 保留 Host，并传递原始协议供后台使用。仅设置 X-Forwarded-Host、把 Host 改成内部容器名，会使游戏会话接口因 Origin/Host 不匹配返回 403。独立 WebSocket 域名只影响 `/ws/`，游戏会话 API 仍走页面同源入口。

## 检查入口

1. 游戏启动页正常显示，点击“进入游戏”后可登录、选角和进图。
2. WebSocket 请求可以升级连接，代理超时适合长连接。
3. 后台公开地址与允许的会话域名匹配，保存操作不出现跨域或 CSRF 错误。
4. 通过同一 HTTPS 入口保持登录，重新打开后进入选角。

完整变量以[配置说明](/deploy/configuration)和包内模板为准。手机安装入口见 [PWA](/game/pwa)。遇到连接问题见[故障排查](/deploy/troubleshooting)。
