export const imgerr = {
  // 这里配置一些钩子函数
  // 这里的钩子,是指那些被使用当前指令的 dom 的声明周期
  inserted(dom, options) {
    dom.src = dom.src || options.value
    dom.onerror = function() {
      dom.src = options.value
    }
  },
  // 上一个 inserted 钩子是在dom插入页面是触发
  // 但是如同 表格翻页, 或者排序重新加载等情况
  // 有另外一个钩子 componentUpdated
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }

}
