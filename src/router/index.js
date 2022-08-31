import { createRouter, createWebHistory } from 'vue-router'
import { submitTrigger } from "@/api/trigger";

const routes = [
  {
    path: '/',
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

// 需要上报停留时间的组件name
let pageName = ['fundchart'];
// 当前正在计算页面停留时间的组件name 最大长度为1
let queue = [];
let startTime = '';
let standingTime = 0;

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    // 判断是不是需要埋点的页面
    if (pageName.indexOf(to.name) !== -1) {
      queue.push(to.name);
      startTime = Date.now();
    }
    if (pageName.indexOf(from.name) !== -1) {
      // 计算停留时间
      standingTime = parseInt((Date.now() - startTime) / 1000);
      // 发送请求
      submitTrigger([{
        times: standingTime,
        event: 'stand',
        type: queue.pop()
      }])
      // 初始化数据
      standingTime = 0;
    }
    isLogin ? next() : next('/login');
  }
})

window.addEventListener('beforeunload', () => {
  if (queue) {
    submitTrigger([{
      times: parseInt((Date.now() - startTime) / 1000),
      event: 'stand',
      type: queue.pop(),
    }])
  }
});

export default router
