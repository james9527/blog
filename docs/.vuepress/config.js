module.exports = {
  // base: '/blog/', // 部署到james9527.github.io/blog上
  // base: '/', // 部署到james9527.github.io上（默认配置）
  // dest: 'docs',
  title: 'james9527的前端日志',
  description: '欢迎访问我的前端日志~',
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', {
      rel: 'icon',
      href: 'https://github.githubassets.com/favicon.ico'
    }],
    ['meta', {
      name: 'theme-color',
      content: '#3eaf7c'
    }],
  ],
  themeConfig: {
    // sidebarDepth: 2, // 嵌套标题的默认链接深度为1，最大为2
    navBar: true,
    // 显示所有页面的标题链接，默认情况下，侧边栏只会显示由当前活动页面的标题链接
    displayAllHeaders: true,
    nav: [{
        text: '随手记系列',
        items: [{
            text: 'eslint规则',
            link: '/blog/share/eslint'
          },
          {
            text: '性能优化',
            link: '/blog/share/opt'
          },
          {
            text: '深入webpack',
            link: '/blog/share/webpack'
          },
          {
            text: 'webpack随手记',
            link: '/blog/share/webpack-note'
          },
          {
            text: '公众号开发总结',
            link: '/blog/share/wechat'
          },
          {
            text: '深入浅出前端脚手架',
            link: '/blog/share/scaffold'
          },
          {
            text: '前端基础JS系列',
            link: '/blog/share/javascript-basic'
          },
          {
            text: 'markdown语法',
            link: '/blog/share/md'
          },
        ]
      },
      {
        text: '工作相关',
        items: [{
            text: '深入skulpt',
            link: '/blog/skulpt/1'
          },
          {
            text: '深入scratch',
            link: '/blog/scratch/links'
          },
        ]
      },
      {
        text: '计算机英语',
        items: [{
            text: 'webpack 英文',
            link: '/blog/en/webpack'
          },
          {
            text: 'npm 英文',
            link: '/blog/en/npm'
          },
          {
            text: 'skulpt 英文',
            link: '/blog/en/skulpt'
          },
          {
            text: 'scratch 英文',
            link: '/blog/en/scratch'
          },
          {
            text: 'ecma 英文',
            link: '/blog/en/ecma'
          },
        ]
      },
      {
        text: '常用网址',
        link: '/blog/url/fe'
      },
      {
        text: 'github',
        link: 'https://github.com/james9527/blog'
      },
    ],
    sidebar: {
      '/skulpt/': genSidebarConfig('skulpt', ['links', '1']),
      '/scratch/': genSidebarConfig('深入scratch', ['links', '1', 'sb3']),
    },
    lastUpdated: "更新时间",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "本文源码地址",
  },
  plugins: {
    '@vuepress/medium-zoom': {
      selector: 'img',
      options: {
        margin: 16
      }
    },
    '@vuepress/back-to-top': true
  }
}

function genSidebarConfig(title, children) {
  return [{
    title,
    children
  }]
}
