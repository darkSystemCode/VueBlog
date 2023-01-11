<template>
  <el-container>
    <!--左侧菜单栏-->
    <el-aside width="200px" class="aside"
              :class="{'aside-show': getCollapseState == false?true:false,
                      'aside-hide':getCollapseState == true?true:false}">
      <Aside v-if="showAside"></Aside>
    </el-aside>

    <el-container>
      <!--顶部头-->
      <el-header>
        <Header></Header>
      </el-header>

      <el-main style="padding: 0">
        <!--标题头-->
        <AsideTitle></AsideTitle>
        <!--内容区-->
        <keep-alive>
          <router-view :style="{padding: '0 20px', marginTop: '55px'}"></router-view>
        </keep-alive>
      </el-main>
      <!--尾部版权-->
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import Aside from "../views/layout/leftAside/Aside"
import Header from "../views/layout/rightMain/Header"
import GlbSetting from "./GlbSetting"
import AsideTitle from "../views/layout/rightMain/AsideTitle";
import Crumbs from "../views/layout/rightMain/Crumbs"
import Footer from "../views/layout/rightMain/Footer";
import {mapGetters} from 'vuex'
import Axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      showAside: false
    }
  },
  computed: {
    /*
    * 在VUEX中获得asideColor颜色值
    * */
    ...mapGetters({
      getCollapseState: 'header/CollapseState',
      getNavs: 'header/Navs',
      getAsideTitle: 'header/AsideTitle',
      getCount: 'header/Count'
    })
  },
  watch: {
    '$route': function (to) {
      this.createTabs(to.path)
    }
  },
  created() {
    //获得导航的json数据
    Axios({
      url: location.protocol + "/nav.json",
      method: "get"
    }).then(res => {
      let firstMenu = this.findFirst(res.data.nav)
      //把导航数据存入vuex中
      this.$store.commit('header/setNav', res.data)
      const exists = this.getAsideTitle.filter(item => {
        return item.path == firstMenu[1].path
      })
      if(exists.length <= 0) {
        this.$router.push({ path: firstMenu[1].path })
        this.$store.commit('header/setAside', firstMenu[1])
        this.$store.commit('header/setCrumbs', firstMenu[0])
      }
      this.showAside = true
    })
  },
  methods: {
    findFirst(data, child = false, parent = []) {
      let tempArray = Array()
      for(const item of data) {
        let res = child? parent: Array()
        if(!child && item.child != undefined) {
          res.push(item.meta.title)
        }
        if(item.meta.first) {
          res.push(item.meta.title)
          tempArray.push(res)
          item.meta.activeIndex = 0
          tempArray.push(item)
          return tempArray
        } else {
          if(item.child != undefined) {
            const rs = this.findFirst(item.child, true, res)
            if(rs != undefined) {
              return rs
            }
          }
        }
      }
    },
    /**
     * 动态添加标题标签函数
     * path：当前点击左侧导航的path
     * 1.首先会处理welcome（首页）页，welcome页已在vuex中初始化了，所以，当用户再次点击时，直接定位到首页即可
     * 2.如果不是首页，则会通过当前导航的path去和左侧导航数据比对，如果path相等存入vuex asideTitle
     * 3.如果vuex的asideTitle已有数据，再次点击时，只定位，不新增
     * 注意：vuex中的count（标题标签的增值变量，可以保证每次添加的标题标签不重复，作用于后面的标题标签定位），count每次进来都需要自增，保证唯一，默认为0
     * vuex中的asideTitle格式：
     *{
      path: '/Welcome',
      meta: {
        title: '主控制台',
        activeIndex: 0,
        close: false
      }
    }
     * */
    createTabs(path) {
      //得到当前点击的左侧导航的名字，存入vuex的header/asideTitle中
      let nav = this.getNavs.nav
      for (let i = 0; i < nav.length; i++) {
        this.recursionFun(path, nav[i])
      }
    },
    //抽离模块 用于递归
    recursionFun(path, data) {
      //判断是否存在子导航，如果存在则取子导航的名字，如果没有，则取当前的导航名字
      if (data.child) {
        for (let j = 0; j < data.child.length; j++) {
          //如果存在多层子导航 则使用递归处理
          if(data.child[j].child){
            this.recursionFun(path, data.child[j])
          }
          if (data.child[j].path === path) {
            const parentTitle = data.meta.title
            this.tabsVuex(path, parentTitle, data.child[j])
            return
          }
        }
      } else {
        if (data.path === path) {
          this.tabsVuex(path, '', data)
        }
      }
    },
    /**
     * @params
     *  path: 当前导航路径
     *  parentTile: 当前导航的父级名称，如果没有则为''
     *  data: 当前导航信息
     * @desc
     *  把当前导航存入vuex中，作为导航标题tabs的显示（即主页面的header标题显示）和面包屑的显示
     * */
    tabsVuex(path, parentTitle, data) {
      /*if (!this.getRoles(path, data)) {
        return
      }*/
      const currTitle = data.meta.title
      //判断vuex中是否已经存在当前标题，如果存在则定位到当前导航，否则添加入vuex中
      let result = this.getAsideTitle.filter(item => {
        return item.meta.title === data.meta.title
      })
      //添加导航标题tabs
      if (result.length == 0) {
        let count = this.getCount //获取当前已创建导航标题的最大下标（如果已打开三个页面则count为2）
        count++
        this.$store.commit('header/setCount', count)
        data.meta.activeIndex = count
        this.$store.commit('header/setAside', data)
        this.$store.commit('header/setActiveIndex', count) //当前活跃导航的下标
        //设置面包屑
        this.setCrumbs((parentTitle != null && parentTitle != '') ? parentTitle : currTitle,
            (parentTitle != null && parentTitle != '') ? currTitle : '')
      } else {
        // 定位到当前导航标题tabs
        if (data.path === path) {
          let result = this.getAsideTitle.filter(item => {
            return item.meta.title === data.meta.title
          })
          this.$store.commit('header/setActiveIndex', result[0].meta.activeIndex)
          this.setCrumbs((parentTitle != null && parentTitle != '') ? parentTitle : currTitle,
              (parentTitle != null && parentTitle != '') ? currTitle : '')
        }
      }
    },
    setCrumbs(pt, ct) {
      let crumbs = new Array()
      crumbs.push(pt, ct)
      this.$store.commit('header/setCrumbs', crumbs)
    },
    /**
     * @param path: 当前跳转的路由路径
     * menuNav: 左侧菜单栏数组
     * 获得登录授权 并处理当前页面是否满足当前用户权限 如果不满足则跳转到未授权页面 否则放行
     */
    getRoles(path, menuNav) {
      const roles = JSON.parse(window.sessionStorage.getItem("user")).user.roles
      if (path != "/Unauthorized" && typeof (menuNav.meta.authorized) == 'string') {
        if (menuNav.meta.authorized != roles) {
          this.$router.push({
            path: '/Unauthorized'
          })
          return false
        }
      }
      return true
    }
  },
  components: {
    Aside,
    Header,
    GlbSetting,
    AsideTitle,
    Crumbs,
    Footer
  }
}
</script>

<style scoped>
.el-aside {
  color: #333;
}

.aside-show {
  width: 200px;
  max-width: 200px;
  min-height: 400px;
  height: 100%;
}

.aside-hide {
  width: 64px;
  max-width: 64px;
  min-height: 400px;
  height: 100%;
}

.el-tabs--card > .el-tabs__header {
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 1000;
  opacity: 1;
  background-color: #FFFFFF;
  margin: 0;
  padding-right: 20px;
}

.el-row {
  margin-bottom: 15px;
}

.aside {
  position: sticky;
  left: 0;
  top: 0;
  height: 100vh;
  transition: all .5s ease;
  box-shadow: 0 0 3px 2px #000000;
  z-index: 15;
}

.aside::-webkit-scrollbar { /*隐藏滚动条*/
  display: none;
}

</style>