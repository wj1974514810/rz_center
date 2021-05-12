<template>
  <el-dialog title="新增员工" :visible="showDialog" :before-close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmpoly" label-width="120px" :model="formData" :rules="rules">
      <el-form-item prop="username" label="姓名">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item prop="mobile" label="手机">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="timeOfEntry" label="入职时间">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item prop="formOfEmployment" label="聘用形式">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="workNumber" label="工号">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item prop="departmentName" label="部门">
        <!-- 这里数据用value来绑定，不用v-model  防止用户乱输入 -->
        <el-input :value="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <!--  default-expand-all自动展开 -->
        <!-- :props="{label:'name'}"  让树形里只显示name属性的值 -->
        <!-- node-click 节点被点击时的回调 点击后 把点击的值放入输入框里 -->
        <el-tree
          v-if="showTree"
          default-expand-all=""
          class="tree"
          :data="treeDate"
          :props="{label:'name'}"
          @node-click="selectDepartment"
        />
      </el-form-item>
      <el-form-item prop="correctionTime" label="转正时间">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { addEmployee } from '@/api/employees'
import { getDepartments } from '@/api/departments'
import { listTreeData } from '@/utils/index'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 聘用形式
      EmployeeEnum,
      // 树形 部门
      showTree: false,
      treeDate: [],
      //   表单字段
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      //   验证
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getDepartments() {
      const { depts } = await getDepartments()
      this.treeDate = listTreeData(depts, '')
      this.showTree = true
    },
    selectDepartment(data) {
      this.formData.departmentName = data.name
      this.showTree = false
    },
    //   取消
    btnCancel() {
      // 清空表单
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      //   清空校验
      this.$refs.addEmpoly.resetFields()
      //   this.$emit('update:showDialog', false)
      this.$parent.showDialog = false
    },
    async btnOk() {
      try {
        //   表单校验
        await this.$refs.addEmpoly.validate()
        // 发请求
        await addEmployee(this.formData)
        this.$message.success('操作成功！')
        // 调用父组件的方法
        this.$parent.getEmployeeList()
        // 添加完成之后清空表单  不然下次添加还有上一次添加的数据
        this.$refs.addEmpoly.resetFields()
        // this.$parent.showDialog = false
        this.$emit('update:showDialog', false)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
.tree{
    width: 80%;
    position: absolute;
    z-index: 9;
    height: 200px;
    border: 1px solid rgb(42, 174, 226);
    overflow:auto;
}
</style>
