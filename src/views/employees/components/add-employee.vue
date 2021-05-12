<template>
  <el-dialog title="新增员工" :visible="showDialog">
    <el-form label-width="120px">
      <el-form-item label="姓名">
        <input type="text" placeholder="请输入姓名" style="width:50%;height:40px;text-indent: 2em;">
      </el-form-item>
      <el-form-item label="姓名">
        <input type="text" placeholder="请输入姓名" style="width:50%;height:40px;text-indent: 2em;">
      </el-form-item>
      <el-form-item label="姓名">
        <input type="text" placeholder="请输入姓名" style="width:50%;height:40px;text-indent: 2em;">
      </el-form-item>
      <el-form-item label="姓名">
        <input type="text" placeholder="请输入姓名" style="width:50%;height:40px;text-indent: 2em;">
      </el-form-item>
      <el-form-item label="姓名">
        <input type="text" placeholder="请输入姓名" style="width:50%;height:40px;text-indent: 2em;">
      </el-form-item>
      <el-form-item label="姓名">
        <input type="text" placeholder="请输入姓名" style="width:50%;height:40px;text-indent: 2em;">
      </el-form-item>
      <el-form-item label="姓名">
        <input type="text" placeholder="请输入姓名" style="width:50%;height:40px;text-indent: 2em;">
      </el-form-item>
      <el-row type="flex" justify="center">
        <template>
          <el-button type="primary">确定</el-button>
          <el-button>取消</el-button>
        </template>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>
