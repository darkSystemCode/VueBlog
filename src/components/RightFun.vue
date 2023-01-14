<template>
  <div class="rightF" :style="{left: (clientX-200)+'px', top: (clientY - 50)+'px'}">
    <ul>
      <li :class="{closeCurr: true, notClick: currBtn}" @click="closeCurr"><i class="el-icon-arrow-down"></i>关闭当前页面</li>
      <li :class="{closeLeft: true, notClick: leftBtn}" @click="closeLeft"><i class="el-icon-back"></i>关闭左侧页面</li>
      <li :class="{closeRight: true, notClick: rightBtn}" @click="closeRight"><i class="el-icon-right"></i>关闭右侧页面</li>
      <li :class="{closeOther: true, notClick: otherBtn}" @click="closeOther"><i class="el-icon-minus"></i>关闭其他页面</li>
      <li :class="{closeAll: true, notClick: allBtn}" @click="closeAll"><i class="el-icon-close"></i>关闭全部页面</li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "RightFun",
  props: {
    clientX: {
      type: Number,
      required: true
    },
    clientY: {
      type: Number,
      required: true
    },
    closeIndex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      index: 0,
      rightBtn: false,
      leftBtn: false,
      currBtn: false,
      otherBtn: false,
      allBtn: false
    }
  },
  computed: {
    ...mapGetters({
      getAsideTitle: 'header/AsideTitle',
      getActiveIndex: 'header/active'
    })
  },
  watch: {
    closeIndex: function (val, oldVal) {
      this.listenCloseIndex(val)
    }
  },
  mounted() {
    //加载时监听closeIndex
    this.listenCloseIndex(this.closeIndex)
  },
  methods: {
    listenCloseIndex(index) {
      this.currBtn = false
      this.rightBtn = false
      this.leftBtn = false
      const currItem = this.getAsideTitle.filter(item => {
        return item.meta.activeIndex == index
      })
      if(currItem.length > 0 && !currItem[0].meta.close) {
        this.currBtn = true
      }
      //如果当前点击导航标题右侧无导航标题 则禁用关闭右侧功能
      const right = this.getAsideTitle.filter(item => {
        return item.meta.activeIndex > index && item.meta.close
      })
      if (right.length === 0) {
        this.rightBtn = true
      }
      //如果当前点击导航标题左侧无导航标题 则禁用关闭左侧功能
      const left = this.getAsideTitle.filter(item => {
        return item.meta.close && item.meta.activeIndex < index
      })
      if (left.length === 0) {
        this.leftBtn = true
      }
      const other = this.getAsideTitle.filter(item => {
        return item.meta.close && item.meta.activeIndex != index
      })
      if(other.length == 0) {
        this.otherBtn = true
      }
    },
    /*
      * 监听关闭页面功能
      * 1.关闭全部页面 closeAll
      * 2.关闭当前页面 closeCurr
      * 3.关闭左侧页面 closeLeft
      * 4.关闭右侧页面 closeRight
      * 5.关闭其他页面 closeOther
      * 使用filter（）函数 过滤不符合的结果返回， 并需要响应式改动tabsItem tabsPath
      * 2021-7-15 透明框无法根据导航标题tabs删除而移动
      * */
    closeCurr() {
      /*
      如果当前活跃下标的标题被删除了 需要判断下一个活跃的tabs标签
      （下一个活跃标题可以左右移动 ）
       */
      if (this.getActiveIndex == this.closeIndex) {
        this.getAsideTitle.forEach((item, index) => {
          if (item.meta.close && item.meta.activeIndex === this.closeIndex) {
            let nextTab = this.getAsideTitle[index + 1] || this.getAsideTitle[index - 1]
            if (nextTab) {
              this.$store.commit('header/setActiveIndex', nextTab.meta.activeIndex)
              this.$router.push({
                path: nextTab.path
              })
            }
          }
        })
      }
      //根据下标删除标题tab
      this.$store.commit('header/delOrAddAside', this.getAsideTitle.filter(item => {
        return !item.meta.close || item.meta.activeIndex != this.closeIndex
      }))
      this.$emit('close-r', false)
    },
    closeLeft() {
      /*
      * 判断当前触发关闭导航标题的是否为活跃的导航标题
      * 如果活跃导航标题在左侧 则处理下一个活跃的导航标题为当前触发的导航标题
      * 否则不做活跃导航标题处理
      * */
      if (this.getActiveIndex !== this.closeIndex) {
        const leftTabs = this.getAsideTitle.filter(item => {
          return item.meta.activeIndex < this.closeIndex && item.meta.close
        })
        for (let index of leftTabs) {
          if (index.meta.activeIndex === this.getActiveIndex) {
            const nextTab = this.getAsideTitle.filter(item => {
              return item.meta.activeIndex === this.closeIndex
            })
            //定位下一个活跃的导航标题
            if (nextTab.length > 0) {
              this.$store.commit('header/setActiveIndex', nextTab[0].meta.activeIndex)
              this.$router.push({
                path: nextTab[0].path
              })
            }
          }
        }
      }
      this.$store.commit('header/delOrAddAside', this.getAsideTitle.filter(item => {
        return !item.meta.close || item.meta.activeIndex >= this.getActiveIndex
      }))
      this.$emit('close-r', false)
    },
    closeRight() {
      /*
      * 判断当前触发关闭导航标题的是否为活跃的导航标题
      * 如果活跃导航标题在左侧 则处理下一个活跃的导航标题为当前触发的导航标题
      * 否则不做活跃导航标题处理
      * */
      if (this.getActiveIndex !== this.closeIndex) {
        const rightTabs = this.getAsideTitle.filter(item => {
          return item.meta.activeIndex > this.closeIndex && item.meta.activeIndex !== 0
        })
        for (let index of rightTabs) {
          if (index.meta.activeIndex === this.getActiveIndex) {
            const nextTab = this.getAsideTitle.filter(item => {
              return item.meta.activeIndex === this.closeIndex
            })
            //定位下一个活跃的导航标题
            if (nextTab.length > 0) {
              this.$store.commit('header/setActiveIndex', nextTab[0].meta.activeIndex)
              this.$router.push({
                path: nextTab[0].path
              })
            }
          }
        }
      }
      this.$store.commit('header/delOrAddAside', this.getAsideTitle.filter(item => {
        return item.meta.activeIndex == 0 || item.meta.activeIndex <= this.getActiveIndex
      }))
      this.$emit('close-r', false)
    },
    closeOther() {
      const result = this.getAsideTitle.filter(item => {
        return !item.meta.close || item.meta.activeIndex == this.getActiveIndex
      })
      this.$store.commit('header/delOrAddAside', result)
      this.$emit('close-r', false)
    },
    closeAll() {
      if (this.getAsideTitle.length > 1) {
        //筛选出首页（不删除）
        let result = this.getAsideTitle.filter(item => {
          return item.meta.first
        })
        this.$store.commit('header/delOrAddAside', result)
        this.$store.commit('header/setActiveIndex', result[0].meta.activeIndex)
        this.$router.push({
          path: result[0].path
        })
      }
      this.$emit('close-r', false)
    }
  }
}
</script>

<style scoped>

.rightF {
  position: absolute;
  top: 20px;
  width: 140px;
  min-width: 140px;
  background-color: #d9d9d9;
  z-index: 2000;
  border-radius: 10px;
  overflow: hidden;


}

.rightF ul {
  margin: 0;
  padding: 0;
  text-align: center;
  list-style-type: none;
}

.rightF ul li {
  cursor: pointer;
  font-size: 14px;
}

.rightF ul li:hover {
  background-color: #5F4B8B;
  color: #FFFFFF;
}

.notClick {
  pointer-events: none;
  color: #737373;
}

</style>