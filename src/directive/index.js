export const imgerr = {
  inserted(dom, options) {
    dom.onerror = function() {
      dom.src = options.value
    }
  }
}
