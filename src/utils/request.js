import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

const IsCheckTimeOut = () => {
  const currentTime = (new Date()).getTime()
  const timeStamp = getTimeStamp()
  const TimeOut = 1000 * 60 * 60
  return currentTime - timeStamp > TimeOut
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 如果有token 就带上 没有就不管
    if (store.getters.token) {
      if (IsCheckTimeOut()) {
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('token已超时'))
      } else {
        config.headers.Authorization = `Bearer ${store.getters.token}`
      }
    }
    return config
  }, err => {
    Message.error(err.message)
    return Promise.reject(err)
  }
)

//  响应拦截器
service.interceptors.response.use(res => {
  // 并非必须, 拦截器解构一层 res.data 方便发请求的时候直接使用 不用点点点
  const { data, success, message } = res.data
  // 响应一共分几种情况
  // 网络请求成功, 数据也成功
  if (success) {
    return data
  } else {
    // 网络请求成功, 数据失败
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, err => {
  // 如果token被用户手动更改，就会执行以下代码
  console.dir(err)
  if (err.response && err.response.data && err.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  //  一般的请求, 都有后续操作, 例如存放 token 跳转页面 等等
  // 如果在这个请求 promise 执行的时候, 想要强制拒绝 不再执行下面的逻辑 而是跳到user.js里面的 catch
  // 那么就返回一个 Promise.reject () 即可
  // 网络请求失败(浏览器报红色错误)
  Message.error(err.message)
  return Promise.reject(err)
})

export default service
