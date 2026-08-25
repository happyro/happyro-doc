---
layout: home
hero:
  name: HappyRO
  text: Ragnarok Online LAN Web Stack
  tagline: A reproducible development environment built with roBrowserLegacy, rAthena, and MariaDB
  image:
    src: /images/ro-logo-1.png
    alt: Ragnarok Online logo
  actions:
    - theme: brand
      text: Explore architecture
      link: /en/architecture
    - theme: alt
      text: Start deployment
      link: /en/deployment
features:
  - icon: 🧩
    title: Layered architecture
    details: Browser client, gateway, rAthena, and MariaDB each have a clear responsibility.
  - icon: 🔒
    title: LAN first
    details: Runtime resources and APIs stay inside the LAN without public GRF or WebSocket services.
  - icon: 🔁
    title: Reproducible deployment
    details: Versions, resources, and startup order are managed by the Makefile and scripts.
---
