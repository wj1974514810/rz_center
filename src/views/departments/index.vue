<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <Trees :tree-nod="componey" :is-root="true" />
        <hr>
        <el-tree :data="departs" :props="defaultProps">
          <template #default="scoped">
            <Trees :tree-nod="scoped.data" :is-root="false" />
          </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import Trees from './components/tree-tools'
export default {
  components: { Trees },
  data() {
    return {
      componey: { name: '传智播客', manager: '负责人' },
      defaultProps: {
        label: 'name'
      },
      departs: [
        { name: '总裁办', children: [{ name: '董事会' }] },
        { name: '行政部' },
        { name: '人事部' }
      ]
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
