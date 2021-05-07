<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <Trees :tree-nod="componey" :is-root="true" />
        <hr>
        <el-tree default-expand-all :data="departs" :props="defaultProps">
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
import { getDepartments } from '@/api/departments'
import { listTreeData } from '@/utils/index'
export default {
  components: { Trees },
  data() {
    return {
      componey: { name: '传智播客', manager: '负责人' },
      defaultProps: {
        label: 'name'
      },
      departs: []
    }
  },
  // created与钩子函数是一样的，只不过钩子函数里可以操作DOM
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取部门列表
    async getDepartments() {
      const res = await getDepartments()
      console.log(res)
      this.departs = listTreeData(res.depts, '')
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
