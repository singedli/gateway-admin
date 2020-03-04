import request from '@/utils/request'

export function getBackonInterfaceList(params) {
  return request({
    //baseURL: 'http://localhost:9000/gateway',
    url: '/backon/interface/all',
    method: 'post',
    data: params
  })
}

export function getBackonInterfaceDetail(params) {
  return request({
    //baseURL: 'http://localhost:9000/gateway',
    url: '/backon/interface/detail',
    method: 'post',
    data: params
  })
}

export function deleteBackonInterface(params) {
  return request({
    //baseURL: 'http://localhost:9000/gateway',
    url: '/backon/interface/delete',
    method: 'post',
    data: params
  })
}

export function deleteBackonInterfaceByIds(params) {
  return request({
    //baseURL: 'http://localhost:9000/gateway',
    url: '/backon/interface/delete/ids',
    method: 'post',
    data: params
  })
}

export function createBackonInterface(data) {
  return request({
    //baseURL: 'http://localhost:9000/gateway',
    url: '/backon/interface/create',
    method: 'post',
    data
  })
}

export function updateBackonInterface(params) {
  return request({
    //baseURL: 'http://localhost:9000/gateway',
    url: '/backon/interface/update',
    method: 'post',
    data: params
  })
}

export function getBackonInterfacesBySystem(params) {
  return request({
    //baseURL: 'http://localhost:9000/gateway',
    url: '/backon/interface/getBackonInterfacesBySystem',
    method: 'post',
    data: params
  })
}

export function getBackonInterfacesByUrl(params) {
  return request({
    //baseURL: 'http://localhost:9000/gateway',
    url: '/backon/interface/getBackonInterfacesByUrl',
    method: 'post',
    data: params
  })
}

