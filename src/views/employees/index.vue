<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- PageTools 自己注册的全局组件 -->
      <PageTools :show-before="true">
        <!-- 插槽 -->
        <!-- <template #before>共166条记录</template> -->
        <span slot="before">共{{ page.total }}记录</span>
        <template #after>
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
          <!-- <el-button size="small" type="danger" @click="delAll">删除</el-button> -->
        </template>
      </PageTools>
      <el-card>
        <el-table border :data="employessList">
          <el-table-column align="center" label="序号" sortable="">
            <template slot-scope="scope">{{ (page.page-1)*page.size + scope.$index+1 }}</template>
          </el-table-column>
          <el-table-column align="center" label="姓名" sortable="" prop="username" />
          <el-table-column align="center" label="工号" sortable="" prop="workNumber" />
          <el-table-column align="center" label="聘用形式" sortable :formatter="formatEmployment" prop="formOfEmployment" />
          <el-table-column align="center" label="部门" sortable="" prop="departmentName" />
          <el-table-column align="center" label="入职时间" sortable="" prop="timeOfEntry">
            <!-- |竖线是管道符号  用了全局过滤器 -->
            <template slot-scope="scope">{{ scope.row.timeOfEntry |formatDate }}</template>
          </el-table-column>
          <el-table-column align="center" label="账户状态" sortable="">
            <template slot-scope="scope">
              <!-- el-switch表示两种相互对立的状态间的切换，多用于触发「开/关」。 -->
              <el-switch :value="scope.row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" sortable="" width="280">
            <template slot-scope="{ row }">
              <el-button size="small" type="text">查看</el-button>
              <el-button size="small" type="text">转正</el-button>
              <el-button size="small" type="text">调岗</el-button>
              <el-button size="small" type="text">离职</el-button>
              <el-button size="small" type="text">角色</el-button>
              <el-button size="small" type="text" @click="delEmply(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="middle" style="height:60px">
          <el-pagination
            :current-page="page.page"
            layout="prev,pager,next"
            :total="page.total"
            :page-size="page.size"
            @current-change="changePgae"
          />
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
export default {
  data() {
    return {
      employessList: [],
      page: {
        page: 1, // 当前页码
        size: 60,
        total: 0 // 总数
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.employessList = rows
    },
    changePgae(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 聘用形式  格式化函数
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmply(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.$message.success('删除成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
    // delAll() {
    //   console.log(this.employessList)
    //   this.employessList.forEach(item => {
    //     this.delEmply(item.id)
    //     this.getEmployeeList()
    //   })
    // }
  }
}
</script>

<style>

</style>
