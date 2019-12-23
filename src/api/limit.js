import request from '@/utils/request'

// 分页查询
export function getList(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/interfaceConfig/getPage',
    method: 'post',
    data: params
  })
}

// 根据id查询
export function findById(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/interfaceConfig/findById?id=' + params,
    method: 'post'
  })
}

// 根据id修改
export function updateInterfaceConfig(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/interfaceConfig/updateById',
    method: 'post',
    data: params
  })
}

// 添加
export function createInterfaceConfig(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/interfaceConfig/addOne',
    method: 'post',
    data: params
  })
}

// 根据id删除
export function deleteById(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/interfaceConfig/deleteByIds',
    method: 'post',
    data: params
  })
}
