module.exports = {
  // base: '/blog/', // 部署到github.io/blog上
  base: '/', // 部署到github.io上
  dest: 'docs',
  title: 'james9527的前端日志',
  description: '欢迎访问我的前端日志~',
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
    sidebarDepth: 3,
    navBar: true,
    nav: [{
        text: '随手记系列',
        items: [{
            text: 'eslint规则',
            link: '/share/eslint'
          },
          {
            text: '性能优化',
            link: '/share/opt'
          },
          {
            text: '深入webpack',
            link: '/share/webpack'
          },
          {
            text: 'webpack随手记',
            link: '/share/webpack-note'
          },
          {
            text: '公众号开发总结',
            link: '/share/wechat'
          },
          {
            text: '深入浅出前端脚手架',
            link: '/share/scaffold'
          },
          {
            text: '前端基础JS系列',
            link: '/share/javascript-basic'
          },
          {
            text: '移动端性能优化(一)',
            link: '/share/optimize'
          },
          {
            text: '移动端性能优化(二)',
            link: '/share/optimize2'
          },
          {
            text: 'markdown语法',
            link: '/share/md'
          },
        ]
      },
      {
        text: '工作相关',
        items: [{
            text: '深入skulpt',
            link: '/skulpt/1'
          },
          {
            text: '深入scratch',
            link: '/scratch/links'
          },
        ]
      },
      {
        text: '计算机英语',
        items: [{
            text: 'webpack 英文',
            link: '/en/webpack'
          },
          {
            text: 'npm 英文',
            link: '/en/npm'
          },
          {
            text: 'skulpt 英文',
            link: '/en/skulpt'
          },
          {
            text: 'scratch 英文',
            link: '/en/scratch'
          },
          {
            text: 'ecma 英文',
            link: '/en/ecma'
          },
        ]
      },
      {
        text: '常用网址',
        link: '/url/fe'
      },
      {
        text: 'github',
        link: 'https://github.com/james9527'
      },
    ],
    sidebar: {
      '/skulpt/': genSidebarConfig('skulpt', ['links', '1']),
      '/scratch/': genSidebarConfig('深入scratch', ['links', '1', 'sb3']),
    }
  }
}

function genSidebarConfig(title, children) {
  return [{
    title,
    children
  }]
}
