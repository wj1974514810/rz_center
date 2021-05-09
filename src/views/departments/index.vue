<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <Trees :tree-nod="componey" :is-root="true" @addDepart="addDepart" />
        <hr>
        <el-tree :expand-on-click-node="false" default-expand-all :data="departs" :props="{label:'name'}">
          <template #default="scoped">
            <Trees_tools
              :tree-nod="scoped.data"
              :is-root="false"
              @delDepartment="getDepartments"
              @addDepart="addDepart"
              @editDepartment="editDepartment"
            />
          </template>
        </el-tree>
        <!-- ref="addDept" 拿到子组件的表单el-form 这个组件-->
      </el-card>
      <AddDepartment ref="addDept" :tree-node="treeNode" :show-dialog.sync="showDialog" @addDepart="getDepartments" />
    </div>
  </div>
</template>

<script>
import Trees_tools from './components/tree-tools'
import AddDepartment from './components/addDepartment'
import { getDepartments } from '@/api/departments'
import { listTreeData } from '@/utils/index'
export default {
  components: { Trees_tools, AddDepartment },
  data() {
    return {
      // 弹出框的显示
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
      // console.log(res)
      this.departs = listTreeData(res.depts, '')
      // console.log(this.departs)
    },
    // 子组件传过来  接收
    addDepart(treeNode) {
      this.showDialog = true
      this.treeNode = treeNode
    },
    // 子组件传过来接收
    editDepartment(treeNode) {
      // 单击修改部门时打开弹出框
      this.showDialog = true
      // 把修改的数据回显
      this.treeNode = treeNode
      // 上面ref拿到了子组件的表单组件，然后调用子组件修改部门信息的方法，传入id  渲染到修改打开的弹出框里
      // 会出现id对应的部门的数据
      this.$refs.addDept.getDepartmentDetail(treeNode.id)
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
