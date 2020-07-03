import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//兼容IE10+
import "babel-polyfill"

import axiosUtil from "./network/axiosUtil";

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(NProgress)

//全局进度条配置
NProgress.configure({
  showSpinner: true,
  parent: 'body',
  easing: 'ease',
  speed: '500'
})

//全局
Vue.prototype.$request = axiosUtil

//全局过滤器 格式化时间戳
Vue.filter('dataFormat', function (value, fmt) {
  let getDate = new Date(value);
  let o = {
    'M+': getDate.getMonth() + 1,
    'd+': getDate.getDate(),
    'h+': getDate.getHours(),
    'm+': getDate.getMinutes(),
    's+': getDate.getSeconds(),
    'q+': Math.floor((getDate.getMonth() + 3) / 3),
    'S': getDate.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt;
});

/*
* 全局前置路由 在路由进入前start进度条
* */
router.beforeEach((to, from ,next) => {
  NProgress.start()
  next()
})

/*
* 全局后置路由 在路由完成时done进度条
* */
router.afterEach( () => {
  NProgress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

