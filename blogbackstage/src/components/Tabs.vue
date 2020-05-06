<template>
  <div>
    <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="tabClick" class="tabs-flex">
      <el-tab-pane v-for="item in tabsItem"
                   :key="item.name"
                   :label="item.title"
                   :name="item.name"
                   :closable="item.closable"
                   :ref="item.ref">
        <transition>
          <keep-alive>
            <component :is="item.content"></component>
          </keep-alive>
        </transition>
      </el-tab-pane>
    </el-tabs>
    <el-dropdown class="multi" trigger="hover" @command="handleEvent">
      <span><i class="el-icon-more"></i></span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="closeCurr">关闭当前页面</el-dropdown-item>
        <el-dropdown-item command="closeLeft">关闭左侧页面</el-dropdown-item>
        <el-dropdown-item command="closeRight">关闭右侧页面</el-dropdown-item>
        <el-dropdown-item command="closeOther">关闭其他页面</el-dropdown-item>
        <el-dropdown-item command="closeAll">关闭全部页面</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import welcome from '../views/Welcome'
  import setNav from '../views/SetNav'
  import mineInfo from '../views/MineInfo'
  import quillEditor from "../views/QuillEditor"
  import articleManager from "../views/ArticleManager"
  import mail from "../views/Mail"
  import homeUpdatePass from "../views/HomeUpdatePass"
  import profile from "../views/Profile"
  import { mapGetters} from 'vuex'

  export default {
    name: "Tabs",
    data() {
      return {
        activeTab: '1', //默认显示的tab
        tabIndex: 1, //tab目前显示数
        tabsItem: [],
        result: []
      }
    },
    computed: {
      ...mapGetters('header', {
        getNav: 'getNav',
        crumbs: 'crumbs'
      })
    },
    watch: {
      '$route': function (to) {

        //如果是点击主控制台，则重新定位到主控制台 activeTab = "1"
        if (to.path == "/welcome") {
          let welcome = this.tabsItem.filter( item => {
            return item.path == to.path
          })
          if(welcome) {
            this.activeTab = "1"
            this.showCrumbs(this.getNav)
          }
          return;
        }

        //监听路由的变化，动态生成tabs
        let flag = true //判断是否需要新增页面
        if (Object.keys(to.meta).length != 0) {
          for (let i = 0; i < this.$refs.tabs.length; i++) {
            if (i != 0) { //首页不判断 如果页面已存在，则直接定位当页面，否则新增tab页面
              if (this.$refs.tabs[i].label == to.meta.name) {
                this.activeTab = this.$refs.tabs[i].name  //定位到已打开页面
                flag = false
                break
              }
            }
          }
          //新增页面
          if (flag) {
            //获得路由元数据的name和组件名
            const thisName = to.meta.name
            const thisComp = to.meta.comp
            const thisPath = to.path
            //对tabs的当前激活下标和tabs数量进行自加
            let newActiveIndex = ++this.tabIndex + ''
            //动态双向追加tabs
            this.tabsItem.push({
              title: thisName,
              name: String(newActiveIndex),
              closable: true,
              ref: 'tabs',
              path: thisPath,
              content: thisComp
            })
            this.activeTab = newActiveIndex
          }
        }

        /*
        * 监听路由的变化，当且仅当路由发生变化时，会得到当前路由的信息（）和存储在vuex中的导航信息，
        * 然后，使用当前路由信息的title和存储在vuex中导航的child的childTitle做比较，如果相等则存入
        * vuex的crumbs做面包屑展示。
        * */
        this.showCrumbs(this.getNav)
      }
    },
    methods: {
      removeTab(targetName) { //删除Tab
        let tabs = this.tabsItem //当前显示的tab数组
        let activeName = this.activeTab //点前活跃的tab

        //如果当前tab正活跃 被删除时执行
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
                this.tabClick(nextTab)
              }
            }
          });
        }
        this.activeTab = activeName
        this.tabsItem = tabs.filter(tab => tab.name !== targetName)
      },
      tabClick(thisTab) {
        /*
        * thisTab:当前选中的tabs的实例
        * 通过当前选中tabs的实例获得当前实例的path 重新定位路由
        * */
        let val = this.tabsItem.filter(item => thisTab.name == item.name)
        this.$router.push({
          path: val[0].path
        })
      },
      handleEvent(command) {
        /*
        * 监听关闭页面功能
        * 1.关闭全部页面 closeAll
        * 2.关闭当前页面 closeCurr
        * 3.关闭左侧页面 closeLeft
        * 4.关闭右侧页面 closeRight
        * 5.关闭其他页面 closeOther
        * 使用filter（）函数 过滤不符合的结果返回， 并需要响应式改动tabsItem tabsPath
        * */
        if (command == "closeAll") {
          if (this.tabsItem.length > 1) {
            this.tabsItem = this.tabsItem.filter(item => item.name == "1")
            this.$router.push({
              path: this.tabsItem[0].path
            })
            this.activeTab = "1"
          }
        } else if (command == "closeCurr") {
          if (this.tabsItem.length > 1) {
            const currIndex = this.activeTab
            if (currIndex != "1") {
              //判断下一个活跃的tabs标签
              this.tabsItem.forEach((item, index) => {
                if (item.name === currIndex) {
                  let nextTab = this.tabsItem[index + 1] || this.tabsItem[index - 1]
                  if (nextTab) {
                    this.activeTab = nextTab.name
                    const nextPath = this.tabsItem.filter(item => item.name == nextTab.name)
                    this.$router.push({
                      path: nextPath[0].path
                    })
                  }
                }
              })
              this.tabsItem = this.tabsItem.filter(item => item.name !== currIndex)
            }
          }
        } else if (command == "closeLeft") {
          if (this.tabsItem.length > 1) {
            if (this.activeTab != "1") {
              this.tabsItem = this.tabsItem.filter(item => {
                return item.name == 1 || item.name >= this.activeTab
              })
            }
          }
        } else if (command == "closeRight") {
          if (this.tabsItem.length > 1) {
            if (this.activeTab != "1") {
              this.tabsItem = this.tabsItem.filter(item => {
                return item.name == 1 || item.name <= this.activeTab
              })
            }
          }
        } else if (command == "closeOther") {
          if (this.tabsItem.length > 1) {
            if (this.activeTab != "1") {
              this.tabsItem = this.tabsItem.filter(item => {
                return item.name == 1 || item.name == this.activeTab
              })
            }
          }
        }
      },
      /*
      * 对面包屑的封装
      *   nav: 左侧导航栏的数据
      * */
      showCrumbs(nav) {
        if (nav) {
          let vuexCrumbs = new Array()
          const currRouteName = this.$route.meta.name
          for (let i = 0; i < nav.length; i++) {
            //存在child
            if (nav[i].child) {
              //遍历当前项的子导航项
              for (let j = 0; j < nav[i].child.length; j++) {
                if (nav[i].child[j].title == currRouteName.toString()) {
                  //把当前选中的导航和其父导航存入vuex中，当做crumb显示
                  vuexCrumbs.push({
                    title: nav[i].title,
                    child: {
                      childTitle: nav[i].child[j].title
                    }
                  })
                  this.$store.commit('header/setCrumbs', vuexCrumbs)
                  return
                }
              }
            } else {
              vuexCrumbs.push({
                title: nav[i].title
              })
              this.$store.commit('header/setCrumbs', vuexCrumbs)
              return
            }
          }
        }
      }
    },
    created() {
      /*
      * 使用js的sessionStorage读取刷新前的数据，并按刷新前的tabs顺序重新生成tabs
      * param: tabsItem 存储在sessionStorage的key
      *         currTabsItem:tabsItem的标签页标题的key
      *         currTabsPath:tabsPath的标签页标题对应路径的key
      *         currActiveTabs：当前活跃的标签页标题下标
      *         currIndex:标签页的迭代数 避免标签下标重复
      * */
      if (sessionStorage.getItem("tabsItem")) { //第一次进来session为空 不处理
        const sessionTabs = JSON.parse(sessionStorage.getItem("tabsItem"))
        if (sessionTabs.currTabsItem != null) {
          //读取session的currTabsItem项数据存入tabsItem
          for (let i = 0; i < sessionTabs.currTabsItem.length; i++) {
            this.tabsItem.push({
              title: sessionTabs.currTabsItem[i].title,
              name: sessionTabs.currTabsItem[i].name,
              closable: sessionTabs.currTabsItem[i].closable,
              ref: sessionTabs.currTabsItem[i].ref,
              path: sessionTabs.currTabsItem[i].path,
              content: sessionTabs.currTabsItem[i].content
            })
          }
          this.$store.commit("header/setCrumbs", sessionTabs.currCrumb)
          //读取
          this.activeTab = sessionTabs.currActiveTabs
          this.tabIndex = sessionTabs.currIndex
          //避免强制修改url 出现浏览器的url输入框的路径和当前tabs选中的路由路径不匹配
          // const activePath = this.tabsPath.filter(item => item.name == this.activeTab)
          // this.$router.push({
          //   path: sessionTabs.currTabsItem[0].path
          // })
        }
      }

      /*
      * 因为首次进来，导航在这个页面未发生变化,所以当页面创建后，手动添加主控制台页面
      * */
      const currRoute = this.$route
      if (currRoute.path === "/welcome") {
        if (this.tabsItem.length == 0) {
          this.tabsItem.push({
            title: currRoute.meta.name,
            name: '1',
            closable: false,
            ref: 'tabs',
            path: currRoute.path,
            content: currRoute.meta.comp
          })
        }
      }

      /*
      * 这个组件总是优先于home组件运行，所以，使用setTimeout延迟0.2s调用该方法得到vuex存储的导航数据
      * */
      setTimeout(() => {
        this.showCrumbs(this.getNav)
      }, 200)

    },
    mounted() {
      /*
      * 监听页面刷新事件
      * 页面刷新前 需要保存当前打开的tabs的位置，刷新后按刷新前的顺序展示
      * 使用js的sessionStorage保存刷新页面前的数据
      * */
      window.addEventListener('beforeunload', e => {
        sessionStorage.setItem("tabsItem", JSON.stringify({
          currTabsItem: this.tabsItem, //.filter(item => item.name !== "1")
          currCrumb: this.crumbs,
          currActiveTabs: this.activeTab,
          currIndex: this.tabIndex
        }))
      });
    },
    components: {
      articleManager,
      welcome,
      setNav,
      mineInfo,
      quillEditor,
      mail,
      homeUpdatePass,
      profile
    }
  }
</script>

<style scoped>
  /*标签栏 多功能按钮*/
  .el-main .multi {
    position: fixed;
    top: 60px;
    right: 5px;
    z-index: 1100;
    border: 0;
    width: 20px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin: 0 auto;
    display: block;
    cursor: pointer;
    float: right
  }

  .el-main .multi i[class="el-icon-more"] {
    transform: rotate(90deg);
  }

  /*组件切换动画*/
  .v-enter {
    opacity: 0;
    transform: translateY(-100px);
  }

  .v-enter-active {
    transition: all 0.8s ease-in-out;
  }

</style>