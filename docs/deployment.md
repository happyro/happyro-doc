# 生产部署

生产环境推荐使用预构建 Docker 镜像，部署主机只需要 Compose 文件和合法取得的 kRO 资源，不需要保留源码或执行前端、服务端编译。完整步骤见 [Docker 安装](/installation/docker)；需要修改代码或调试时使用 [Linux 物理部署](/installation/linux)。

## 目录和数据

建议将部署文件和持久化数据集中在同一目录：

```text
happyro/
├── compose.yml
├── kro-client/
└── data/
    ├── db/
    ├── gateway/
    └── server/
```

`kro-client/` 保存 kRO 资源，`data/` 保存数据库和服务日志。升级镜像或重建容器不会删除这些目录；停止服务时不要手动删除 `data/db/`。

## 网络边界

生产环境只对外提供 Gateway 或反向代理的 HTTP/HTTPS 端口。MariaDB 和 rAthena 的 login、char、map、web 端口只在 Docker 网络内使用，不应直接暴露到公网。

使用域名和 HTTPS 时，将反向代理转发到 `127.0.0.1:3338`，并正确传递 WebSocket 升级请求。通过环境变量将 `CLIENT_PUBLIC_URL` 和 `WEB_ALLOWED_ORIGIN` 设置为实际站点地址。

## 更新和回滚

更新前备份 `data/db/`，然后拉取并重建容器：

```bash
docker compose -f compose.yml pull
docker compose -f compose.yml up -d --no-build
docker compose -f compose.yml ps
```

回滚时将 Compose 中的镜像标签改回已验证版本，再执行相同的 `up` 命令。生产环境应使用明确的版本标签，不要长期依赖 `latest`。

## 发布检查

部署完成后检查容器状态、Gateway 健康接口、PWA 页面和实际登录流程：

```bash
docker compose -f compose.yml ps
curl --fail http://127.0.0.1:3338/api/health
curl --fail http://127.0.0.1:3338/applications/pwa/index.html
docker compose -f compose.yml logs --tail=100 gateway
```
