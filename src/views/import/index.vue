<template>
  <UploadExcel :on-success="upload" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    // excel 时间转换函数
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    },
    async upload({ header, results }) {
      // console.log('header', header)
      console.log('results', results)

      // 准备翻译字典
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // 定义一个空数组
      const arr = []

      // 循环results 这个数组 拿到每一个用户信息对象 进行遍历
      results.forEach(item => {
        // 定义一个空对象
        const userInfo = {}
        // 遍历每一个用户信息对象里面的key 也就是header
        Object.keys(item).forEach(key => {
          // console.log('key', key)
          // 把excel里面的日期转换成正常日期
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样, 才能入库
            return
          } else {
            // 把每一个原对象里面的key 通过字典转换成对应的英文 并放在一个新的对象userinfo里面
            userInfo[userRelations[key]] = item[key]
          }
        })
        // 把转换完的所有对象放在arr里面
        arr.push(userInfo)
      })
      await importEmployee(arr)
      this.$message.success('导入成功！')
      this.$router.back() // 回到上一页
    }
  }
}
</script>

<style>

</style>
