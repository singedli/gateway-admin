import request from '@/utils/request'

export function getGatewayCacheList(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/cache/config/all',
    method: 'post',
    data: params
  })
}

export function getGatewayCacheDetail(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/cache/config/detail',
    method: 'post',
    data: params
  })
}

export function deleteGatewayCache(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/cache/config/delete',
    method: 'post',
    data: params
  })
}

export function deleteGatewayCacheByIds(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/cache/config/delete/ids',
    method: 'post',
    data: params
  })
}

export function createGatewayCache(data) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/cache/config/create',
    method: 'post',
    data
  })
}

export function updateGatewayCache(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/cache/config/update',
    method: 'post',
    data: params
  })
}

export function globalRefreshCache() {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/cache/refresh/global',
    method: 'post'
  })
}

export function apiRefreshCache(params) {
  return request({
    baseURL: 'http://localhost:9000/gateway',
    url: '/cache/refresh/api',
    method: 'post',
    data: params
  })
}

