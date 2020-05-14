import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const welcome = () => import('../views/Welcome')
const nav = () => import('../views/SetNav')
const mineInfo = () => import('../views/MineInfo')
const quillEditor = () => import('../views/QuillEditor')
const articleManager = () => import('../views/ArticleManager')
const mail = () => import('../views/Mail')
const homeUpdatePass = () => import('../views/HomeUpdatePass')
const login = () => import('../views/Login')
const register = () => import('../views/Register')
const home = () => import('../components/Home')
const profile = () => import('../views/Profile')
const notPath = () => import('../views/error/NotPath_404')
const slider = () => import('../views/base/Slider')
const uploadFile = () => import('../views/base/UploadFile')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  { //注册页面
    path: '/register',
    component: register
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/404',
    component: notPath
  },
  {
    path: '/home',
    redirect: '/welcome',
    component: home,
    children: [
      { //首页
        path: '/welcome',
        component: welcome
      },
      { //导航设置
        path: '/nav',
        component: nav
      },
      { //设置个人信息
        path: '/mineInfo',
        component: mineInfo
      },
      { //quillEditor
        path: '/quillEditor',
        component: quillEditor
      },
      { //文章分类管理
        path: '/articleManager',
        component: articleManager
      },
      {//留言管理
        path: "/mail",
        component: mail
      },
      { //修改密码
        path: '/updatePass',
        component: homeUpdatePass
      },
      {
        path: '/profile',
        component: profile
      },
      {
        path: '/slider',
        component: slider
      },
      {
        path: '/uploadFile',
        component: uploadFile
      },
      {
        path: '/cardList',
        component: () => import('../views/base/CardList')
      },
      {
        path: '/waterfall',
        component: () => import('../views/base/WaterFall')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/*
* 全局前置路由
* */
router.beforeEach((to, from, next) => {
  if(to.matched.length === 0) {
    next('/404')
  }
  //校验是否登录，防止不登录，直接进入其他页面
  if((to.path == '/login' && from.path === '/') || (to.path == '/welcome' && from.path === '/login')) {
    next()
  } else {
    if(sessionStorage.getItem('profile') === null) {
      next('/login')
    } else {
      next()
    }
  }
})


//重写路由的push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

export default router
