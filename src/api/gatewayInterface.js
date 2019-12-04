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

export function updateGatewayInterface(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/config/interface/update',
    method: 'post',
    data: params
  })
}

export function createGatewayInterface(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/config/interface/create',
    method: 'post',
    data: params
  })
}
