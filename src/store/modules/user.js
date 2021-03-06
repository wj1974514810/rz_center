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
    // ???????????????cookie   ?????????
    setToken(data)
    // ??????token
    state.token = data
  },
  removeToken(state) {
    state.token = null
    // ??????removeToken ??????cookie
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
      // ??????????????????
      const res = await login(data)
      console.log(res)
      // ??????token ???mutations  ??????token???
      // const token = res.data.data
      store.commit('setToken', res)
      // ???????????????
      setTimeStamp()
    } catch (error) {
      console.log('??????', error)
    }
  },
  async getUserInfo(store) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // ???????????????????????????????????????
    const baseRes = { ...baseInfo, ...res }
    store.commit('setUserInfo', baseRes)
    return baseRes
  },
  // actions ???????????????????????? ??????????????????????????????
  logout(store) {
    // ????????????mutation mutations????????????mutation
    store.commit('removeToken')
    store.commit('removeUserInfo')
    // ????????????
    resetRouter()
    // ????????????
    // ????????????  vuex???????????????????????????
    // ?????????permission????????????state??????
    // vuex??? user?????????  permission?????????
    // ???????????????????????????action  ??????????????? ????????????context???????????????
    // ????????? ?????? ????????????action
    // ???????????????????????????action ?????? ??? commit?????????????????? ?????????  { root: true } ??????????????????context?????????????????? ???????????????
    store.commit('/permission/filterRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

