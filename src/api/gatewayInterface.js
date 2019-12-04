import request from '@/utils/request'

export function getList(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/config/interface/all',
    method: 'post',
    data: params
  })
}

export function deleteById(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/config/interface/delete',
    method: 'post',
    data: params
  })
}
