import request from '@/utils/request'

export function addServiceArrange(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/serviceArrange/addServiceArrangeBak',
    method: 'post',
    data: params
  })
}
