/*
* @desc
* path: '映射路由路径'，
* meta/title： '生成tabs标题和浏览器标题，如果没有配置则是undefined'
* component：'配置创建.vue组件的名字（必须一致）---默认路径全部是/views/base/文件夹下，如果配置到其他文件夹下则无效'
* */
const routes = [
  { //首页
    path: '/welcome',
    meta: {
      title: '首页'
    },
    component: 'Welcome'
  },
  { //导航设置
    path: '/nav',
    meta: {
      title: '设置导航'
    },
    component: 'SetNav'
  },
  { //设置个人信息
    path: '/mineInfo',
    meta: {
      title: '设置个人信息'
    },
    component: 'MineInfo'
  },
  { //文章分类管理
    path: '/articleManager',
    meta: {
      title: '文章分类管理'
    },
    component: 'ArticleManager'
  },
  {//留言管理
    path: "/mail",
    meta: {
      title: '留言管理'
    },
    component: 'Mail'
  },
  { //修改密码
    path: '/updatePass',
    meta: {
      title: '修改密码'
    },
    component: 'HomeUpdatePass'
  },
  {
    path: '/profile',
    meta: {
      title: '个人信息'
    },
    component: 'Profile'
  },
  {
    path: '/slider',
    meta: {
      title: '滑块'
    },
    component: 'Slider'
  },
  {
    path: '/uploadFile',
    meta: {
      title: '文件上传'
    },
    component: 'UploadFile'
  },
  {
    path: '/cardList',
    meta: {
      title: '卡片列表'
    },
    component: 'CardList'
  },
  {
    path: '/waterfall',
    meta: {
      title: '图片瀑布流'
    },
    component: 'WaterFall'
  },
  {
    path: '/steps',
    meta: {
      title: '步骤流程条'
    },
    component: 'Steps'
  }
]

export default routes;