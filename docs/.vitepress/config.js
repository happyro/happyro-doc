import { defineConfig } from 'vitepress'

const changelog = [
  {
    text: '版本摘要',
    items: [
      { text: 'v0.5.0 · 未发布', link: '/changelog/releases/v0.5.0' },
      { text: 'v0.3.2', link: '/changelog/releases/v0.3.2' },
      { text: 'v0.3.1', link: '/changelog/releases/v0.3.1' },
      { text: 'v0.3.0', link: '/changelog/releases/v0.3.0' },
    ],
  },
  {
    text: '2026-10',
    collapsed: true,
    items: [
      { text: '2026-10-21', link: '/changelog/2026/10/2026-10-21' },
      { text: '2026-10-20', link: '/changelog/2026/10/2026-10-20' },
      { text: '2026-10-19', link: '/changelog/2026/10/2026-10-19' },
      { text: '2026-10-18', link: '/changelog/2026/10/2026-10-18' },
      { text: '2026-10-17', link: '/changelog/2026/10/2026-10-17' },
      { text: '2026-10-16', link: '/changelog/2026/10/2026-10-16' },
      { text: '2026-10-15', link: '/changelog/2026/10/2026-10-15' },
      { text: '2026-10-14', link: '/changelog/2026/10/2026-10-14' },
      { text: '2026-10-13', link: '/changelog/2026/10/2026-10-13' },
      { text: '2026-10-12', link: '/changelog/2026/10/2026-10-12' },
      { text: '2026-10-11', link: '/changelog/2026/10/2026-10-11' },
      { text: '2026-10-10', link: '/changelog/2026/10/2026-10-10' },
      { text: '2026-10-09', link: '/changelog/2026/10/2026-10-09' },
      { text: '2026-10-08', link: '/changelog/2026/10/2026-10-08' },
      { text: '2026-10-07', link: '/changelog/2026/10/2026-10-07' },
      { text: '2026-10-06', link: '/changelog/2026/10/2026-10-06' },
      { text: '2026-10-05', link: '/changelog/2026/10/2026-10-05' },
      { text: '2026-10-03', link: '/changelog/2026/10/2026-10-03' },
      { text: '2026-10-02', link: '/changelog/2026/10/2026-10-02' },
      { text: '2026-10-01', link: '/changelog/2026/10/2026-10-01' },
    ],
  },
  {
    text: '2026-09',
    collapsed: true,
    items: [
      { text: '2026-09-30', link: '/changelog/2026/09/2026-09-30' },
      { text: '2026-09-29', link: '/changelog/2026/09/2026-09-29' },
      { text: '2026-09-28', link: '/changelog/2026/09/2026-09-28' },
      { text: '2026-09-27', link: '/changelog/2026/09/2026-09-27' },
      { text: '2026-09-26', link: '/changelog/2026/09/2026-09-26' },
      { text: '2026-09-25', link: '/changelog/2026/09/2026-09-25' },
      { text: '2026-09-24', link: '/changelog/2026/09/2026-09-24' },
      { text: '2026-09-23', link: '/changelog/2026/09/2026-09-23' },
      { text: '2026-09-22', link: '/changelog/2026/09/2026-09-22' },
      { text: '2026-09-21', link: '/changelog/2026/09/2026-09-21' },
      { text: '2026-09-20', link: '/changelog/2026/09/2026-09-20' },
      { text: '2026-09-18', link: '/changelog/2026/09/2026-09-18' },
      { text: '2026-09-17', link: '/changelog/2026/09/2026-09-17' },
      { text: '2026-09-16', link: '/changelog/2026/09/2026-09-16' },
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
  head: [['link', { rel: 'icon', href: '/images/brand/ro-icon-1.jpg' }]],
  themeConfig: {
    docFooter: { prev: false, next: false },
    logo: '/images/brand/ro-icon-1.jpg',
    siteTitle: 'HappyRO',
    nav: [
      {
        "text": "快速开始",
        "link": "/guide/quick-start"
      },
      {
        "text": "玩家指南",
        "link": "/game/"
      },
      {
        "text": "游戏攻略",
        "link": "/strategy/"
      },
      {
        "text": "资源下载",
        "link": "/guide/downloads"
      },
      {
        "text": "安装运维",
        "link": "/deploy/"
      },
      {
        "text": "管理后台",
        "link": "/admin/"
      },
      {
        "text": "更多",
        "items": [
          {
            "text": "更新日志",
            "link": "/changelog/releases/v0.5.0"
          },
          {
            "text": "联系与反馈",
            "link": "/community/contact"
          }
        ]
      }
    ],
    sidebar: [
  {
    "text": "快速开始",
    "items": [
      {
        "text": "快速开始",
        "link": "/guide/quick-start"
      },
      {
        "text": "项目简介",
        "link": "/guide/introduction"
      },
      {
        "text": "资源下载",
        "link": "/guide/downloads"
      },
      {
        "text": "关于汉化",
        "link": "/guide/localization"
      }
    ],
    "collapsed": true
  },
  {
    "text": "玩家指南",
    "items": [
      {
        "text": "指南总览",
        "link": "/game/"
      },
      {
        "text": "开始冒险",
        "collapsed": false,
        "items": [
          {
            "text": "登录与角色",
            "link": "/game/getting-started"
          },
          {
            "text": "界面与操作",
            "link": "/game/controls"
          },
          {
            "text": "添加到主屏幕",
            "link": "/game/pwa"
          }
        ]
      },
      {
        "text": "角色与战斗",
        "collapsed": false,
        "items": [
          {
            "text": "快捷键与技能",
            "link": "/game/shortcuts"
          },
          {
            "text": "图鉴与冒险工具",
            "link": "/game/adventure-tools"
          },
          {
            "text": "战斗与拾取",
            "link": "/game/combat"
          },
          {
            "text": "职业外观与骑乘",
            "link": "/game/appearance"
          },
          {
            "text": "宠物、生命体与佣兵",
            "link": "/game/companions"
          }
        ]
      },
      {
        "text": "社交与交易",
        "collapsed": false,
        "items": [
          {
            "text": "聊天与社交",
            "link": "/game/social"
          },
          {
            "text": "交易与摆摊",
            "link": "/game/trading"
          },
          {
            "text": "邮件与附件",
            "link": "/game/mail"
          }
        ]
      }
    ],
    "collapsed": true
  },
  {
    "text": "游戏攻略",
    "collapsed": true,
    "items": [
      {
        "text": "攻略入口",
        "link": "/strategy/"
      },
      {
        "text": "转职攻略",
        "collapsed": false,
        "items": [
          {
            "text": "选择职业线",
            "link": "/strategy/job-change/"
          },
          {
            "text": "共用转职流程",
            "link": "/strategy/job-change/common"
          },
          {
            "text": "骑士系（龙骑士）",
            "link": "/strategy/job-change/knight"
          },
          {
            "text": "十字军系（帝国圣卫军）",
            "link": "/strategy/job-change/crusader"
          },
          {
            "text": "巫师系（大法师）",
            "link": "/strategy/job-change/wizard"
          },
          {
            "text": "贤者系（元素支配者）",
            "link": "/strategy/job-change/sage"
          },
          {
            "text": "猎人系（风鹰）",
            "link": "/strategy/job-change/hunter"
          },
          {
            "text": "诗人系（天籁颂者）",
            "link": "/strategy/job-change/bard"
          },
          {
            "text": "舞娘系（乐之舞灵）",
            "link": "/strategy/job-change/dancer"
          },
          {
            "text": "牧师系（枢机主教）",
            "link": "/strategy/job-change/priest"
          },
          {
            "text": "武僧系（审判者）",
            "link": "/strategy/job-change/monk"
          },
          {
            "text": "刺客系（暗影十字）",
            "link": "/strategy/job-change/assassin"
          },
          {
            "text": "流氓系（深渊追踪者）",
            "link": "/strategy/job-change/rogue"
          },
          {
            "text": "铁匠系（机甲大师）",
            "link": "/strategy/job-change/blacksmith"
          },
          {
            "text": "炼金术师系（生物学者）",
            "link": "/strategy/job-change/alchemist"
          }
        ]
      }
    ]
  },
  {
    "text": "部署与运维",
    "items": [
      {
        "text": "部署概览",
        "link": "/deploy/"
      },
      {
        "text": "安装与访问",
        "collapsed": false,
        "items": [
          {
            "text": "Docker 安装",
            "link": "/deploy/docker"
          },
          {
            "text": "访问地址与目录",
            "link": "/deploy/configuration"
          },
          {
            "text": "HTTPS 与反向代理",
            "link": "/deploy/reverse-proxy"
          }
        ]
      },
      {
        "text": "维护与升级",
        "collapsed": false,
        "items": [
          {
            "text": "日常维护",
            "link": "/deploy/maintenance"
          },
          {
            "text": "备份与恢复",
            "link": "/deploy/backup-restore"
          },
          {
            "text": "升级",
            "link": "/deploy/upgrade"
          }
        ]
      },
      {
        "text": "定制与排错",
        "collapsed": false,
        "items": [
          {
            "text": "自定义功能",
            "link": "/deploy/customization"
          },
          {
            "text": "故障排查",
            "link": "/deploy/troubleshooting"
          }
        ]
      }
    ],
    "collapsed": true
  },
  {
    "text": "管理后台",
    "items": [
      {
        "text": "后台概览",
        "link": "/admin/"
      },
      {
        "text": "账号与角色",
        "link": "/admin/accounts-characters"
      },
      {
        "text": "物品与 Zeny 发放",
        "link": "/admin/grants"
      },
      {
        "text": "游戏设置",
        "link": "/admin/game-settings"
      }
    ],
    "collapsed": true
  },
  {
    "text": "开发指南",
    "items": [
      {
        "text": "开发入口",
        "link": "/development/"
      },
      {
        "text": "架构与仓库边界",
        "link": "/development/architecture"
      },
      {
        "text": "本机开发环境",
        "collapsed": false,
        "items": [
          {
            "text": "源码与资源准备",
            "link": "/development/setup/"
          },
          {
            "text": "Linux",
            "link": "/development/setup/linux"
          },
          {
            "text": "macOS",
            "link": "/development/setup/macos"
          },
          {
            "text": "Windows / WSL2",
            "link": "/development/setup/windows"
          }
        ]
      },
      {
        "text": "贡献指南",
        "link": "/development/contributing"
      }
    ],
    "collapsed": true
  },
  {
    "text": "社区",
    "items": [
      {
        "text": "联系与反馈",
        "link": "/community/contact"
      },
      {
        "text": "贡献指南",
        "link": "/development/contributing"
      }
    ],
    "collapsed": true
  }
,
  { text: "更新日志", collapsed: true, items: changelog }
],
    outline: { label: '本页目录', level: [2, 3] },
    sidebarMenuLabel: '栏目目录',
    returnToTopLabel: '返回顶部',
    skipToContentLabel: '跳转到正文',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换浅色主题',
    darkModeSwitchTitle: '切换深色主题',
    search: {
      provider: 'local',
      options: { translations: {
        button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
        modal: { noResultsText: '未找到相关结果', resetButtonTitle: '清空搜索', backButtonTitle: '返回', displayDetails: '显示详细内容', footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' } },
      } },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/happyro/happyro' },
    ],
    footer: {
      message: 'HappyRO 仅供个人学习与研究，任何商业用途均须自行承担相应责任。',
    },
  },
})
