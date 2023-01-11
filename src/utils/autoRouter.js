import navs from './getNavs'

/**
 * 动态加载vueRouter 加载格式和官方的VueRouter一致，这里只是对VueRouter格式做定制化
 * @return Promise格式的VueRouter
 */
async function getNav() {
  let my_routes = new Array()
  const nav = await navs()
  let getRoutes = function () {
    //自动生成路由配置
    return TestItems(nav.data.nav)
  }

  function TestItems(item) {
    diy_routers(item)
    return my_routes
  }

  function diy_routers(item) {
    for (let i in item) {
      if (item[i].child) {
        for (let com of item[i].child) {
          //如果还存在子导航 则递归处理
          if(com.child) {
            diy_routers(com.child)
            continue
          }
          if (com.path == "/NotPath_404") continue
          // 通过当前组件的path（即nav.json配置的path）使用import导入组件 与平常导入组件用法一致
          // 因为webpack的import()使用静态编译，所以必须指定一个字符串前缀，全变量无法通过编译，所以文件只能在/views/文件夹下拓展
          const componentFun = import(`@/views${com.meta.prePath}${com.path}`)
          //使用懒加载方式注入组件
          com.component = () => componentFun
          com.component().then(res => {
            //在meta中添加一个激活状态activation 用于判断当前组件是否激活（可用于判断是否跳转404页面）
            com.activation = true
          }).catch(err => {
            //清空path
            com.path = ''
            com.component = ''
            com.title = ''
            com.activation = false
            console.error(err)
          })
          my_routes.push(com)
        }
      } else {
        const componentFun = import(`@/views${item[i].meta.prePath}${item[i].path}`)
        item[i].component = () => componentFun
        my_routes.push(item[i])
      }
    }
  }
  return getRoutes()
}
export default getNav();
