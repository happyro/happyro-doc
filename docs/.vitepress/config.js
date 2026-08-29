import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'HappyRO',
  description: 'HappyRO 局域网 Ragnarok Online Web 栈文档',
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        langMenuLabel: '切换语言',
        nav: [
          { text: '首页', link: '/' },
          { text: '文档', link: '/intro' },
          { text: '资源下载', link: '/downloads' },
          {
            text: '社区',
            items: [
              { text: '贡献指南', link: '/community/contributing' },
              { text: '联系方式', link: '/community/contact' },
            ],
          },
          { text: '在线演示', link: 'https://happyro-demo.kugarocks.com/applications/pwa/index.html' },
        ],
        sidebar: {
          '/': [
            {
              text: '文档',
              items: [
                { text: '项目简介', link: '/intro' },
                { text: '资源下载', link: '/downloads' },
                { text: '关于翻译', link: '/translation' },
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
              items: [
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
              ],
            },
          ],
        },
      },
    },
  },
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: '/images/ro-icon-1.jpg' }],
  ],
  themeConfig: {
    logo: '/images/ro-icon-1.jpg',
    siteTitle: 'HappyRO',
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/intro' },
      { text: '资源下载', link: '/downloads' },
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
        text: '文档',
        items: [
          { text: '项目简介', link: '/intro' },
          { text: '资源下载', link: '/downloads' },
          { text: '关于翻译', link: '/translation' },
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
        items: [
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
        ],
      },
    ],
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/happyro/happyro' },
    ],
    footer: {
      message: 'HappyRO 仅供个人学习与研究，任何商业用途均须自行承担相应责任。',
    },
  },
})
