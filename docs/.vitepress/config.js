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
          {
            text: '文档',
            items: [
              { text: '项目架构', link: '/architecture' },
              { text: '安装文档', link: '/installation' },
              { text: '关于翻译', link: '/translation' },
            ],
          },
          {
            text: '社区',
            items: [
              { text: '贡献指南', link: '/contributing' },
              { text: '联系方式', link: '/contact' },
            ],
          },
          { text: '在线演示', link: '/demo' },
          { text: '更新日志', link: '/changelog' },
        ],
        sidebar: {
          '/': [
            {
              text: '文档',
              items: [
                { text: '项目架构', link: '/architecture' },
                { text: '安装文档', link: '/installation' },
                { text: '关于翻译', link: '/translation' },
              ],
            },
            {
              text: '社区',
              items: [
                { text: '贡献指南', link: '/contributing' },
                { text: '联系方式', link: '/contact' },
              ],
            },
          ],
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        langMenuLabel: 'Change language',
        nav: [
          { text: 'Home', link: '/en/' },
          {
            text: 'Docs',
            items: [
              { text: 'Architecture', link: '/en/architecture' },
              { text: 'Installation', link: '/en/installation' },
              { text: 'Translation', link: '/en/translation' },
            ],
          },
          {
            text: 'Community',
            items: [
              { text: 'Contributing', link: '/en/contributing' },
              { text: 'Contact', link: '/en/contact' },
            ],
          },
          { text: 'Demo', link: '/en/demo' },
          { text: 'Changelog', link: '/en/changelog' },
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Docs',
              items: [
                { text: 'Architecture', link: '/en/architecture' },
                { text: 'Installation', link: '/en/installation' },
                { text: 'Translation', link: '/en/translation' },
              ],
            },
            {
              text: 'Community',
              items: [
                { text: 'Contributing', link: '/en/contributing' },
                { text: 'Contact', link: '/en/contact' },
              ],
            },
          ],
        },
        footer: {
          message: 'HappyRO is for personal study and research only; users assume all responsibility for any commercial use.',
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
      { text: '文档', link: '/architecture' },
      { text: '在线演示', link: '/demo' },
      { text: '更新日志', link: '/changelog' },
    ],
    sidebar: [
      {
        text: '文档',
        items: [
          { text: '项目架构', link: '/architecture' },
          { text: '安装文档', link: '/installation' },
          { text: '关于翻译', link: '/translation' },
        ],
      },
      {
        text: '社区',
        items: [
          { text: '贡献指南', link: '/contributing' },
          { text: '联系方式', link: '/contact' },
        ],
      },
    ],
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kugarocks' },
    ],
    footer: {
      message: 'HappyRO 仅供个人学习与研究，任何商业用途均须自行承担相应责任。',
    },
  },
})
