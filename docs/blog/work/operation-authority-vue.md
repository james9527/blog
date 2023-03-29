---
title: '左侧菜单和页面按钮权限实现逻辑'
sidebar: auto
collapsable: true
---

## 左侧菜单和页面按钮权限实现逻辑

### 左侧菜单权限控制

```js
// store/permission.js
import { routes, permissionRoutes } from '@router'
import $api from '@api'
import { Message } from 'element-ui'
import getLang from '@lib/getBrowserLang'
const Layout = () => import('@components/layout/index') 
// 从href中获取路由
const getRouteFromHref = (href) => {
  let domain = href.indexOf('://') >= 0 ? href.substring(href.indexOf('://') + 3) : href
  let router = ''
  if (domain.indexOf('?') > -1) {
    router = domain.substring(domain.indexOf('/'), domain.indexOf('?'))
  } else {
    router = domain.substring(domain.indexOf('/'))
  }
  return router
}

/**
 * route访问权限判断
 * route.show为true时，默认为可以访问，不与菜单树比较
 * @param  {Object}   route         单个路由对象
 * @param  {Array}    appMenuTree   菜单树
 * @param  {String}   parentPath    父级路由地址
 * @return {Boolean}                当前用户是否有权限访问该路由
 */
const hasPermission = (route, appMenuTree, parentPath) => {
  if (route.show === true) {
    return true
  }
  if (
    appMenuTree.some((app) => {
      // 排除按钮
      if (app.node.type !== 0) return false
      const path = !parentPath ? route.path : route.path ? parentPath + '/' + route.path : parentPath
      if (getRouteFromHref(app.node.uri).indexOf(path) > -1) {
        route.meta && (route.meta.title = getLang() === 'en' ? app.node.enName : app.node.cnName)
        return true
      }
      if (app.data && hasPermission(route, app.data, parentPath)) {
        return true
      }
      return false
    })
  ) {
    return true
  }
  return false
}

/**
 * router访问权限判断
 * @param  {Array}    routerList    路由数组
 * @param  {Array}    appMenuTree   菜单树
 * @param  {String}   parentPath    父级路由地址
 * @return {Array}                  当前用户可访问的路由数组
 */
const filterRouterList = (routerList, appMenuTree, parentPath) => {
  return routerList.filter((route) => {
    if (route.children && route.children.length > 0) {
      route.children = filterRouterList(
        route.children,
        appMenuTree,
        !parentPath ? route.path : route.path ? parentPath + '/' + route.path : parentPath
      )
    }
    if (hasPermission(route, appMenuTree, parentPath)) {
      return true
    }
    return false
  })
}

export const permission = {
  state: {
    hasGotRouters: false,
    routers: permissionRoutes,
    addRouters: [],
    menuData: [],
    buttons: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.hasGotRouters = true
      state.addRouters = routers.accessedRouters
      state.routers = permissionRoutes.concat(routers.accessedRouters)
      state.menuData = routers.menuData
      state.buttons = routers.buttons
    },
  },
  actions: {
    GenerateRoutes({ commit, state }, data) {
      return new Promise((resolve, reject) => {
        $api
          .getMenus({ appId: process.env.VUE_APP_MENU_ID })
          .then((response) => {
            if (response.code === 200) {
              // 过滤虚拟菜单
              let menuNodeList = []
              localStorage.setItem('menuNode', JSON.stringify(menuNodeList))
              const filterList = response.data.map((uv) => {
                let obj = {}
                obj.node = uv.node
                if (uv.data) {
                  const list = uv.data.filter((lv) => {
                    if (!lv.node.isVirtual) {
                      return lv
                    } else {
                      menuNodeList.push(lv)
                      localStorage.setItem('menuNode', JSON.stringify(menuNodeList))
                    }
                  })
                  obj.data = list
                } else {
                  obj.data = null
                }
                return obj
              })

              let buttons = []
              filterList.forEach((el) => {
                if (el.data) {
                  // 二级菜单排序
                  el.data.sort((n1, n2) => n1.node.priorityLevel - n2.node.priorityLevel)
                  el.data.forEach((item) => {
                    // 按钮
                    if (item.data) {
                      item.data.forEach((o) => buttons.push(o.node))
                    }
                  })
                }
              })
              // 一级菜单排序
              const menuData = filterList.sort((n1, n2) => n1.node.priorityLevel - n2.node.priorityLevel)

              function exchangeMenu(menuData, pageId, leafPageId, threeLevelMenu = false) {
                const temporaryMenu = menuData.find((menu) => menu.node.pageId === pageId)
                const temporaryChildMenu = temporaryMenu ? temporaryMenu.data.find((menu) => menu.node.pageId === leafPageId) : null
                if (temporaryChildMenu) {
                  if (threeLevelMenu) {
                    // 生成两个三级菜单
                    let List = [...whiteList, ...threeLevelMenu]
                    temporaryChildMenu.data = temporaryMenu.data.filter((item) => List.includes(item.node.pageId))
                    temporaryMenu.data = temporaryMenu.data.filter((item) => !List.includes(item.node.pageId))
                  } else {
                    temporaryChildMenu.data = temporaryMenu.data.filter((item) => whiteList.includes(item.node.pageId))
                    temporaryMenu.data = temporaryMenu.data.filter((item) => !whiteList.includes(item.node.pageId))
                  }
                }
              }
              exchangeMenu(menuData, 'community.activity', 'community.activity.audit')

              //结束
              const accessedRouters = filterRouterList(routes, menuData, '')
              accessedRouters.push({
                path: '*',
                redirect: '/errors/404',
              })

              // TODO  暂时添加满足功能，需要重新优化
              accessedRouters.push({
                path: '/platformManager',
                name: 'platformManager',
                component: Layout,
                meta: {
                  breadcrumb: [
                    {
                      title: '平台管理',
                    },
                  ],
                },
                children: [
                  {
                    path: 'userOperationLog/:id',
                    name: 'userOperationLog',
                    meta: {
                      breadcrumb: [
                        {
                          title: '平台管理',
                        },
                        {
                          title: 'IDP用户信息管理',
                          path: '/platformManager/userInfoManagement',
                        },
                        {
                          title: '用户信息操作日志',
                        },
                      ],
                      keepAlive: true,
                    },
                    component: () => import('@pages/userInfoManagement/userOperationLog'),
                  },
                ],
              })
              commit('SET_ROUTERS', { menuData, accessedRouters, buttons })
              if (data.router) {
                data.router.addRoutes(state.addRouters)
              }
              resolve()
            } else {
              Message({
                message: response.message,
                type: 'error',
              })
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
}

export default permission

```

### 页面按钮权限控制
用v-has指令去判断其值与接口admin-api/menu/tree 返回的code是否一致，控制按钮的显示/隐藏

```js
// src/main.js
import "babel-polyfill";
import Vue from "vue";
import App from "./App";
import router from "@router";
import Api from "@api";
import store from "./store";
import * as filters from "./filter";
import i18n from "@lib/i18n";
import moment from "moment";
import "element-ui/lib/theme-chalk/index.css";

import VueClipboard from "vue-clipboard2";
Vue.prototype.$api = Api;
Vue.prototype.$moment = moment;
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
Vue.config.productionTip = false;
// vue指令按钮权限
Vue.prototype.$_has = val => {
  for (let i = 0; i < store.getters.buttons.length; i++) {
    let item = store.getters.buttons[i];
    if (val === item.code) {
      return true;
    }
  }
  return false;
};
Vue.directive("has", {
  inserted: (el, binding, vnode) => {
    if (!Vue.prototype.$_has(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});
Vue.use(VueClipboard);
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
```

### 权限数据示例

![接口权限数据.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ec6286cc70148c993ded8eeb95f93fd~tplv-k3u1fbpfcp-watermark.image?)

### 权限按钮DOM示例

```html
<el-button v-has="'community.article.publish.export'" type="warning" icon="el-icon-download" @click="exportArt" plain>{{ $t('content.export') }}</el-button>
```