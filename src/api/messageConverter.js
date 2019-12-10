import request from '@/utils/request'

export function getMessageConverterList(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/message/converter/all',
    method: 'post',
    data: params
  })
}

export function getMessageConverterDetail(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/message/converter/detail',
    method: 'post',
    data: params
  })
}

export function deleteMessageConverter(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/message/converter/delete',
    method: 'post',
    data: params
  })
}

export function deleteMessageConverterByIds(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/message/converter/delete/ids',
    method: 'post',
    data: params
  })
}

export function createMessageConverter(data) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/message/converter/create',
    method: 'post',
    data
  })
}

export function updateMessageConverter(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/message/converter/update',
    method: 'post',
    data: params
  })
}

