# 生产部署

日常开发请使用[安装部署](/installation)中的 Makefile 流程。公网演示环境使用三个仓库的 `demo` 分支，在本地完成构建后生成生产包，再将产物部署到 Linux 服务器；目标服务器不需要保留源码或执行前端、服务端编译。

## 生成发布包

确认根仓库、客户端和服务端都位于 `demo` 分支且工作区干净，然后在根仓库执行：

```bash
tools/deploy/package-demo.sh --build
```

归档默认生成到 `work/deploy/happyro-demo-<年月日-时分>.tar.gz`。生产包包含已构建的 PWA、rAthena 可执行文件、网关、中文覆盖和部署脚本，不包含 Git 历史、密钥、数据库数据、日志或 kRO 运行资源。

## 服务器目录

建议使用不可变版本目录，并通过 `current` 符号链接切换版本：

```text
/opt/happyro-demo/
├── releases/<版本>/
└── current -> releases/<版本>/
```

kRO 资源单独保存在受控目录，并在运行时配置中指向该目录。至少需要 `client/data.grf` 和 `client/DATA.INI`，不要把这些资源加入发布包或公开代码仓库。

## 服务边界

生产环境使用持久化 systemd unit 管理 MariaDB 初始化、rAthena login/char/map/web 和网关，并使用 systemd timer 执行演示数据库重置。物理 MariaDB 只监听回环地址；反向代理将站点域名转发到本机网关，公网只开放 HTTP/HTTPS。

部署包内的 `deployment/docs/deploy/production/README.md` 记录对应版本的安装命令、配置文件、服务启停和验收步骤。部署时应以包内文档为准，因为它与发布产物保持同一版本。

## 发布检查

完成切换后至少检查 systemd 服务状态、数据库重置定时器、网关健康接口、PWA 页面和实际登录流程。回滚时只需将 `current` 重新指向上一版本并重启相关服务；数据库结构发生变化时，应先按该版本部署文档处理数据迁移。
