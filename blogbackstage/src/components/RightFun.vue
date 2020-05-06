<template>
  <div class="rightF" :style="{left: (clientX-200)+'px', top: (clientY - 65)+'px'}">
    <ul>
      <li class="closeCurr" @click="closeCurr">关闭当前页面</li>
      <li class="closeLeft" @click="closeLeft">关闭左侧页面</li>
      <li class="closeRight" @click="closeRight">关闭右侧页面</li>
      <li class="closeOther" @click="closeOther">关闭其他页面</li>
      <li class="closeAll" @click="closeAll">关闭全部页面</li>
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
      }
    },
    computed: {
      ...mapGetters({
        getAsideTitle: 'header/AsideTitle',
        getActiveIndex: 'header/active'
      })
    },
    methods: {
      /*
        * 监听关闭页面功能
        * 1.关闭全部页面 closeAll
        * 2.关闭当前页面 closeCurr
        * 3.关闭左侧页面 closeLeft
        * 4.关闭右侧页面 closeRight
        * 5.关闭其他页面 closeOther
        * 使用filter（）函数 过滤不符合的结果返回， 并需要响应式改动tabsItem tabsPath
        * */
      closeCurr() {
        if (this.getAsideTitle.length > 1) {
          const currIndex = this.getActiveIndex
          if (currIndex != "0") {
            //判断下一个活跃的tabs标签
            this.getAsideTitle.forEach((item, index) => {
              if (item.activeIndex === currIndex) {
                let nextTab = this.getAsideTitle[index + 1] || this.getAsideTitle[index - 1]
                if (nextTab) {
                  this.$store.commit('header/setActiveIndex', nextTab.activeIndex)
                  this.$router.push({
                    path: nextTab.path
                  })
                }
              }
            })
            this.$store.commit('header/delOrAddAside', this.getAsideTitle.filter(item => {
              return item.activeIndex != currIndex
            }))
          }
        }
        this.$emit('close-r', false)
      },
      closeLeft() {
        if (this.getAsideTitle.length > 1) {
          if (this.getActiveIndex != "0") {
            this.$store.commit('header/delOrAddAside', this.getAsideTitle.filter( item => {
              return item.activeIndex == 0 || item.activeIndex >= this.getActiveIndex
            }))
          }
        }
        this.$emit('close-r', false)
      },
      closeRight() {
        if (this.getAsideTitle.length > 1) {
          if (this.activeTab != "0") {
            this.$store.commit('header/delOrAddAside', this.getAsideTitle.filter( item => {
              return item.activeIndex == 0 || item.activeIndex <= this.getActiveIndex
            }))
          }
        }
        this.$emit('close-r', false)
      },
      closeOther() {
        if (this.getAsideTitle.length > 1) {
          if (this.activeTab != "0") {
            this.$store.commit('header/delOrAddAside', this.getAsideTitle.filter( item => {
              return item.activeIndex == 0 || item.activeIndex == this.getActiveIndex
            }))
          }
        }
        this.$emit('close-r', false)
      },
      closeAll() {
        if (this.getAsideTitle.length > 1) {
          let result = this.getAsideTitle.filter(item => {
            return item.activeIndex == '0'
          })
          this.$store.commit('header/delOrAddAside', result)
          this.$store.commit('header/setActiveIndex', result[0].activeIndex)
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
    background-color: #f2f2f2;
    z-index: 2000;
    padding: 10px 0;
  }

  .rightF ul {
    margin: 0;
    padding: 0;
    text-align: center;
    list-style-type: none;
  }

  .rightF ul li {
    margin: 5px 0;
    padding: 5px 0;
    cursor: pointer;
    font-size: 14px;
  }

  .rightF ul li:hover {
    background-color: #66ccff;
  }

</style>