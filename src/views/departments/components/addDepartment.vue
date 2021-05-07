<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :visible="showDialog">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option v-for="value in EmployeeList" :key="value.id" :value="value.username" :label="value.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      required: true
    }
  },
  data() {
    //   验证规则  部门名称
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      const isReat = depts
      // 得到一个数组
        .filter(item => item.pid === this.treeNode.id)
        // 得到布尔值    false 表示无重复子部门   true表示有重复
        .some(item => item.name === value)

      isReat ? callback(new Error('部门名称不能重复')) : callback()
    }
    //   验证规则  部门编码
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      const isReat = depts
        .some(item => item.code === value && value)

      isReat ? callback(new Error('该编码已有部门使用')) : callback()
    }
    return {
      formData: {
        manager: '',
        name: '',
        introduce: '',
        code: ''
      },
      rules: {
        name: [
          { required: true, tigger: 'blur', message: '该项不能为空' },
          { max: 50, message: '不能超过50字符', tigger: 'blur' },
          { validator: checkNameRepeat, tigger: 'blur' }
        ],
        code: [
          { required: true, tigger: 'blur', message: '该项不能为空' },
          { max: 50, message: '不能超过50字符', tigger: 'blur' },
          { validator: checkCodeRepeat, tigger: 'blur' }
        ],
        manager: [
          { required: true, tigger: 'blur', message: '该项不能为空' }
        ],
        introduce: [
          { required: true, tigger: 'blur', message: '该项不能为空' },
          { max: 300, message: '不能超过300字符', tigger: 'blur' }
        ]
      },
      EmployeeList: []
    }
  },
  methods: {
    async getEmployeeSimple() {
      const res = await getEmployeeSimple()
      console.log(res)
      this.EmployeeList = res
    }
  }
}
</script>

<style>

</style>
