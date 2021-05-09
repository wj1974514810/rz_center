// 全局组件的注册 这样写的好处在于, 如果编写类似饿了么之类的组件库, 供别人使用, 你只需要维护自己的 install 方法, 别人引入使用, 只需要 Vue.use 即可, 侵入性更小
import PageTools from './PageToals'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
  }
}
