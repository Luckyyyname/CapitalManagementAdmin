import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/Index.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'infoshow',
        name: 'infoshow',
        component: () => import('@/views/InfoShow.vue')
      },
      {
        path: 'fundlist',
        name: 'fundlist',
        component: () => import('@/views/FundList.vue')
      },
      {
        path: 'fundstatistics',
        name: 'fundstatistics',
        component: () => import('@/views/FundStatistics.vue')
      },
      {
        path: 'fundchart',
        name: 'fundchart',
        component: () => import('@/views/FundChart')
      },
    ],
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: '/404',
    component: () => import('@/views/404.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    isLogin ? next() : next('/login');
  }
})
export default router
