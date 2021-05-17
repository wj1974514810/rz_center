// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
import { setToken, getToken, removeToken, setTimeStamp } from '@/utils/auth'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, data) {
    // 数据存放在cookie   持久化
    setToken(data)
    // 改变token
    state.token = data
  },
  removeToken(state) {
    state.token = null
    // 调用removeToken 清除cookie
    removeToken()
  },
  setUserInfo(state, data) {
    state.userInfo = { ...data }
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(store, data) {
    try {
      // 调用登录接口
      const res = await login(data)
      console.log(res)
      // 拿到token 给mutations  更改token值
      // const token = res.data.data
      store.commit('setToken', res)
      // 存储时间戳
      setTimeStamp()
    } catch (error) {
      console.log('报错', error)
    }
  },
  async getUserInfo(store) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // 将两个接口返回对象结果合并
    const baseRes = { ...baseInfo, ...res }
    store.commit('setUserInfo', baseRes)
    return baseRes
  },
  // actions 里面可异步可同步 ，但异步必须放在里面
  logout(store) {
    // 调用两个mutation mutations里面的叫mutation
    store.commit('removeToken')
    store.commit('removeUserInfo')
    // 清除路由
    resetRouter()
    // 清除菜单
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
    store.commit('/permission/filterRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

