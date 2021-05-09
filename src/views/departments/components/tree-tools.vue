  <!-- 插槽 -->
<template>
  <el-row type="flex" justify="space-between" align="middle" style="width:100%; height: 40px">
    <el-col>
      <span>{{ treeNod.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNod.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown>
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <!--编辑部门和删除部门只会在子节点上显示-->
              <el-dropdown-item @click.native="addDepart">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" @click.native="editDepartment">修改部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" @click.native="delDepartments">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNod: {
      type: Object,
      required: true
    },
    // 布尔值 控制父节点和子节点显示的部门数量
    isRoot: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    // 删除部门
    async delDepartments() {
      try {
        await this.$confirm('是否确认删除')
        // 调用删除部门的api  传入要删除的部门id
        await delDepartments(this.treeNod.id)
        this.$message.success('删除成功')
        this.$emit('delDepartment')
      } catch (error) {
        console.log(error)
      }
    },
    // 新增  子传父
    addDepart() {
      this.$emit('addDepart', this.treeNod)
    },
    // 修改  子传父
    editDepartment() {
      this.$emit('editDepartment', this.treeNod)
    }
  }
}
</script>

<style>

</style>

