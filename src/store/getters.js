const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  // 用户头像
  staffPhoto: state => state.user.userInfo.staffPhoto,
  // 公司id
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes,
  roles: state => state.user.userInfo.roles
}
export default getters
