const path = require('path')

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
    // 启用页面滚动效果
    smoothScroll: true,
    // 启用上一篇链接
    prevLinks: true,
    // 启用下一篇链接
    nextLinks: true,
    nav: [
      {
        text: '前端基础',
        items: [{
            text: '前端基础JS系列',
            link: '/blog/basic/js'
          }, 
          {
            text: '前端基础CSS系列',
            link: '/blog/basic/css'
          }
        ]
      },
      {
        text: '前端进阶',
        items: [
          {
            text: 'Javascript进阶系列',
            link: '/blog/advanced/js'
          }, {
            text: 'CSS进阶系列',
            link: '/blog/advanced/css'
          }, {
            text: 'Node.js进阶系列',
            link: '/blog/advanced/node'
          }, {
            text: '性能优化系列',
            link: '/blog/advanced/performance'
          },
        ]
      },
      {
        text: '前端工程化',
        items: [{
            text: 'Webpack核心概念',
            link: '/blog/fe-compile/webpack-principle'
          }, {
            text: 'vue-cli中webpack相关配置',
            link: '/blog/fe-compile/vue-cli'
          }, {
            text: 'Webpack踩坑清单',
            link: '/blog/fe-compile/webpack-bug-list'
          }
        ]
      },
      {
        text: '工作相关',
        items: [{
          text: '前端开发手册',
          link: '/blog/work/home'
        }, {
          text: '深入scratch',
          link: '/blog/scratch/material'
        }, {
          text: '深入skulpt',
          link: '/blog/skulpt/introduce'
        }]
      },
      {
        text: '常用网址',
        link: '/blog/bookmark/home'
      },
      {
        text: 'Github',
        link: 'https://github.com/james9527'
      },
    ],
    sidebar: false,
    // lastUpdated: "更新时间",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "本文源码地址",
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@img': '/blog/images'
      }
    }
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
