import Vue from 'vue'
import VueRouter from 'vue-router'
import Routes from '../utils/autoRouter'

Vue.use(VueRouter)
//固定动态加载路由
const login = () => import('../views/base/Login')
const register = () => import('../views/base/Register')
const notPath = () => import('../views/base/NotPath_404')
const home = () => import('../components/Home')
/*
* routes的配置：
* 1.固定项路由直接配置在router/index.js的routes数组里面
* 2.配置自动项（后续无限添加的页面路由）配置在router/routes.js数组里面，自动加载路由并配置，详细说明在routes.js
* */
const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  { //注册页面
    path: '/Register',
    meta: {
      title: '注册页面',
      activation: true
    },
    component: register
  },
  {
    path: '/Login',
    meta: {
      title: '登录页面',
      activation: true
    },
    component: login
  },
  {
    path: '/Home',
    redirect: '/Welcome',
    component: home,
    children: []
  },
  {
    path: '/NotPath_404',
    meta: {
      title: '404页面',
      activation: true
    },
    component: notPath
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//动态添加路由routes
router.onReady(() => {
  Routes.then(res => {
    router.options.routes[3].children = res
    /*
    1.每次手动刷新页面时，vue的路由都会重新初始化，这时动态添加的路由将会失效，所以会重定向到404页面
    2.最后拼接404页面 避免刷新时 路由重新初始化时重定向到404页面
     */
    router.addRoutes(routes.concat([{
      path: '*',
      redirect: '/NotPath_404'
    }]))
    //异常打印
    router.onError(error => {
      console.log(error)
    })
  })
})
/*
* 全局前置路由
* */
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  //校验是否登录，防止不登录，直接进入其他页面
  if ((to.path == '/Login' && from.path === '/') || (to.path == '/Welcome' && from.path === '/Login')) {
    next()
  } else {
    next()
  }
})


//重写路由的push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

export default router
