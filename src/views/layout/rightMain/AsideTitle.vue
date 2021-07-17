<template>
  <div class="titleNav" @click.right.prevent.self.stop="cancelMouseRight"
       :style="{backgroundColor: '#e4ebf5',width: '100%'}">
    <!--      <i v-if="isShow" leftIcon class="el-icon-d-arrow-left scroll" @click="toLeft"></i>-->

    <div v-for="(item, index) in getAsideTitle"
         :key="index"
         ref="tag"
         :active-index="item.meta.activeIndex"
         :style="{borderRadius: '1rem', color: (getActive === item.meta.activeIndex)?getThemeColor:'#13677B'}"
         :class="{titleBtn: true,
                  animation: true,
                  active: (getActive === item.meta.activeIndex)? true: false,
                  mouseActive: (mouseover == item.meta.activeIndex)? mouseover == getActive? false: true: false}"
         @click="toTab(item.path)"
         @click.right.prevent="mouseRight(item.meta.activeIndex, $event)"
         @mouseover="mouseover = item.meta.activeIndex"
         @mouseout="mouseover = -1">
        <span>{{ item.meta.title }}</span>
      <transition name="tran">
        <span v-if="(item.meta.close && mouseover == item.meta.activeIndex)? true: false" class="el-icon-close" @click.stop="closeTag(item.meta.title, item.meta.activeIndex)"></span>
      </transition>
    </div>
    <div class="btnShadow" :style="{left: left +'px'}"></div>

    <!--      <i v-if="isShow" rightIcon class="el-icon-d-arrow-right scroll" @click="toRight"></i>-->
    <component v-if="mouseR" is="RightFun" :clientX="clientX" :clientY="clientY" :closeIndex="closeIndex"
               @close-r="closeRightF">
    </component>
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
      closeIndex: 0, //关闭标题下标
      mouseover: -1, //鼠标悬浮状态
      clientX: '',
      clientY: '',
      left: 10 //按钮阴影的滚动距离
    }
  },
  watch: {
    /*
    深度监听getAsideTitle变量的变化，其内部元素一发生变化就会触发handle函数，不管里面元素嵌套多深
    元素发生变化时，重新计算其以一个活跃标题tab的位置
    */
    getActive: {
      handler: function() {
        this.computedDistance(this.getActive)
      },
      deep: true
    },
    /*
     * 如果导航标题被删除或添加导致导航标题tabs变化 则也需要重新计算当前活跃阴影的位置
     * */
    getAsideTitle: {
      handler: function() {
        this.computedDistance(this.getActive)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      getAsideTitle: 'header/AsideTitle',
      getActive: 'header/active',
      getCollapseState: 'header/CollapseState',
      getCrumbs: 'header/Crumbs',
      getNavs: 'header/Navs',
      getThemeColor: 'globalSetting/getTheme_color'
    })
  },
  methods: {
    /*
    * 点击导航标题，跳转到对应的导航页面
    *   path: 当前标题的导航路径
    *   index:当前标题标签的活跃下标
    * */
    toTab(path) {
      //跳转路由
      this.$router.push({
        path: path
      })

      //匹配到左侧导航数据，存入vuex/header/crumbs
      let parentTitle
      let childTitle
      const nav = this.getNavs.nav
      for (let i = 0; i < nav.length; i++) {
        parentTitle = nav[i].meta.title
        if (nav[i].child) {
          for (let j = 0; j < nav[i].child.length; j++) {
            if (nav[i].child[j].path == path) {
              childTitle = nav[i].child[j].meta.title
              this.setCrumbs(parentTitle, childTitle)
              return;
            }
          }
        } else {
          parentTitle = nav[i].meta.title
          this.setCrumbs(parentTitle, childTitle)
          return;
        }
      }
    },
    setCrumbs(pt, ct) {
      let crumbs = new Array()
      crumbs.push(pt, ct)
      this.$store.commit('header/setCrumbs', crumbs)
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
      if (index === this.getActive) {
        for (let i = 0; i < this.getAsideTitle.length; i++) {
          if (this.getAsideTitle[i].meta.activeIndex == index) {
            //判断下一个活跃的标题标签
            let nextIndex = this.getAsideTitle[i + 1] || this.getAsideTitle[i - 1]
            this.$store.commit('header/setActiveIndex', nextIndex.meta.activeIndex)
            //跳转到路径
            this.$router.push({
              path: nextIndex.path
            })
          }
        }
      }
      /*
      * 得到除了当前被删除的标题标签外的所有标题标签
      * */
      let result = this.getAsideTitle.filter(item => {
        return item.meta.title != title
      })
      this.$store.commit('header/delOrAddAside', result)
      //当且仅当 当前删除下标小于正在活跃的下标时，才需要调用computedDistance方法重新计算下一个活跃标题tab的位置
      if(index < this.getActive) {
        this.computedDistance(this.getActive)
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
      /* this.$nextTick(function () {
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
           // this.$el.querySelector('.titleNav').scss.right = '20px'
         } else {
           this.isShow = false
         }
       })*/
    },
    /*
    * 移动函数,移动距离为当前可滚动距离的三分之一
    * */
    move(direction) {
      // if (direction === 'left') {
      //   let num = 0
      //   num += (this.navWidth - this.pageWidth + 40) / 3
      //   this.$el.querySelector('.titleNav').scrollLeft -= num
      // } else {
      //   let num = 0
      //   num += (this.navWidth - this.pageWidth + 40) / 3
      //   this.$el.querySelector('.titleNav').scrollLeft += num
      // }
    },
    /*
    * 鼠标右键事件，阻止浏览器默认的右键事件，弹出关闭标题标签的选项(RightFun)
    * */
    mouseRight(currIndex, event) {
      //渲染右键功能 如果仅剩首页则不渲染右键功能
      const isIndex = this.getAsideTitle.filter(item => {
        return item.meta.activeIndex != 0
      })
      if(isIndex.length !== 0) {
        this.mouseR = true
        this.closeIndex = currIndex
        //获得当前鼠标点击右键的X, y轴坐标 传递给子组件做初始化位置
        this.clientX = event.clientX
        this.clientY = event.clientY
      }
    },
    /*
    禁用浏览器默认事件，取消鼠标右键关闭功能弹窗（RightFun）
     */
    cancelMouseRight() {
      if (this.mouseR) {
        this.mouseR = false
      }
    },
    //关闭右键功能
    closeRightF(state) {
      this.mouseR = state
    },
    //计算下一个激活标题tab的距离
    computedDistance(activeIndex) {
      /*
      width: 100
      margin: 0 5
      default: 10
       */
      let index = 0;
      //拿去存储在vuex中的activeIndex对应的数组下标 确保删除tab时 解决重新生成tab的下标是不断自增长的问题
      for(let item of this.getAsideTitle) {
        if(item.meta.activeIndex == activeIndex) {
          break
        }
        index++
      }
      if (index == 0) {
        this.left = 10;
      }

      if (index >= 1) {
        this.left = (index * 110) + 10;
      }
    }
  },
  mounted() {
    /**
     * 监听页面是否执行刷新，如果刷新则把当前的标题标签存入vuex中，供刷新后重新渲染
     * */
    let _this = this
    window.addEventListener('beforeunload', e => {
      sessionStorage.setItem("titleItem", JSON.stringify({
        titleItem: _this.getAsideTitle,
        activeIndex: _this.getActive,
        crumbs: _this.getCrumbs
      }))
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
      if (loadBeforeRes.titleItem != null && (loadBeforeRes.activeIndex !== null && loadBeforeRes.activeIndex != '')) {
        this.$store.commit('header/delOrAddAside', loadBeforeRes.titleItem)
        //过滤出session缓存数据中activeIndex最大值，并赋值给最新的增值下标变量（header/count）
        const maxResult = this.getAsideTitle.reduce((pre, las) => pre.id > las.id ? pre : las)
        this.$store.commit('header/setActiveIndex', loadBeforeRes.activeIndex)
        //设置增值变量为缓存的最大值，防止增值变量从0开始自增
        this.$store.commit('header/setCount', maxResult.meta.activeIndex)
        this.$store.commit('header/setCrumbs', loadBeforeRes.crumbs)
      }
    }
  },
  components: {
    RightFun
  }
}
</script>


<style scoped>

.titleNav {
  position: fixed;
  top: 60px;
  width: calc(100%);
  height: 40px;
  max-height: 42px;
  line-height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2px 10px;
  background-color: #e4ebf5;
  user-select: none;
  z-index: 10;
}

.titleNav::-webkit-scrollbar {
  display: none;
}

.titleNav .titleBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 38px;
  line-height: 38px;
  max-height: 42px;
  text-align: center;
  cursor: pointer;
  margin: 0 5px;
  border-radius: 1rem;
  box-shadow: 0px 0px 2px #c8d0e7;
}

.titleNav .titleBtn span:first-child {
  margin: 2px;
}

.btnShadow {
  position: absolute;
  width: 100px;
  height: 35px;
  max-height: 42px;
  margin: 0 5px;
  pointer-events: none;
  border-radius: 1rem;
  box-shadow: inset 3px 2px 1px #cccccc,
  inset -3px -2px 1px #f2f2f2;
  transition: all .3s ease;
}

.active:before {
  content: ' ';
  width: 8px;
  height: 8px;
  background-color: #B04077;
  border-radius: 5px;
  z-index: 10;
}

.mouseActive {
  color: #5F4B8B;
  transition: all .3s ease;
  border-radius: 1rem;
}

.marginR {
  margin-right: 6px;
}

[leftIcon], [rightIcon] {
  position: absolute;
  cursor: pointer;
  height: 35px;
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

.tran-enter-active, .tran-leave-active {
  transition: all .3s;
}

.tran-enter, .tran-leave-to {
  opacity: 0;
}

</style>