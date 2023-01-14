<template>
  <el-drawer :visible="drawer"
             direction="rtl"
             size="13%"
             :modal="false"
             :wrapperClosable="true"
             :before-close="beforeC"
             :append-to-body="true"
             class="drawer">
    <span slot="title">基础设置</span>
    <el-divider></el-divider>
    <div class="box">
      <div class="box-item">
        <span>主题色</span>
        <el-color-picker v-model="theme_color" size="mini" float="right" pickerC @change="theme_color_change"></el-color-picker>
      </div>
      <div class="box-item">
        <span>左侧导航背景颜色</span>
        <el-color-picker v-model="asideColor" size="mini" float="right" pickerC @change="asideChange"></el-color-picker><!--pickerC:颜色选择器的上调属性 开关可不添加这个属性-->
      </div>
      <div class="box-item">
        <span>左侧导航文字颜色</span>
        <el-color-picker v-model="aTextColor" size="mini" float="right" pickerC @change="textChange"></el-color-picker>
      </div>
      <div class="box-item">
        <span>左侧导航文字选中颜色</span>
        <el-color-picker v-model="aActiveColor" size="mini" float="right" pickerC @change="activeChange"></el-color-picker>
      </div>
      <div class="box-item">
        <span>头部背景颜色</span>
        <el-color-picker v-model="headerBColor" size="mini" float="right" pickerC @change="headColor"></el-color-picker>
      </div>
      <div class="box-item">
        <span>头部颜色</span>
        <el-color-picker v-model="headerColor" size="mini" float="right" pickerC @change="hColor"></el-color-picker>
      </div>
      <div class="box-item">
        <div>
          <span>左侧导航展示级别</span>
          <el-switch v-model="doubleOpen" active-color="#409EFF" inactive-color="#909399" float="right" @change="valueChange"></el-switch>
        </div>
        <div class="tip">
          <div>
            <span class="el-icon-warning-outline"></span>
          </div>
          <div>
            <p>打开此功能，能同时展开多个子菜单</p>
          </div>
        </div>
      </div>
      <div class="box-item">
        <div>
          <span>导航面包屑</span>
          <el-switch v-model="crumbsState" active-color="#409EFF" inactive-color="#909399" float="right" @change="handleCrumbs"></el-switch>
        </div>
        <div class="tip">
          <div>
            <span class="el-icon-warning-outline"></span>
          </div>
          <div>
            <p>是否显示导航面包屑</p>
          </div>
        </div>
      </div>
      <div class="box-item">
        <div>
          <span>左侧导航栏固定</span>
          <el-switch v-model="leftMenu" active-color="#409EFF" inactive-color="#909399" float="right" @change="handleLeftMenu"></el-switch>
        </div>
        <div class="tip">
          <div>
            <span class="el-icon-warning-outline"></span>
          </div>
          <div>
            <p>是否固定左侧导航栏</p>
          </div>
        </div>
      </div>
      <div class="box-item">
        <div>
          <span>显示LOGO图标</span>
          <el-switch v-model="logoFlag" active-color="#409EFF" inactive-color="#909399" float="right" @change="handleLogoFlag"></el-switch>
        </div>
        <div class="tip">
          <div>
            <span class="el-icon-warning-outline"></span>
          </div>
          <div>
            <p>是否显示LOGO图标</p>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: "GlbSetting",
    props: {
      drawer: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //存储容器的颜色数组 最好和VUEX初始化的颜色值一致，这样保持了颜色选择器的颜色值显示， 否则颜色选择器的颜色为空白
        asideColor: '', //左侧导航栏背景色
        aTextColor: '', //左侧导航栏文字颜色
        aActiveColor: '', //左侧导航栏选中时颜色
        headerBColor: '', //顶部背景色
        headerColor: '', //顶部图标、文字颜色
        doubleOpen: null, //是否只打开一个菜单
        crumbsState: null, //默认打开面导航包屑提示
        leftMenu: null, //左侧导航栏固定
        theme_color: '',
        logoFlag: null // 是否显示logo
      }
    },
    watch: {
      CrumbsState: {
        handler: function(val) {
          this.tip(val, '打开面包屑！', '关闭面包屑！')
        }
      },
      DoubleOpen: {
        handler: function(val) {
          this.tip(val, '打开多级导航展示！', '关闭多级导航展示！')
        }
      },
      getLeftMenu: {
        handler: function(val) {
          this.tip(val, '左侧导航栏固定', '左侧导航栏取消固定')
        }
      },
      getLogoFlag: {
        handler: function (val) {
          this.tip(val, '显示logo图标', '不显示logo图标')
        }
      }
    },
    computed: {
      ...mapGetters({
        VasideColor: 'globalSetting/AsideColor',
        VaTextColor: 'globalSetting/ATextColor',
        VaActiveColor: 'globalSetting/ActiveColor',
        VheaderBColor: 'globalSetting/HeaderBColor',
        VheaderColor: 'globalSetting/HeaderColor',
        DoubleOpen: 'globalSetting/DoubleOpen',
        CrumbsState: 'globalSetting/CrumbsState',
        getLeftMenu: 'globalSetting/getLeftMenu',
        getThemeColor: 'globalSetting/getTheme_color',
        getLogoFlag: 'globalSetting/getLogoFlag'
      })
    },
    mounted() {
      this.asideColor = this.VasideColor
      this.aTextColor = this.VaTextColor
      this.aActiveColor = this.VaActiveColor
      this.headerBColor = this.VheaderBColor
      this.headerColor = this.VheaderColor
      this.doubleOpen = this.DoubleOpen
      this.crumbsState = this.CrumbsState
      this.leftMenu = this.getLeftMenu
      this.theme_color = this.getThemeColor
      this.logoFlag = this.getLogoFlag
    },
    methods: {
      tip(state, openMsg, closeMsg) {
        if(state) {
          this.$message({
            message: openMsg,
            type: "success",
            duration: 500
          })
        } else {
          this.$message({
            message: closeMsg,
            type: "info",
            duration: 500
          })
        }
      },
      beforeC(done) { //窗口关闭时触发
        this.$store.commit('globalSetting/setDrawerState', false)
        done()
      },
      theme_color_change() {
        this.$store.commit("globalSetting/setTheme_color", this.theme_color)
      },
      /*
      * 使用VUEX动态改变颜色值
      * */
      asideChange() {
        this.$store.commit('globalSetting/asideChange',this.asideColor)
      },
      textChange() {
        this.$store.commit("globalSetting/textChange", this.aTextColor)
      },
      activeChange() {
        this.$store.commit("globalSetting/activeChange", this.aActiveColor)
      },
      headColor() {
        this.$store.commit("globalSetting/headerBChange", this.headerBColor)
      },
      hColor() {
        this.$store.commit("globalSetting/headerChange", this.headerColor)
      },
      valueChange() {
        this.$store.commit("globalSetting/valueChange", this.doubleOpen)
      },
      handleCrumbs() {
        this.$store.commit("globalSetting/setCrumbsState", this.crumbsState)
      },
      handleLeftMenu() {
        this.$store.commit("globalSetting/setLeftMenu", this.leftMenu)
      },
      handleLogoFlag() {
        this.$store.commit('globalSetting/setLogoFlag', this.logoFlag)
      }
    }
  }
</script>

<style scoped>

  .box {
    padding: 10px;
  }

  .box .box-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-content: center;
    padding: 10px 0;
  }

  .box .box-item .tip {
    display: flex;
    font-size: 10px;
    margin: 5px 0 0 1rem;
    color: #8c939d;
  }

  .box .box-item .tip div:last-child {
    display: flex;
    flex-wrap: wrap;
    margin-left: 3px;
  }
  .box .box-item .tip div:last-child p {
    margin: 0;
    padding: 0;
  }


  .box .box-item .tip span {
    width: auto;
    overflow: visible;
  }

  .box .box-item span {
    width: auto;
    max-width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #606266;
  }

  .box .box-item [float="right"] {
    position: absolute;
    right: 10px;
  }

</style>