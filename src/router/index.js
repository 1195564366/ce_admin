import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
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
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home'),
      meta: { title: '首页', icon: 'home' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [{
      path: 'index',
      name: 'index',
      component: () => import('@/views/user'),
      meta: { title: '用户管理', icon: 'user' }
    }]
  },

  {
    path: '/oudai',
    component: Layout,
    meta: { title: '欧代管理', icon: 'oudai' },
    redirect: '/oudai/shop',
    children: [{
      path: 'shop',
      name: 'shopList',
      component: () => import('@/views/shopList'),
      meta: { title: '店铺管理', icon: 'shop' }
    }, {
      path: 'product',
      name: 'productList',
      component: () => import('@/views/productList'),
      meta: { title: '产品管理', icon: 'product' }
    }, {
      path: 'sendGoods',
      name: 'sendGoods',
      component: () => import('@/views/sendGoods'),
      meta: { title: '发货记录', icon: 'sendGood' }
    }, {
      path: 'order',
      name: 'order',
      component: () => import('@/views/order'),
      meta: { title: '账单管理', icon: 'order' }
    }]
  },

  {
    path: '/huishou',
    component: Layout,
    meta: { title: '回收管理', icon: 'huishou' },
    redirect: '/huishou/business',
    children: [{
      path: 'business',
      name: 'business',
      component: () => import('@/views/business'),
      meta: { title: '业务管理', icon: 'business' }
    }, {
      path: 'declare',
      name: 'declare',
      component: () => import('@/views/declare'),
      meta: { title: '申报记录', icon: 'order' }
    }]
  },

  // {
  //   path: '/shopList',
  //   component: Layout,
  //   redirect: '/shopList/index',
  //   children: [{
  //     path: 'index',
  //     name: 'shopList',
  //     component: () => import('@/views/shopList'),
  //     meta: { title: '店铺管理', icon: 'analysis' }
  //   }]
  // },

  // {
  //   path: '/productList',
  //   component: Layout,
  //   redirect: '/productList/index',
  //   children: [{
  //     path: 'index',
  //     name: 'index',
  //     component: () => import('@/views/productList'),
  //     meta: { title: '产品管理', icon: 'analysis' }
  //   }]
  // },

  {
    path: '/reviewed',
    component: Layout,
    redirect: '/reviewed/shop',
    meta: { title: '审核中心', icon: 'reviewed' },
    children: [{
      path: 'shop',
      name: 'reviewedShop',
      component: () => import('@/views/reviewed/shop'),
      meta: { title: '店铺审核', icon: 'shop' }
    }, {
      path: 'certificate',
      name: 'reviewedCertificate',
      component: () => import('@/views/reviewed/certificate'),
      meta: { title: '证书审核', icon: 'certificate' }
    }, {
      path: 'product',
      name: 'reviewedProduct',
      component: () => import('@/views/reviewed/product'),
      meta: { title: '产品审核', icon: 'product' }
    }, {
      path: 'recover',
      name: 'reviewedRecover',
      component: () => import('@/views/reviewed/recover'),
      meta: { title: '回收审核', icon: 'huishou' }
    }, {
      path: 'declare',
      name: 'declareRecover',
      component: () => import('@/views/reviewed/declare'),
      meta: { title: '申报审核', icon: 'order' }
    }]
  },


  // {
  //   path: '/sendGoods',
  //   component: Layout,
  //   redirect: '/sendGoods/index',
  //   children: [{
  //     path: 'index',
  //     name: 'index',
  //     component: () => import('@/views/sendGoods'),
  //     meta: { title: '发货记录', icon: 'analysis' }
  //   }]
  // },

  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/index',
  //   children: [{
  //     path: 'index',
  //     name: 'index',
  //     component: () => import('@/views/order'),
  //     meta: { title: '账单管理', icon: 'analysis' }
  //   }]
  // },

  // {
  //   path: '/declare',
  //   component: Layout,
  //   redirect: '/declare/index',
  //   children: [{
  //     path: 'index',
  //     name: 'index',
  //     component: () => import('@/views/declare'),
  //     meta: { title: '申报记录', icon: 'analysis' }
  //   }]
  // },

  // {
  //   path: '/business',
  //   component: Layout,
  //   redirect: '/business/index',
  //   children: [{
  //     path: 'index',
  //     name: 'index',
  //     component: () => import('@/views/business'),
  //     meta: { title: '回收管理', icon: 'analysis' }
  //   }]
  // },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
