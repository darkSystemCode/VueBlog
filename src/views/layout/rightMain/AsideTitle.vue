<template>
  <div class="titleContainer"
       @mouseover="moveShow = true"
       @mouseleave="moveShow = false">
    <i v-if="moveFlag && moveShow" leftIcon class="el-icon-d-arrow-left scroll" :style="{left: titleLeft + 'px'}" @click="toLeft"></i>
    <div class="titleNav" ref="titleNav" @click.right.prevent.self.stop="cancelMouseRight"
         :style="{width: '100%', left: titleLeft}">
      <div v-for="(item, index) in getAsideTitle"
           :key="index"
           ref="tag"
           style="margin: 0 5px"
           :active-index="item.meta.activeIndex"
           :class="{titleBtn: true,
                  // animation: true,
                  active: (getActive === item.meta.activeIndex)? true: false}"
           @click="toTab(item.path)"
           @click.right.prevent="mouseRight(item.meta.activeIndex, $event)"
           @mouseover="mouseover = item.meta.activeIndex"
           @mouseleave="mouseover = -1">
        <div :class="{mouseActive: (mouseover == item.meta.activeIndex)? mouseover == getActive? false: true: false}">
          <span>{{ item.meta.title }}</span>
          <transition name="tran">
            <span v-if="(item.meta.close && mouseover == item.meta.activeIndex)? true: false"
                  :class="{closeBtn: (item.meta.close && mouseover == item.meta.activeIndex)? true: false}"
                  class="el-icon-close"
                  @click.stop="closeTag(item.meta.title, item.meta.activeIndex)"></span>
          </transition>
        </div>
      </div>
<!--      <div class="btnShadow" :style="{left: left +'px'}"></div>-->

      <component v-if="mouseR" is="RightFun" :clientX="clientX" :clientY="clientY" :closeIndex="closeIndex"
                 @close-r="closeRightF">
      </component>
    </div>
    <i v-if="moveFlag && moveShow" rightIcon class="el-icon-d-arrow-right scroll" @click="toRight"></i>
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
      moveFlag: false, // 是否显示标题横向移动按钮
      moveShow: false,
      moveDistance: 100, // 每次移动距离
      mouseR: false, //是否渲染鼠标右键事件
      closeIndex: 0, //关闭标题下标
      mouseover: -1, //鼠标悬浮状态
      clientX: '',
      clientY: '',
      titleLeft: 200,
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
    getCollapseState: {
      handler: function() {
        this.titleLeft = (this.getCollapseState == true)?'65':'200'
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
  mounted() {
    window.addEventListener('click', e => {
      if(this.mouseR == true) {
        this.mouseR = false
      }
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
      this.move(this.moveDistance)
    },
    /*
    * 右侧滚动
    * */
    toRight() {
      this.move(-this.moveDistance)
    },
    /**
     * 正数左移，负数右移，移动距离默认100，如果没有横向没有距离可以移动了，保持不变
     * */
    move(distance) {
      const _this = this
      this.$nextTick(() => {
        const titleDom = _this.$refs.titleNav
        let hiddenWidth = _this.titleLeft - titleDom.offsetLeft
        let totalWidth = 0
        if(hiddenWidth < distance) {
          distance = hiddenWidth
        }
        if(distance < 0) {
          if(titleDom.offsetLeft == 0) {
            hiddenWidth = 0
          }
          for (const item of titleDom.children) {
            const temp = item.clientWidth + Number(item.style["marginLeft"].replace(/[^0-9]/ig, '')) + Number(item.style["marginRight"].replace(/[^0-9]/ig, ''))
            totalWidth = totalWidth + temp
          }
          const screenWidth = window.screen.availWidth - _this.titleLeft
          if((totalWidth - hiddenWidth) < screenWidth) {
            distance = 0
          }
        }
        titleDom.style.left = (titleDom.offsetLeft + distance) + 'px'
      })
    },
    /**
    * 鼠标右键事件，阻止浏览器默认的右键事件，弹出关闭标题标签的选项(RightFun)
    * */
    mouseRight(currIndex, event) {
      //渲染右键功能 如果仅剩首页则不渲染右键功能
      if(this.getAsideTitle.length == 1 && !this.getAsideTitle[0].meta.close) {
        this.mouseR = false
      } else {
        this.mouseR = true
        this.closeIndex = currIndex
        //获得当前鼠标点击右键的X, y轴坐标 传递给子组件做初始化位置
        this.clientX = event.clientX
        this.clientY = event.clientY
      }
    },
    /**
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
      this.$nextTick(() => {
        let totalWidth = 0
        let addWidth = 0
        const titleDom = this.$refs.titleNav
        const screenWidth = window.screen.availWidth - this.titleLeft
        // 如果不是最后一个，那就是重定位
        const lastNode = titleDom.children[titleDom.childElementCount - 1]
        for (const item of titleDom.childNodes) {
          const temp = item.clientWidth + Number(item.style["marginLeft"].replace(/[^0-9]/ig, '')) + Number(item.style["marginRight"].replace(/[^0-9]/ig, ''))
          totalWidth = totalWidth + temp
          if(item.attributes["active-index"].nodeValue == activeIndex) {
            addWidth = temp
            break
          }
        }
        if(totalWidth > screenWidth) {
          this.moveFlag = true
        }
        // 被隐藏的长度
        const hiddenWidth = this.titleLeft - titleDom.offsetLeft
        if(lastNode.attributes["active-index"].nodeValue != activeIndex) {
          /**
           * 1.左移
           * 2.不移动
           * 3.右移
           * */
          if((totalWidth - hiddenWidth) < screenWidth && hiddenWidth <= (totalWidth - addWidth)) {
            return
          }
          if(hiddenWidth > 0 && (totalWidth - hiddenWidth) < screenWidth) {
            // 左移
            titleDom.style.left = (titleDom.offsetLeft + (hiddenWidth - (totalWidth - addWidth))) + 'px'
            return
          }
          if((totalWidth - hiddenWidth) > screenWidth) {
            // 右移
            const avalidWidth = addWidth - (totalWidth - screenWidth)
            // 如果可用宽度小于标题宽度，需要滚动
            titleDom.style.left = (titleDom.offsetLeft - Math.abs(avalidWidth)) + 'px'
            return
          }
        } else {
          // 新增右移，如果可用宽度小于标题宽度，需要滚动
          // 移动距离，当前标题总长度 - 被隐藏的长度 - 标题长度 + 自身长度
          if((screenWidth - totalWidth) <= 0 && (totalWidth - hiddenWidth) > screenWidth) {
            titleDom.style.left = (titleDom.offsetLeft - (totalWidth - hiddenWidth - screenWidth + addWidth)) + 'px'
          }
        }
      })
    }
  },
  updated() {
    const _this = this
    this.$nextTick(() => {
      const titleDom = _this.$refs.titleNav
      const screenWidth = window.screen.availWidth - _this.titleLeft
      // 如果不是最后一个，那就是重定位
      let totalWidth = 0
      for (const item of titleDom.children) {
        const temp = item.clientWidth + Number(item.style["marginLeft"].replace(/[^0-9]/ig, '')) + Number(item.style["marginRight"].replace(/[^0-9]/ig, ''))
        totalWidth = totalWidth + temp
      }
      if(totalWidth > screenWidth) {
        this.moveFlag = true
      }
    })
  },
  created() {
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

.titleContainer {
  position: fixed;
  width: 100%;
  height: 44px;
  max-height: 44px;
  background-color: #F8F4EA;
  z-index: 10;
}

.titleNav {
  position: fixed;
  top: 60px;
  /*width: calc(100%);*/
  height: 40px;
  max-height: 42px;
  line-height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2px 20px;
  white-space: nowrap;
  user-select: none;
  z-index: 10;
}

.titleNav::-webkit-scrollbar {
  display: none;
}

.titleBtn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  padding: 0 16px;
  line-height: 34px;
  max-height: 42px;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  box-shadow: 0px 0px 2px #c8d0e7;
}

.titleNav .titleBtn div:first-child {
  position: relative;
}

.titleNav .titleBtn div:first-child span:first-child {
  margin: 2px;
}

.closeBtn {
  position: fixed;
  width: 12px;
  height: 12px;
  line-height: 12px;
  padding: 2px;
  border-radius: 12px;
  font-size: 8px;
  background-color: #3C79F5;
  color: #FFFFFF;
}

/*.btnShadow {*/
/*  position: absolute;*/
/*  width: 100px;*/
/*  height: 35px;*/
/*  max-height: 42px;*/
/*  margin: 0 5px;*/
/*  pointer-events: none;*/
/*  border-radius: 1rem;*/
/*  box-shadow: inset 3px 2px 1px #cccccc,*/
/*  inset -3px -2px 1px #f2f2f2;*/
/*  transition: all .3s ease;*/
/*}*/

.active {
  background-color: #CEAB93;
  color: #FFFFFF;
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

/*.active:before {
  content: ' ';
  width: 8px;
  height: 8px;
  background-color: #B04077;
  border-radius: 5px;
  z-index: 10;
}*/

.mouseActive {
  color: #5F4B8B;
  transition: all .3s ease;
  border-radius: 1rem;
}

.marginR {
  margin-right: 6px;
}

[leftIcon], [rightIcon] {
  position: fixed;
  cursor: pointer;
  height: 44px;
  line-height: 44px;
  z-index: 500;
  transition: all .5s ease;
}

[leftIcon] {
  left: 200px;
  top: 60px;
  box-shadow: 2px 0 2px 0 #bfbfbf;
  background-color: #F8F4EA;
  transition: all .5s ease;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

[rightIcon] {
  right: 0;
  top: 60px;
  opacity: 1;
  box-shadow: -2px 0 2px 0 #bfbfbf;
  background-color: #F8F4EA;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.tran-enter-active, .tran-leave-active {
  transition: all .3s;
}

.tran-enter, .tran-leave-to {
  opacity: 0;
}

</style>