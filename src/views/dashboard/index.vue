<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <imageUpload />
    <canvas id="myCanvas" ref="myCode" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 二维码就是一个字符串的信息进行编码压缩的结果
// 我们会将这个二维码生成在一个 canvas 标签当中
// 使用方法
import Qrcode from 'qrcode'
export default {
  name: 'Dashboard',

  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // 生成二维码
    Qrcode.toCanvas(this.$refs.myCode, '666', {
      width: 200,
      color: {
        dark: '#335544'
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
