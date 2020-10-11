import navs from './getNavs'

async function getNav() {
  const nav = await navs()
  let getRoutes = function () {
    //自动生成路由配置
    return TestItems(nav.data.nav)
  }

  function TestItems(item) {
    let my_routes = new Array()
    for (let i in item) {
      if (item[i].child) {
        for (let com of item[i].child) {
          if (com.path == "/NotPath_404") continue
          let object = new Object()
          let meta = new Object()
          meta.title = com.title
          //生成path
          object.path = com.path
          //生成meta 用作title
          object.meta = meta
          //生成component
          const componentFun = import(`../views/base${com.path}`)
          object.component = () => componentFun
          object.component().then(res => {
            //在meta中添加一个激活状态activation 用于判断当前组件是否激活（可用于判断是否跳转404页面）
            meta.activation = true
          }).catch(err => {
            //清空path
            object.path = ''
            object.component = ''
            meta.title = ''
            meta.activation = false
            console.error(err)
          })
          my_routes.push(object)
        }
      } else {
        let object = new Object()
        let meta = new Object()
        meta.title = item[i].title
        //生成path
        object.path = item[i].path
        //生成meta
        object.meta = meta
        // ../views/base/Welcome
        const componentFun = import(`../views/base${item[i].path}`)
        object.component = () => componentFun
        my_routes.push(object)
      }
    }
    return my_routes
  }

  return getRoutes()
}

export default getNav();
