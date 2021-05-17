<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <!-- 添加第一层的权限，传入1  顶级是0 因为它是第一层 -->
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </template>
      </page-tools>
      <el-card>
        <!-- 表格 -->
        <el-table border :data="list" row-key="id" :default-expand-all="true">
          <el-table-column label="名称" prop="name" />
          <el-table-column align="center" label="标识" prop="code" />
          <el-table-column align="center" label="描述" prop="description" />
          <el-table-column align="center" label="操作">
            <template slot-scope="{row}">
              <el-button v-if="row.type===1" type="text" @click="addPermission(2,row.id)">添加</el-button>
              <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermission(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述" prop="desctiption">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, delPermission, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
import { listTreeData } from '@/utils'
export default {
  data() {
    return {
      showDialog: false,
      list: [],
      formData: {
        name: '',
        code: '',
        description: '',
        enVisible: '1',
        pid: '',
        type: ''
      },
      rules: {
        name: [
          { required: true, tigger: 'blur', message: '此项不能为空' }
        ],
        code: [
          { required: true, tigger: 'blur', message: '此项不能为空' }
        ],
        description: [
          { required: true, tigger: 'blur', message: '此项不能为空' }
        ],
        enVisible: [
          { required: true, tigger: 'blur', message: '此项不能为空' }
        ]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    // 进页面就展示数据
    async getPermissionList() {
      this.list = listTreeData(await getPermissionList(), '0')
      console.log(this.list)
    },
    // 删除
    async delPermission(id) {
      await this.$confirm('是否确认删除')
      await delPermission(id)
      this.$message.success('删除成功')
      this.getPermissionList()
    },
    btnCancel() {
      // 清空表单数据
      this.formData = {
        name: '',
        code: '',
        description: '',
        enVisible: '1',

        pid: '',
        type: ''
      }
      // 清理校验
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    async btnOK() {
      // 表单校验
      await this.$refs.perForm.validate()
      // 发请求
      if (this.formData.id) {
        // 编辑
        await updatePermission(this.formData)
      } else {
        // 新增
        await addPermission(this.formData)
      }
      // 提示用户
      this.$message.success('操作成功')
      // 刷新页面
      this.getPermissionList()
      // 关闭弹窗
      this.showDialog = false
    },

    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    // 编辑弹窗出现 数据回显
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
