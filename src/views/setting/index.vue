<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="角色管理" name="first">
            <el-row style="height:60px">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="addRole">新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <!--type绑定角色管理的索引  pro 绑定角色索引的其他信息  -->
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 row能拿到你当前点击那一行的数据， row.id是你当前点击的那一行数据的id-->
                <template #default="{row}">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <!--
            current-page 当前页数
            current-change 改变时触发
          -->
              <el-pagination
                :current-page="page.page"
                layout="prev,pager,next,total"
                :total="page.total"
                :page-size="page.pagesize"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <!-- info 为默认值 表示提示信息  closable表示该提示信息不可被关闭  show-icon展示内置的感叹号图标-->
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" show-icon :closable="false" type="info" />
            <el-form label-width="120px" style="margin-top:50px">
              <!--disabled  该输入框的值不能被修改  -->
              <el-form-item label="公司名称">
                <el-input v-model="formDate.name" disabled style="width:480px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formDate.companyAddress" disabled style="width:480px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formDate.mailbox" disabled style="width:480px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formDate.remarks" disabled type="textarea" :rows="3" style="width:480px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog :title="titleText" :before-close="btnCancel" :visible="showDialog">
        <el-form v-if="showDialog" ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOk">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
        <!-- 权限是一颗树 -->
        <!-- 将数据绑定到组件上 -->
        <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
        <!-- id作为唯一标识 -->
        <!-- <el-tree
          :default-checked-keys="selectCheck"
        /> -->
        <!-- 这里并没有 v-model 的双向绑定
        无论设置绑定还是获取绑定数据, 都靠函数
        对象中的那个值作为记录的标识, 需要 node-key 进行设定 -->
        <el-tree
          ref="permTree"
          :data="permData"
          :props="{label: 'name'}"
          :default-expand-all="true"

          :show-checkbox="true"
          :check-strictly="true"
          node-key="id"
        />
        <!-- 确定 取消 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
            <el-button size="small" @click="btnPermCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getCompanyInfo, getRoleList, deleteRole, updateRole, addRole, getRoleDetail, assignPermission } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { listTreeData } from '@/utils'
// 引入辅助函数
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      showPermDialog: false,
      permData: [],
      userId: '',
      showDialog: false,
      activeName: 'first',
      // 公司信息
      formDate: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      // 角色列表
      list: [],
      // 角色管理分页
      page: {
        page: 1,
        pagesize: 2,
        total: 0
      },
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '该项不能为空', tigger: 'blur' }],
        description: [{ required: true, message: '该项不能为空', tigger: 'blur' }]
      }
    }
  },
  // 计算属性  组件绑定的辅助函数
  computed: {
    // 以前是 this.$store.getters.companyId
    // 引入辅助函数后是 this.companyId
    ...mapGetters(['companyId']),
    // 封装的标题函数，放在计算属性里
    // 计算属性跟函数的区别：计算属性有缓存，在这个地面的任何地方运行后，就不会再重新执行，而函数不行,以此来减少运行次数，如果数据变化，那么计算属性也会运行
    titleText() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }

  },
  created() {
    // 调用获取公司信息
    this.getCompanyInfo()
    this.getRoleList()
  },
  methods: {
    // 点击分配权限
  // 获取权限点数据 在点击的时候调用 获取权限点数据
    async assignPerm(id) {
      this.userId = id
      //  获取全部权限列表
      const list = await getPermissionList()
      console.log(list)
      // 转化list到树形数据
      this.permData = listTreeData(list, '0')
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getRoleDetail(id)
      console.log(permIds)

      this.showPermDialog = true
      this.$nextTick(() => {
        // 将当前角色所拥有的权限id赋值
        this.$refs.permTree.setCheckedKeys(permIds)
      })
    },
    btnPermCancel() {
      // 1. 清空数据
      this.$refs.permTree.setCheckedKeys([])
      this.showPermDialog = false
    },
    async btnPermOK() {
      // 发请求
      // 1. 拿到数据 2. 发送api请求
      const permIds = this.$refs.permTree.getCheckedKeys()
      const id = this.userId
      await assignPermission({
        id,
        permIds
      })
      this.$message.success('修改成功')
      this.showPermDialog = false
    },
    // 封装获取公司信息的方法
    async  getCompanyInfo() {
      this.formDate = await getCompanyInfo(this.companyId)
    },
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      // 总计
      this.page.total = total
      // 角色信息
      this.list = rows
      console.log(rows)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 改变分页数
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    // 删除
    async deleteRole(id) {
      try {
        await this.$confirm('确定删除该角色吗?')
        // 调用删除api
        await deleteRole(id)
        // 如果一个页面只有一个条数据 并且页数总数大于1  那么删除之后页数进行--操作
        if (this.list.length === 1 && this.page.page > 1) {
          this.page.page--
        }
        // 重新渲染数据
        this.getRoleList()
        this.$message.success('删除角色成功！')
      } catch (error) {
        console.log(error)
      }
    },
    // 增加
    addRole() {
      this.showDialog = true
      this.btnOk()
    },

    // 确认操作
    async btnOk() {
      // 表单验证
      await this.$refs.roleForm.validate()
      // 如果roleForm有id  就是编辑 没有就是新增
      if (this.roleForm.id) {
        // 编辑
        await updateRole(this.roleForm)
      } else {
        // 新增
        await addRole(this.roleForm)
      }
      // 重新渲染数据
      this.getRoleList()
      this.$message.success('操作成功！')
      this.showDialog = false
    },
    // 编辑
    async editRole(id) {
      // 调用获取角色详情的api 回显数据
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    // 取消
    btnCancel() {
      // 清空表单的所有数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 清空校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>
<style lang="less" scoped>

</style>
