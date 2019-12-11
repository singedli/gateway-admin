import request from '@/utils/request'

//分页查询
export function getList(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/backon/getPage',
    method: 'post',
    data: params
  })
}


//根据id修改
export function updateBackon(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/backon/modifyById',
    method: 'post',
    data: params
  })
}


//添加
export function createBackon(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/backon/add',
    method: 'post',
    data: params
  })
}

//根据id删除
export function deleteById(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/backon/deleteByIds',
    method: 'post',
    data: params
  })
}
