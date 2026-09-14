import { defineConfig } from 'vitepress'

const changelog = [
  {
    text: '2026-09',
    collapsed: true,
    items: [
      { text: '2026-09-14', link: '/changelog/2026/09/2026-09-14' },
    ],
  },
  {
    text: '2026-08',
    collapsed: true,
    items: [
      { text: '2026-08-30', link: '/changelog/2026/08/2026-08-30' },
      { text: '2026-08-29', link: '/changelog/2026/08/2026-08-29' },
      { text: '2026-08-28', link: '/changelog/2026/08/2026-08-28' },
      { text: '2026-08-27', link: '/changelog/2026/08/2026-08-27' },
      { text: '2026-08-26', link: '/changelog/2026/08/2026-08-26' },
      { text: '2026-08-25', link: '/changelog/2026/08/2026-08-25' },
      { text: '2026-08-24', link: '/changelog/2026/08/2026-08-24' },
    ],
  },
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'HappyRO',
  description: '开源中文《仙境传说 Online》Web 项目',
  cleanUrls: true,
  head: [['link', { rel: 'icon', href: '/images/ro-icon-1.jpg' }]],
  themeConfig: {
    logo: '/images/ro-icon-1.jpg',
    siteTitle: 'HappyRO',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '文档',
        items: [
          { text: '游戏体验', link: '/features/game' },
          { text: '管理后台', link: '/features/admin' },
          { text: '关于汉化', link: '/translation' },
          { text: '资源下载', link: '/downloads' },
        ],
      },
      {
        text: '安装',
        items: [
          { text: 'Docker', link: '/installation/docker' },
          { text: 'Linux', link: '/installation/linux' },
          { text: 'macOS', link: '/installation/macos' },
          { text: 'Windows', link: '/installation/windows' },
        ],
      },
      { text: '在线演示', link: 'https://happyro-demo.kugarocks.com/applications/pwa/index.html' },
    ],
    sidebar: [
      {
        text: 'HappyRO',
        items: [
          { text: '项目概览', link: '/' },
          { text: '游戏体验', link: '/features/game' },
          { text: '管理后台', link: '/features/admin' },
          { text: '关于汉化', link: '/translation' },
          { text: '资源下载', link: '/downloads' },
        ],
      },
      {
        text: '安装',
        items: [
          { text: 'Docker', link: '/installation/docker' },
          { text: 'Linux', link: '/installation/linux' },
          { text: 'macOS', link: '/installation/macos' },
          { text: 'Windows', link: '/installation/windows' },
        ],
      },
      {
        text: '社区',
        items: [
          { text: '贡献指南', link: '/community/contributing' },
          { text: '联系方式', link: '/community/contact' },
        ],
      },
      {
        text: '更新日志',
        collapsed: true,
        items: changelog,
      },
    ],
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/happyro/happyro' },
    ],
    footer: {
      message: 'HappyRO 仅供个人学习与研究，任何商业用途均须自行承担相应责任。',
    },
  },
})
