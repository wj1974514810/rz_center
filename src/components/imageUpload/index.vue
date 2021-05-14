<template>
  <div>
    <!--
      必填
      action 必填的图片上传地址, 后面要对接腾讯云, 只是放一个 # 敷衍一下
      list-type 决定文件列表的显示方式
      file-list 是管理上传文件的数组

      影响显示
      list-type 决定文件列表的显示方式
      :class 动态类名可以控制有图片时隐藏上传图标

      各个阶段的钩子
      on-preview 指定点击放大镜后的处理, 有了这个函数放大镜才会出现
      on-remove 删除后触发
      on-change 图片数据改变(添加)后触发
      http-request 替代了默认 action 上传行为,为后续腾讯云连接座准备
     -->
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="preview"
      :on-change="change"
      :on-remove="remove"
      :http-request="upload"
      :class="{disable:fileList.length>0}"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" :percentage="percentage" style="width:146px" :show-text="false" />
    <el-dialog :visible="showDialog" @close="showDialog=false">
      <el-row type="flex" justify="center">
        <img :src="previewURL" alt="">
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 引入腾讯云工具库
import COS from 'cos-js-sdk-v5'
// 创建一个密钥实例
const cos = new COS({
  // 密钥ID
  SecretId: 'AKIDyIN1TeYBYeSzGGzRbWAYfV4MN7amgJgl',
  // 密钥key
  SecretKey: 'pNfiUzECtJbcMp1wbz6xXGitoRnshEUT'
})
export default {
  data() {
    return {
      fileList: [
        {
          url: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=233301930,3031623456&fm=11&gp=0.jpg'
        }
      ],
      // 是否显示dialog
      showDialog: false,
      // 图片放大
      previewURL: '',
      // 进图条百分比
      percentage: 0,
      // 是否显示进度条
      showPercent: false
    }
  },
  methods: {
    // 点击图片放大
    preview(file) {
      console.log(file)
      this.showDialog = true
      this.previewURL = file.url
    },
    change(file, fileList) {
      // 删除图片的钩子
      // 根据文档有两个参数
      // 1. 被删除的文件本身
      // 2. 删除后最新的文件列表
      this.fileList = [...fileList]
    },
    remove(file, fileList) {
      // 跟 onRemove 一样
      // 饿了么会给我们回调当前最新的文件数组
      // 用来覆盖 原来的数据即可
      this.fileList = [...fileList]
    },
    beforeUpload(file) {
      // 1.校验图片类型
      // 显示进度条
      this.showPercent = true
      const acceptType = ['image/jpeg', 'image/png']
      console.log(file)
      if (!acceptType.includes(file.type)) {
        this.$message.warning('只接受jpeg、png的图片格式')
        return false
      }

      // 1.校验图片大小
      const maxSize = 200 * 1024
      if (file.size > maxSize) {
        this.$message.warning(`图片大小不能超过${maxSize / 1024}K`)
        return false
      }
    },
    upload(data) {
      // 拦截掉默认上传到 action 的动作
      // 后续应该连接腾讯云进行上传
      console.log(data)

      // 实例  上传对象
      cos.putObject({
        Bucket: '2021513-1305899726', /* 必须  腾讯云的储存桶*/
        Region: 'ap-guangzhou', /* 存储桶所在地域，必须字段 */
        Key: data.file.size + data.file.name, /* 必须 上传的图片大小与图片名   这样避免同样名字的图片覆盖，带上大小就不会了*/
        StorageClass: 'STANDARD', // 写死的不用管
        Body: data.file, // 上传文件对象
        onProgress: (progressData) => {
          // console.log(JSON.stringify(progressData))
          // 进度条实时刷新
          this.percentage = progressData.percent * 100
        }

        // 上传后的回调，不一定成功，有err就是失败
      }, (err, data) => {
        console.log(err || data)
        if (!err) {
          // 把图片地址传给fileList   status设为success
          this.fileList[0].url = 'http://' + data.Location
          this.fileList[0].status = 'success'
        }
        // 有的图片小，一下就100% 给个延时器
        setTimeout(() => {
          // 隐藏进度条
          this.showPercent = false
        }, 800)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// /deep/ .disable
::v-deep .disable {
  .el-upload--picture-card {
    display: none;
  }
}
//  ::v-deep .img{
//     // 让长条形的图片被裁剪，填满区域  ==cover
//     // 让长条形的图片上下左右被压缩，符合框的高度  但两边会有空白  ==contain
//      object-fit: contain;
//   }
</style>
