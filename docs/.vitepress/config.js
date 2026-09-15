import { defineConfig } from 'vitepress'

const changelog = [
  {
    text: '2026-09',
    collapsed: true,
    items: [
      { text: '2026-09-15', link: '/changelog/2026/09/2026-09-15' },
      { text: '2026-09-14', link: '/changelog/2026/09/2026-09-14' },
      { text: '2026-09-13', link: '/changelog/2026/09/2026-09-13' },
      { text: '2026-09-12', link: '/changelog/2026/09/2026-09-12' },
      { text: '2026-09-11', link: '/changelog/2026/09/2026-09-11' },
      { text: '2026-09-10', link: '/changelog/2026/09/2026-09-10' },
      { text: '2026-09-09', link: '/changelog/2026/09/2026-09-09' },
      { text: '2026-09-08', link: '/changelog/2026/09/2026-09-08' },
      { text: '2026-09-07', link: '/changelog/2026/09/2026-09-07' },
      { text: '2026-09-06', link: '/changelog/2026/09/2026-09-06' },
      { text: '2026-09-05', link: '/changelog/2026/09/2026-09-05' },
      { text: '2026-09-04', link: '/changelog/2026/09/2026-09-04' },
      { text: '2026-09-03', link: '/changelog/2026/09/2026-09-03' },
      { text: '2026-09-02', link: '/changelog/2026/09/2026-09-02' },
      { text: '2026-09-01', link: '/changelog/2026/09/2026-09-01' },
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
    docFooter: { prev: false, next: false },
    logo: '/images/ro-icon-1.jpg',
    siteTitle: 'HappyRO',
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/intro' },
      { text: '资源下载', link: '/downloads' },
      {
        text: '安装',
        items: [
          {
            text: '容器化部署',
            items: [
              { text: 'Docker', link: '/installation/docker' },
            ],
          },
          {
            text: '原生部署',
            items: [
              { text: 'Linux', link: '/installation/linux' },
              { text: 'macOS', link: '/installation/macos' },
              { text: 'Windows', link: '/installation/windows' },
            ],
          },
        ],
      },
      {
        text: '社区',
        items: [
          { text: '贡献指南', link: '/community/contributing' },
          { text: '联系方式', link: '/community/contact' },
        ],
      },
      { text: '游戏演示', link: 'https://happyro-demo.kugarocks.com/applications/pwa/index.html' },
      { text: '后台演示', link: 'https://happyro-admin.kugarocks.com' },
    ],
    sidebar: [
      {
        text: '文档',
        items: [
          { text: '项目简介', link: '/intro' },
          { text: '游戏画面', link: '/features/game' },
          { text: '管理后台', link: '/features/admin' },
          { text: '关于汉化', link: '/translation' },
          { text: '资源下载', link: '/downloads' },
        ],
      },
      {
        text: '容器化部署',
        items: [
          { text: 'Docker', link: '/installation/docker' },
        ],
      },
      {
        text: '原生部署',
        items: [
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
