---
layout: home
hero:
  name: HappyRO
  text: Ragnarok Online 局域网 Web 栈
  tagline: 用 roBrowserLegacy、rAthena 与 MariaDB 组成的可复现开发环境
  image:
    src: /images/ro-logo-1.png
    alt: Ragnarok Online 标志
  actions:
    - theme: brand
      text: 了解项目架构
      link: /architecture
    - theme: alt
      text: 开始部署
      link: /deployment
features:
  - icon: 🧩
    title: 分层架构
    details: 浏览器客户端、网关、rAthena 服务端和 MariaDB 各司其职，边界清晰。
  - icon: 🔒
    title: 局域网优先
    details: 不依赖公共 GRF、WebSocket 或 GitHub 运行时服务，资源与接口均在内网提供。
  - icon: 🔁
    title: 可复现部署
    details: 版本、运行时资源和启动顺序均由 Makefile 与脚本统一管理。
---
