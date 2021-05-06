import Cookies from 'js-cookie'

const TokenKey = 'hrsass-ihrm-token'
const timeKey = 'hrsass-timestamp-key'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取 / 设置 时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
export function setTimeStamp() {
  const data = new Date()
  return Cookies.set(timeKey, data.getTime())
}
