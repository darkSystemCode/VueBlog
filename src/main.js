import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {request_get, request_post} from './network/axiosUtil'

Vue.prototype.$requestGET = request_get
Vue.prototype.$requestPOST = request_post

Vue.config.productionTip = false
Vue.use(ElementUI, NProgress)

//全局进度条配置
NProgress.configure({
  showSpinner: true,
  parent: 'body',
  easing: 'ease',
  speed: '500'
})

/*
* 全局前置路由 在路由进入前start进度条
* */
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

/*
* 全局后置路由 在路由完成时done进度条
* */
router.afterEach(() => {
  NProgress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

