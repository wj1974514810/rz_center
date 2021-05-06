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
              <el-dropdown-item v-if="!isRoot">添加部门</el-dropdown-item>
              <el-dropdown-item>修改部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
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
  }
}
</script>

<style>

</style>

