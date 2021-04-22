

## 前言
最近两个月，刚完成一个Nuxt.js项目并顺利上线，前期主要精力在写移动端组件库，真正写业务代码到项目上线的时间不到一个月，其中所踩的坑也是不少的。这是一个纯电商项目，页面上所有的楼层都需要灵活配置，支持页面配置的就是众所周知的CMS系统了，今天咱们的重点不是它，而是想分享下用Nuxt去重构一个项目时所踩的一些坑及填坑笔记。

## 为何选择Nuxt

+ 团队一直用Vue这套技术栈；
+ Nuxt.js上手门槛极低，会用Vue就可以了；
+ 原本有打算引入Nuxt.js的，恰好又迎来首页改版的绝佳时机。

出于团队、首屏性能、SEO等主要问题考量，我们选择了Nuxt.js去重构M站。一方面，符合团队的技术栈，方便后期维护；另一方面，Nuxt.js支持基于Vue应用程序生成静态站点，有利于SEO。本项目用到的Nuxt版本信息是`"nuxt": "^2.11.0"`，更多关于Nuxt的具体介绍，请移步至[Nuxt.js中文网](https://www.nuxtjs.cn/)。

## 项目结构概览
用Nuxt官方提供的脚手架生成一个项目，执行命令：

```sh
$ npx create-nuxt-app <project-name>
```
生成的项目结构如下所示：

![Nuxt.js目录结构](https://user-gold-cdn.xitu.io/2020/5/20/1722fce9711dd035?w=1625&h=775&f=png&s=241073)

## 值得一提的事项「Tips」

### Nuxt生命周期
> 需要注意的是，在Nuxt项目中`beforeCreate`和`Created`这俩生命周期在Server端和Client端都会执行，因此不能直接用window下的全局属性和方法。如果要用，可以用nuxt给process对象扩展的server/client属性值去判断即可，技巧如下：

```js
<script>
export default {
  created() {
    if(!process.server) { // 或者process.client，客户端环境
      // TODO
      document.title = "前端TALK";
    }
  }
}
<script/>
```

附上生命周期流程图：

![Nuxt生命周期流程图](https://user-gold-cdn.xitu.io/2020/5/20/1722fcded4741e59?w=460&h=945&f=png&s=45763)

### 路由
> 这是Nuxt.js最省事的一点，它会依据pages目录结构自动生成 `vue-router` 模块的路由配置。因此，我们只需写对目录结构即可，不用关心路由的配置。

#### 基础路由
假设 pages 的目录结构如下：

```sh
pages/
--| user/
-----| index.vue
-----| one.vue
--| index.vue
```
那么，Nuxt.js 自动生成的路由配置如下：

```js
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'user',
      path: '/user',
      component: 'pages/user/index.vue'
    },
    {
      name: 'user-one',
      path: '/user/one',
      component: 'pages/user/one.vue'
    }
  ]
}
```

#### 动态路由
> 在 Nuxt.js 里面定义带参数的动态路由，需要创建对应的以「下划线」作为前缀的 Vue 文件 或 目录。
以下目录结构：

```sh
pages/
--| _slug/
-----| comments.vue
-----| index.vue
--| users/
-----| _id.vue
--| index.vue
```

Nuxt.js 生成对应的路由配置表为：

```
router: {
  routes: [
    {
      name: 'index',
      path: '/',
      component: 'pages/index.vue'
    },
    {
      name: 'users-id',
      path: '/users/:id?',
      component: 'pages/users/_id.vue'
    },
    {
      name: 'slug',
      path: '/:slug',
      component: 'pages/_slug/index.vue'
    },
    {
      name: 'slug-comments',
      path: '/:slug/comments',
      component: 'pages/_slug/comments.vue'
    }
  ]
}
```
更多关于Nuxt路由的问题，请参考[Nuxt官方文档--路由章节](https://www.nuxtjs.cn/guide/routing)

### asyncData的使用
你可能想要在服务器端获取并渲染数据。Nuxt.js添加了`asyncData`方法使得你能够在渲染组件之前异步获取数据。`asyncData`方法会在组件（限于页面组件）每次加载之前被调用。它可以在服务端或路由更新之前被调用。在这个方法被调用的时候，第一个参数被设定为当前页面的上下文对象，你可以利用 `asyncData`方法来获取数据并返回给当前组件。关于`asyncData`的使用，有几点需特别注意：

+ 不能访问`this`对象（由于`asyncData`方法是在组件初始化前被调用的）；
+ `asyncData`在服务端和客户端都有可能执行；
+ window对象上的一些属性和方法不用能；
+ 设置的cookie信息，需下次请求时才能拿到最新（当然在客户端`mounted`阶段是能获取到最新的cookie信息）；

假设当前`mode`设置为`universal`，即同构应用程序（服务器端呈现+客户端路由导航等），并且页面跳转是路由模式，此时`asyncData`是在客户端执行的；location的形式则在服务端执行。同时，在接口需要携带cookie信息时，需要在接口请求时把当前的cookie信息传递到headers里，供服务端使用。当然，该方法允许你拿到请求头上的一些信息，如`req.headers.cookie`能拿到当前发送的请求中浏览器所携带的最新cookie信息。

``` js
async asyncData({ route, req, res, params, app, store, error }) {
  // route.query 能拿到url中query部分的信息
  // params.id 能拿到请求URL中所传递的参数值
  app.$cookiz.get("name");// 从cookie中获取用户名
  const domainInfo = {
    path: "/",
    domain: "baidu.com",
    maxAge: 60 * 60 * 24 * 7
  };
  app.$cookiz.set("name", "三树", domainInfo);// 设置用户名
  // 以下是store.dispatch用法示例
  await store.dispatch("modules/moduleA/setUserInfo", {
    data: { id },
    headers: {
      Cookie: req.headers.cookie + ";"
    }
  });
  return store.dispatch("modules/moduleA/setFloorData", {
    data: { id },
    headers: {
      Cookie: req.headers.cookie + ";"
    }
  }).then(res => {
    // SUCCESS TODO
  }).catch(e => {
    // FAILED TODO
  });
}
```

### vuex状态树
对于每个大项目来说，使用状态树 (store) 管理状态 (state) 十分有必要。可能是为了体现Nuxt开箱即用的特点，它的内核已经实现了Vuex，因此不用在`package.json`单独安装了。同时，它默认将每个模块按命名空间的方式去实现，每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割。为了方便大家查阅资料，在此补充下[Vuex的Module概念](https://vuex.vuejs.org/zh/guide/modules.html)，如果想看示例源码，可以直接移步至一个具有CURD功能的示例项目[vuex-admin-demo](https://github.com/james9527/vuex-admin-demo)。
前面说到Nuxt内部集成了vuex，并且默认是以命名空间模式导出，因此写法相对来说更简单了，下面给出一些示例：

定义 store/modules/moduleA.js：
```js
const state = () => ({
  userInfo: {}
});

const mutations = {
  SET_USER_INFO: (state, payload) {
    state.userInfo = payload;
  }
}

const actions = {
  async setUserInfo({commit, state}, payload) {
    const res = await fetchUserInfo(payload);
    // ...
    commit('SET_USER_INFO', res);
  }
}

export default = {
  state,
  mutations,
  actions
}
```

导出 store/index.js：
```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import moduleA from "./modules/moduleA";

export function createStore() {
  return new Vuex.Store({
    moduleA
  })
}
```

使用时，可借助createNamespacedHelpers，让引用state/actions时代码更简洁。
```js
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('modules/moduleA')

export default {
  computed: {
    // 在modules/moduleA中查找
    ...mapState({
      userInfo: state => state. userInfo
    })
  },
  methods: {
    // 在modules/moduleA中查找
    ...mapActions(['setUserInfo'])
  }
}
```

### nuxt.config.js的一些实用性配置
> 关于nuxt.config的一些实用性配置，本篇文章只讲开发阶段的一些实用性配置，涉及webpack和性能调优这些内容，安排到了下一章节，敬请期待~🤗

#### 定义环境变量
先看下package.json配置的执行环境：

```js
"scripts": {
  "build:test": "cross-env EXE_ENV=test nuxt build",
  "build:pre": "cross-env EXE_ENV=pre nuxt build",
  "build": "cross-env EXE_ENV=prod nuxt build"
}
```
然后回到nuxt.config配置文件下build这一配置项，利用webpack.DefinePlugin去配置的全局常量，其值为编译时的环境变量`process.env.EXE_ENV`，这样就方便了其它地方获取执行环境。

```js
build: {
  plugins: [
    new webpack.DefinePlugin({
      'envConfig': JSON.stringify({
        exeEnv: process.env.EXE_ENV,
        host: 127.0.0.1,
        port: 80
      })
    })
  ]
}
```

#### 解决跨域问题
用于Nuxt.js的http-proxy中间件解决方案，可以实现本地跨域请求。
`npm i @nuxtjs/proxy -D`
在 nuxt.config.js 配置文件中添加对应的模块，并设置代理：

```js
modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  axios: {
    proxy: true
  },
  proxy: {
    '/api': {
      target: 'http://example.com',
      pathRewrite: {
        '^/api' : '/'
      }
    }
  }
```

#### 修改页面标题
> 使用 head 方法设置当前页面的头部标签。原理：Nuxt.js 使用了 [vue-meta](https://github.com/nuxt/vue-meta) 更新应用的 头部标签(Head) 和 html 属性。在 head 方法里可通过 this 关键字来获取组件的数据，你可以利用页面组件的数据来设置个性化的 meta 标签。

```js
module.exports = {
  mode: 'universal',
  head: {
    title: '我是页面通用title',
    meta: [
      { charset: 'utf-8' },
    ]
  }
}
```

```js
// 业务代码里动态设置页面标题，实现自定义页面title
export default {
  head() {
    const obj = this.userInfo;
    const userName = obj.userName ? obj.userName : "";
    return {
      title: `${userName}的小店`
    };
  },
}
```

#### 引入前置脚本
假如你的项目需要引入一些像JSBridge、SDK之类的脚本，而这些脚本是需要确保它的加载顺序，即需确保在业务代码之前引入并执行，否则就失效了。这时，同样可以借助 head 方法去引入，可以说它与html标签里的head头的结构是一样的，所以它还可以有script属性值，用法如下所示：

```js
module.exports = {
  mode: 'universal',
  head: {
    script: [
      {
        src: "../js/flexible.min.js",
        type: 'text/javascript', 
        charset: 'utf-8'
      },
      {
        src: "../js/public/JSBridge.min.js",
        type: 'text/javascript',
        defer: "defer",
        charset: 'utf-8'
      },
      {
        src: "https://res.wx.qq.com/open/js/jweixin-1.3.2.js",
        type: 'text/javascript',
        defer: "defer",
        charset: 'utf-8'
      }
    ]
  }
}
```

#### 配置swiper插件
假如你用到了vue-awesome-swiper这个插件。首先，在根目录下创建plugins文件夹（即与文件nuxt.config.js同级），创建vue-awesome-swiper.js，引入专为ssr打造的脚本

```js
## plugins/vue-awesome-swiper.js ##
import Vue from 'vue'
import 'swiper/dist/css/swiper.min.css'
import VueAwesomeSwiper from 'vue-awesome-swiper/dist/ssr'
 
Vue.use(VueAwesomeSwiper)
```

然后，在plugins这一项需配置不走ssr渲染：

```js
plugins: [
  { 
    src: "@/plugins/vue-awesome-swiper",
    ssr: false
  }
]
```

#### 配置vConsole插件
在plugins文件夹创建vconsole.js，然后根据上面配置的全局环境变量去判断是否需要创建vConsole实例：

```js
## plugins/vconsole.js ##
import VConsole from 'vconsole'
const vConsole = envConfig.exeEnv !== 'prod' ? new VConsole() : null;

export default vConsole;
```

vConsole插件想要在nuxt下使用，也需要配置不走ssr渲染：

```js
plugins: [
  {
    src: "@/plugins/vconsole",
    ssr: false
  }
]
```

## 小结
至此，我们大概过了一遍Nuxt的主要核心特性，以及开发过程中记录的填坑笔记。

### 引用
+ [Nuxt.js官方API](https://www.nuxtjs.cn/api)
