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
          <el-button size="small" type="danger" @click="exportImport">导出</el-button>
          <el-button size="small" type="primary" @click="addEmploy">新增员工</el-button>
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
      <add_employee :show-dialog.sync="showDialog" />
    </div>
  </div>
</template>

<script>
import add_employee from './components/add-employee'
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import { formatDate } from '@/filter'
export default {
  components: { add_employee },
  data() {
    return {
      showDialog: false,
      employessList: [],
      page: {
        page: 1, // 当前页码
        size: 5,
        total: 0 // 总数
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    addEmploy() {
      this.showDialog = true
    },
    async exportImport() {
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      // console.log(export_json_to_excel)
      // 拿到员工列表的所有数据
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      // 字典
      const dict = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 把对象转换称数组  进行处理
      const userData = rows.map(user => {
        // 这里的user是一个个的对象
        return this.object2Arrayy(user, dict)
      })
      // 导出
      export_json_to_excel({
        // 拿到上面转换完后的中文
        header: Object.keys(dict),
        // 拿到转换完后的数组数据  （数组里套数组）
        data: userData
      })
    },
    //
    object2Arrayy(user, dict) {
      const newUser = []
      for (const key in dict) {
        // console.log(key)
        //  因为数据中的key是英文，想要导出的表头是中文的话，需要将中文和英文做对应
        const enkey = dict[key]
        // 定义变量
        let value
        if (enkey === 'timeOfEntry' || enkey === 'correctionTime') {
          value = new Date(formatDate(user[enkey]))
        } else if (enkey === 'formOfEmployment') {
          const obj = EmployeeEnum.hireType.find(obj => obj.id === user[enkey])
          value = obj ? obj.value : '未知'
        } else {
          value = user[enkey]
        }
        newUser.push(value)
      }
      return newUser
    },
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
      // + cellValue 强制转换成数值型  不然添加会出现未知
      const obj = EmployeeEnum.hireType.find(item => item.id === +cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmply(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.$message.success('删除成功')
        if (this.employessList.length === 1 && this.page.page > 1) {
          this.page.page--
        }
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>
