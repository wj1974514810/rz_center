<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <Trees :tree-nod="componey" :is-root="true" @addDepart="addDepart" />
        <hr>
        <el-tree default-expand-all :data="departs" :props="defaultProps">
          <template #default="scoped">
            <Trees :tree-nod="scoped.data" :is-root="false" @delDepartment="getDepartments" @addDepart="addDepart" />
          </template>
        </el-tree>
      </el-card>
      <AddDepartment :tree-node="treeNode" :show-dialog="showDialog" />
    </div>
  </div>
</template>

<script>
import Trees from './components/tree-tools'
import AddDepartment from './components/addDepartment'
import { getDepartments } from '@/api/departments'
import { listTreeData } from '@/utils/index'
export default {
  components: { Trees, AddDepartment },
  data() {
    return {
      showDialog: false,
      componey: { name: '传智播客', manager: '负责人', id: '' },
      defaultProps: {
        label: 'name'
      },
      departs: [],
      treeNode: {}
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
      console.log(this.departs)
    },
    addDepart(treeNode) {
      this.showDialog = true
      this.treeNode = treeNode
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
