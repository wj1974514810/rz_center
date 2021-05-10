import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 自定义指令
// 第一种
// Vue.directive('imgerr', {
//   inserted(dom, options) {
//     dom.onerror = function() {
//       dom.src = options.value
//     }
//   }
// })

// 第二种  封装在一个指令文件里面  然后引进来
import { imgerr } from '@/directive'
Vue.directive('imgerr', imgerr)

// 来自 components 里面的index.js文件
import myComponents from '@/components'
Vue.use(myComponents)

// 过滤器的注册
// 过滤器  只有一种的话  注册方式1
// import { formateTime } from '@/filter/index'
// Vue.filter('formateTime', formateTime)

// 过滤器如果有很多的话，注册方式2
import * as filters from '@/filter'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
