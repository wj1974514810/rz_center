<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- PageTools 全局组件 -->
      <PageTools :show-before="true">
        <!-- 插槽 -->
        <template #before>111</template>
        <template #after>222</template>
      </PageTools>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
