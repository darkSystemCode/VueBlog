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
    meta: {
      title: '注册页面'
    },
    component: register
  },
  {
    path: '/login',
    meta: {
      title: '登录页面'
    },
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
        meta: {
          title: '首页'
        },
        component: welcome
      },
      { //导航设置
        path: '/nav',
        meta: {
          title: '设置导航'
        },
        component: nav
      },
      { //设置个人信息
        path: '/mineInfo',
        meta: {
          title: '设置个人信息'
        },
        component: mineInfo
      },
      { //quillEditor
        path: '/quillEditor',
        meta: {
          title: '编辑文章（富文本）'
        },
        component: quillEditor
      },
      { //文章分类管理
        path: '/articleManager',
        meta: {
          title: '文章分类管理'
        },
        component: articleManager
      },
      {//留言管理
        path: "/mail",
        meta: {
          title: '留言管理'
        },
        component: mail
      },
      { //修改密码
        path: '/updatePass',
        meta: {
          title: '修改密码'
        },
        component: homeUpdatePass
      },
      {
        path: '/profile',
        meta: {
          title: '个人信息'
        },
        component: profile
      },
      {
        path: '/slider',
        meta: {
          title: '滑块'
        },
        component: slider
      },
      {
        path: '/uploadFile',
        meta: {
          title: '文件上传'
        },
        component: uploadFile
      },
      {
        path: '/cardList',
        meta: {
          title: '卡片列表'
        },
        component: () => import('../views/base/CardList')
      },
      {
        path: '/waterfall',
        meta: {
          title: '图片瀑布流'
        },
        component: () => import('../views/base/WaterFall')
      },
      {
        path: '/steps',
        meta: {
          title: '步骤流程条'
        },
        component: () => import('../views/base/Steps')
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
  document.title = to.meta.title
  if (to.matched.length === 0) {
    next('/404')
  }
  //校验是否登录，防止不登录，直接进入其他页面
  if ((to.path == '/login' && from.path === '/') || (to.path == '/welcome' && from.path === '/login')) {
    next()
  } else {
    if (sessionStorage.getItem('profile') === null) {
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
