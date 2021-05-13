<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form ref="editInfo" label-width="120px" style="margin-left: 120px; margin-top:30px" :rules="rules" :model="formData">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="formData.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="formData.password2" style="width:300px" type="password2" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="savaNewInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情" />
          <el-tab-pane label="岗位信息" />
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
export default {
  data() {
    //   const editPassword= editPassword(){}
    return {
      userId: this.$route.params.id,
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          { required: true, tigger: 'blur', message: '该项不能为空' }
        ],
        password2: [
          { required: true, tigger: 'blur', message: '该项不能为空' },
          { tigger: 'blur', message: '密码为6~9位', min: 6, max: 9 }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.formData = await getUserDetailById(this.userId)
    },
    async savaNewInfo() {
      // 表单校验
      await this.$refs.editInfo.validate()
      // 打散两个字段， 后面的password 替换掉原来的possword2
      await saveUserDetailById({
        ...this.formData,
        password: this.formData.password2
      })
      this.$message.success('更新个人信息成功!')
    }
  }
}
</script>

<style>

</style>
