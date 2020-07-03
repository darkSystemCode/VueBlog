<template>
  <div class="titleNavBox" :style="{width: (getCollapseState == false)?'calc(100% - 200px)':'calc(100% - 64px)'}">
    <div style="position: relative">
      <!--      <i v-if="isShow" leftIcon class="el-icon-d-arrow-left scroll" @click="toLeft"></i>-->
      <div class="titleNav" @click.right.prevent="mouseRight">
        <div v-for="(item, index) in getAsideTitle"
             :key="index"
             ref="tag"
             :active-index="item.activeIndex"
             :class="{title: true, active: (active === item.activeIndex)?true:false}"
             :closable="(item.title == '主控制台')? false : true"
             @click="toUrl(item.path, item.activeIndex)"
             @mouseover="titleMouseover(index, item.activeIndex)"
             @mouseleave="titleMouseleave(index, item.activeIndex)">
          {{item.title}}
          <!--使用stop修饰符，避免事件继续向上传播-->
          <i class="el-icon-close titleClose"
             v-if="item.isClose"
             :ref="'close'+index"
             :style="{width: (item.activeIndex == active)? '14px':'0'}"
             @click.stop="closeTag(item.title, item.activeIndex)">
          </i>
        </div>
      </div>
      <!--      <i v-if="isShow" rightIcon class="el-icon-d-arrow-right scroll" @click="toRight"></i>-->
      <component v-if="mouseR" is="RightFun" :clientX="clientX" :clientY="clientY" @close-r="closeRightF"></component>
    </div>
  </div>
</template>

<script>
  import RightFun from "../../../components/RightFun";
  import {mapGetters} from 'vuex'

  export default {
    name: "AsideTitle",
    data() {
      return {
        navWidth: '', //标题导航条宽度
        pageWidth: '', //页面宽度
        isShow: false,
        mouseR: false, //是否渲染鼠标右键事件
        clientX: '',
        clientY: ''
      }
    },
    computed: {
      ...mapGetters({
        getAsideTitle: 'header/AsideTitle',
        active: 'header/active',
        getCollapseState: 'header/CollapseState',
        getCrumbs: 'header/Crumbs',
        getNavs: 'header/Navs'
      })
    },
    methods: {
      /*
      *定位面包屑，通过path路径更新定位到即将跳转到的路由路径的面包屑
      * @params：
      *   path：即将跳转到的路由路径
      * */
      locationCrumbs(path) {
        //匹配到左侧导航数据，存入vuex/header/crumbs
        let parentTitle
        let childTitle
        const nav = this.getNavs.nav
        for (let i = 0; i < nav.length; i++) {
          parentTitle = nav[i].title
          if (nav[i].child) {
            for (let j = 0; j < nav[i].child.length; j++) {
              if (nav[i].child[j].path == path) {
                childTitle = nav[i].child[j].title
                this.setCrumbs(parentTitle, childTitle)
                return;
              }
            }
          } else {
            parentTitle = nav[i].title
            this.setCrumbs(parentTitle, childTitle)
            return;
          }
        }
      },
      /*
      * 设置面包屑，把当前面包屑信息存入到vuex中
      * */
      setCrumbs(pt, ct) {
        let crumbs = new Array()
        crumbs.push(pt, ct)
        this.$store.commit('header/setCrumbs', crumbs)
      },
      /*
      * 点击导航标题，跳转到对应的导航页面
      *   path: 当前标题的导航路径
      *   index:当前标题标签的活跃下标
      * */
      toUrl(path, index) {
        //跳转路由
        this.$store.commit('header/setActiveIndex', index)
        this.$router.push({
          path: path
        })
        this.locationCrumbs(path)
      },
      /*
      * 删除当前标题函数
      * title: 当前被删除的标题标签
      * index: 当前被删除的标题标签的下标
      * */
      closeTag(title, index) {
        /*
        *1.判断当前被删除标题标签下标是否是正则活跃的下标，如果是则
        * 判断当前被删除的标题标签右侧是否有标题标签，如果有，
        * 删除当前标题标签后，下一个被活跃的标题为其右侧的标题标签，否则，为其左侧的标题标签
        * 否则，直接删除即可
        * */
        for (let i = 0; i < this.getAsideTitle.length; i++) {
          if (this.getAsideTitle[i].activeIndex == index) {
            //当标题tag为选中状态被删除时才需要计算下一个被选中状态的标题tag
            if (this.getAsideTitle[i].activeIndex === this.active) {
              //判断下一个活跃的标题标签 右侧有标题则选择右侧，没有则选择左侧
              let nextIndex = this.getAsideTitle[i + 1] || this.getAsideTitle[i - 1]
              this.$store.commit('header/setActiveIndex', nextIndex.activeIndex)
              //跳转到路径
              let activePath = nextIndex.path
              this.$router.push({
                path: activePath
              })
              this.locationCrumbs(activePath)
            }
            //得到除了当前被删除的标题标签外的所有标题标签
            let result = this.getAsideTitle.filter(item => {
              return item.title != title
            })
            this.$store.commit('header/delOrAddAside', result)
            return
          }
        }
      },
      /*
      * 鼠标的悬浮（titleMouseover）、离开（titleMouseleave）事件,当且仅当不是选中状态和下标为0的标题才触发事件
      * */
      titleMouseover(index, activeIndex) {
        if (activeIndex !== this.active && index !== 0) {
          const node = 'close' + index
          this.$nextTick(() => {
            this.$refs[node][0].style.width = '14px'
          })
        }
      },
      titleMouseleave(index, activeIndex) {
        if (activeIndex !== this.active && index !== 0) {
          const node = 'close' + index
          this.$nextTick(() => {
            this.$refs[node][0].style.width = '0'
          })
        }
      },
      /*
      * 左侧滚动
      * */
      toLeft() {
        this.$nextTick(function () {
          this.move("left")
        })
      },
      /*
      * 右侧滚动
      * */
      toRight() {
        this.$nextTick(function () {
          this.move("right")
        })
      },
      /*
      * 是否显示左右滚动按钮 当标题导航宽度大于（当前页面宽度 - 左侧导航栏宽度）时显示左右滚动按钮，否则隐藏
      * */
      showBtn() {
        this.$nextTick(function () {
          //页面长度----页面宽度-左侧导航栏
          if (this.getCollapseState == false) {
            this.pageWidth = document.documentElement.clientWidth - 200
          } else {
            this.pageWidth = document.documentElement.clientWidth - 64
          }
          //标题导航宽度
          this.navWidth = this.$el.querySelector('.titleNav').scrollWidth

          //如果标题导航超出页面宽度 则显示方向键 否则隐藏
          if (this.navWidth >= this.pageWidth) {
            this.isShow = true
            this.$el.querySelector('.titleNav').style.right = '20px'
          } else {
            this.isShow = false
          }
        })
      },
      /*
      * 移动函数,移动距离为当前可滚动距离的三分之一
      * */
      move(direction) {
        if (direction === 'left') {
          let num = 0
          num += (this.navWidth - this.pageWidth + 40) / 3
          this.$el.querySelector('.titleNav').scrollLeft -= num
        } else {
          let num = 0
          num += (this.navWidth - this.pageWidth + 40) / 3
          this.$el.querySelector('.titleNav').scrollLeft += num
        }
      },
      /*
      * 鼠标右键事件，阻止浏览器默认的右键事件，弹出关闭标题标签的选项
      * */
      mouseRight(event) {
        //渲染右键功能
        this.mouseR = true
        //获得当前鼠标点击右键的X, y轴坐标 传递给子组件做初始化位置
        this.clientX = event.clientX
        this.clientY = event.clientY
      },
      //关闭右键功能
      closeRightF(state) {
        this.mouseR = state
      },
      /**
       * sessionStorage：session存储,当页面刷新、销毁时触发
       * */
      sessionStorage() {
        sessionStorage.setItem("titleItem", JSON.stringify({
          titleItem: this.getAsideTitle,
          activeIndex: this.active,
          crumbs: this.getCrumbs
        }))
      }
    },
    mounted() {
      /*
       * 监听页面是否执行刷新，如果刷新则把当前的标题标签存入vuex中，供刷新后重新渲染
       * */
      let _this = this
      window.addEventListener('beforeunload', e => {
        _this.sessionStorage()
      })
      /*
      * 监听窗口的变化，如果条件符合，显示左右方向滚动按钮
      * */
      window.addEventListener('resize', function () {
        _this.showBtn()
      })
      /*
      * 监听整个页面的点击事件，如果mouseR(标题导航打开右键功能时)关闭这个功能
      * */
      window.addEventListener('click', function () {
        _this.mouseR = false
      })
    },
    updated() {
      this.showBtn()
    },
    created() {
      this.showBtn()
      //读取刷新前存储在session域中的数据，然后存入vuex中
      let loadBeforeRes = JSON.parse(sessionStorage.getItem("titleItem"))
      if (loadBeforeRes != null) {
        if (loadBeforeRes.titleItem != null && (loadBeforeRes.activeIndex != null || loadBeforeRes.activeIndex != '')) {
          this.$store.commit('header/delOrAddAside', loadBeforeRes.titleItem)
          //过滤出session缓存数据中activeIndex最大值，并赋值给最新的增值下标变量（header/count）
          const maxResult = this.getAsideTitle.reduce((pre, las) => pre.id > las.id ? pre : las)
          this.$store.commit('header/setActiveIndex', loadBeforeRes.activeIndex)
          //设置增值变量为缓存的最大值，防止增值变量从0开始自增
          this.$store.commit('header/setCount', maxResult.activeIndex)
          this.$store.commit('header/setCrumbs', loadBeforeRes.crumbs)
        }
      }
    },
    destroyed() {
      this.sessionStorage()
    },
    components: {
      RightFun
    }
  }
</script>


<style scoped>
  .titleNavBox {
    position: fixed;
    height: 42px;
    z-index: 200;
    border-bottom: 1px solid #e6e6e6;
  }

  .titleNav {
    display: flex;
    align-items: center;
    height: 42px;
    min-height: 42px;
    background: #ffffff;
  }

  .titleNav::-webkit-scrollbar {
    display: none;
  }

  .title {
    height: inherit;
    display: flex;
    align-items: center;
    border-right: 1px solid #e6e6e6;
    padding: 0 15px;
    font-size: 14px;
    cursor: pointer;
  }

  .title .titleClose {
    position: relative;
    width: 0;
    overflow: hidden;
    margin-left: 5px;
    transition: all ease-in-out .4s;
    -webkit-transition: all ease-in-out .4s;
  }

  .title .titleClose:hover {
    background: #cccccc;
    border-radius: 20px;
  }

  .active {
    border-bottom: 1px solid #FFFFFF;
    color: #5F4B8B;
  }

  [leftIcon], [rightIcon] {
    position: absolute;
    cursor: pointer;
    height: 42px;
    line-height: 42px;
    margin-top: -5px;
    z-index: 500;
  }

  [leftIcon] {
    left: 0;
    top: 6px;
    box-shadow: 2px 0 5px 0 #bfbfbf;
  }

  [rightIcon] {
    right: 0;
    top: 6px;
    box-shadow: 0 2px 5px 0 #bfbfbf;
  }


</style>