import request from '@/utils/request'

export function memory() {
  return request({
    //baseURL: 'http://localhost:9000/gateway',
    url: '/echarts/memory',
    method: 'get'
  })
}

