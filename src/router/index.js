import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/cache',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'cache',
        component: () => import('@/views/cache/index'),
        meta: { title: '缓存策略管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/messageConverter',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'messageConverter',
        component: () => import('@/views/messageConverter/index'),
        meta: { title: '报文转换配置管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/gatewayInterface',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'gatewayInterface',
        component: () => import('@/views/gatewayInterface/index'),
        meta: { title: '网关接口管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/backonInterface',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'backonInterface',
        component: () => import('@/views/backonInterface/index'),
        meta: { title: '后台接口管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/limit',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'limit',
        component: () => import('@/views/limit/index'),
        meta: { title: '限流策略管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/serviceArrange',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'serviceArrange',
        component: () => import('@/views/serviceArrange/index'),
        meta: { title: '服务编排', icon: 'form' }
      }
    ]
  },
  {
    path: '/jsonTree',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'jsonTree',
        component: () => import('@/views/jsonTree/index'),
        meta: { title: '树形json', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
