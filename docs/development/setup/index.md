# 源码与运行资源准备

源码开发适合修改客户端、服务端或后台。只想部署可玩环境时使用 [Docker 安装](/deploy/docker)。下面是各系统共用步骤，平台依赖和启动方式见 [Linux](/development/setup/linux)、[macOS](/development/setup/macos) 和 [Windows / WSL2](/development/setup/windows)。

## 检出六个构建仓库

```bash
git clone https://github.com/happyro/happyro.git
cd happyro
git clone https://github.com/happyro/happyro-client.git repos/happyro-client
git clone https://github.com/happyro/happyro-server.git repos/happyro-server
git clone https://github.com/happyro/happyro-gateway.git repos/happyro-gateway
git clone https://github.com/happyro/happyro-admin.git repos/happyro-admin
git clone https://github.com/happyro/happyro-api.git repos/happyro-api
```

根仓库与五个应用仓库维护独立 Git 历史，长期维护分支均为 `main`。文档站是第七个维护仓库，不是游戏构建依赖；维护文档时另行执行 `git clone https://github.com/happyro/happyro-doc.git repos/happyro-doc`。

管理前端与 Go API 分别启动。安装 Node.js 22+，并按 [API go.mod](https://github.com/happyro/happyro-api/blob/main/go.mod) 准备 Go 工具链；初始化全新管理库、创建管理员和启动 API 见 [API 部署](https://github.com/happyro/happyro-api/blob/main/docs/deployment.md)，前端构建与代理见 [Admin 部署](https://github.com/happyro/happyro-admin/blob/main/docs/deployment.md)。根仓库的游戏启动命令不会自动启动这两个服务。

## 准备运行资源

源码仓库不包含 kRO 运行资源。从同版本[离线包](/guide/downloads)复制：

```bash
mkdir -p inputs/runtime/kro-20211105
cp -a /path/to/happyro-v0.5.0/resources/kro-20211105 \
  inputs/runtime/kro-20211105/client
```

## 构建边界

客户端必须完整构建 PWA：`npm run build:pwa` 或 `npm run build -- --all`。启动页应包含“进入游戏”和查看器入口，不能用仅 Online 构建替代。

应用代码、资源与数据库需匹配，不以新源码直接保证旧版运行包所有功能可用。根仓库[资源准备说明](https://github.com/happyro/happyro/blob/main/inputs/README.md)是本机输入目录和校验流程的维护入口。
