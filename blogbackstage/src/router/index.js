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
    path: '/home',
    redirect: '/welcome',
    component: home,
    children: [
      { //首页
        path: '/welcome',
        meta: {
          name: '主控制台',
          comp: 'welcome'
        },
        component: welcome
      },
      { //导航设置
        path: '/nav',
        meta: {
          name: '设置导航',
          comp: 'setNav'
        },
        component: nav
      },
      { //设置个人信息
        path: '/mineInfo',
        meta: {
          name: '设置个人信息',
          comp: 'mineInfo'
        },
        component: mineInfo
      },
      { //quillEditor
        path: '/quillEditor',
        meta: {
          name: '富文本编辑器',
          comp: 'quillEditor'
        },
        component: quillEditor
      },
      { //文章分类管理
        path: '/articleManager',
        meta: {
          name: '文章管理',
          comp: 'articleManager'
        },
        component: articleManager
      },
      {//留言管理
        path: "/mail",
        meta: {
          name: '留言管理',
          comp: 'mail'
        },
        component: mail
      },
      { //修改密码
        path: '/updatePass',
        meta: {
          name: '修改密码',
          comp: 'homeUpdatePass'
        },
        component: homeUpdatePass
      },
      {
        path: '/profile',
        meta: {
          name: '个人档案',
          comp: 'profile'
        },
        component: profile
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
