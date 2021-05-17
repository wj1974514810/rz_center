// vuex的权限模块

import { asyncRoutes, constantRoutes } from '@/router'
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  // 这里创建一个变量
  // 储存我们自己筛选完毕的菜单
  // 供 sidebar 渲染
  // 替代默认routes 选项
  routes: []
}
const mutations = {
  // data可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, data) {
    // 下面这么写不对 不是语法不对 是业务不对
    // state.routes = [...state.routes, ...data]
    // 有一种情况  张三 登录 获取了动态路由 追加到路由上  李四登录 4个动态路由
    // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...data]
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus: ["settings","permissions"]
  // asyncRoutes是所有的动态路由
  filterRoutes(store, menus) {
    //   筛选出 动态路由中和menus中能够对上的路由
    const res = asyncRoutes.filter(route => menus.includes(route.name))
    // res就是当前用户所拥有的 动态路由的权限
    console.log(res)
    // 将动态路由提交给mutations
    store.commit('setRoutes', res)
    // 这里为什么还要return  state数据是用来显示左侧菜单用的  return  是给路由addRoutes用的
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
