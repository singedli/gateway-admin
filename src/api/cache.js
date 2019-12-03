import request from '@/utils/request'

export function getList(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/cache/config/all',
    method: 'post',
    data: params
  })
}
