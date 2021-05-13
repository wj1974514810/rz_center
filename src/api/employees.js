import request from '@/utils/request'

// 获取员工列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

//  获取员工的综合列表数据
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

//  批量导入员工
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

// 删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 新增员工
export function addEmployee(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

// 获取员工个人信息
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

// 保存员工修改信息
export function saveUserDetailById(data) {
  return request({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}
