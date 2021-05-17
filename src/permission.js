// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })

import router from '@/router'
import store from '@/store'

// 路由守卫
router.beforeEach(async(to, from, next) => {
  const list = ['/login', '/404']
  //  如果有token
  if (store.getters.token) {
    //   是登录页  就去首页
    if (to.path === '/login') {
      next('/')
    } else {
      // 其他页面 放行
      if (!store.getters.userId) {
        // 如果 action return 了数据, 这边可以直接获取
        console.log('触发帅选')
        const res = await store.dispatch('user/getUserInfo')
        // store.state.user.userInfo.roles.menus
        // 这里是第一次进入页面(刷新)获取用户资料
        // 用户资料里面有权限列表可以用来做筛选
        // 将筛选的逻辑放入到 vuex 里面
        // 需要准备两个数据 1. 全部的动态路由列表 2. 当前用户的信息
        const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)
        // 除此之外，我们发现在页面刷新的时候，本来应该拥有权限的页面出现了404，这是因为404的匹配权限放在了静态路由，而动态路由在没有addRoutes之前，找不到对应的地址，就会显示404，所以我们需要将404放置到动态路由的最后
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])

        // 如果是添加的路由, 添加的时间点其实晚于匹配过程, 发现一片空白
        // 需要在当前的目的地路径中原地跳一次, 重新触发匹配过程才行
        next(to.path)
      } else {
        next()
      }
    }
  } else {
    // 没有token
    // includes 是一个数组的api方法
    // includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。
    // 如果是数组里的页面，放行
    if (list.includes(to.path)) {
      next()
    } else {
      // 又不是数组里的页面，就跳到登录页
      next('/login')
    }
  }
})
