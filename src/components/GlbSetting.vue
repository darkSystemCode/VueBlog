<template>
  <el-drawer :visible="drawer"
             direction="rtl"
             size="13%"
             :wrapperClosable="false"
             :before-close="beforeC"
             :append-to-body="true"
             class="drawer">
    <span slot="title">基础设置</span>
    <el-divider></el-divider>
    <div class="box">
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
        <span>是否只打开一个菜单</span>
        <el-switch v-model="doubleOpen" active-color="#409EFF" inactive-color="#909399" float="right" @change="valueChange"></el-switch>
      </div>
    </div>
  </el-drawer>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'

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
        doubleOpen: true //是否只打开一个菜单
      }
    },
    computed: {
      ...mapGetters({
        VasideColor: 'globalSetting/AsideColor',
        VaTextColor: 'globalSetting/ATextColor',
        VaActiveColor: 'globalSetting/ActiveColor',
        VheaderBColor: 'globalSetting/HeaderBColor',
        VheaderColor: 'globalSetting/HeaderColor'
      })
    },
    mounted() {
      this.asideColor = this.VasideColor
      this.aTextColor = this.VaTextColor
      this.aActiveColor = this.VaActiveColor
      this.headerBColor = this.VheaderBColor
      this.headerColor = this.VheaderColor
    },
    methods: {
      beforeC(done) { //窗口关闭时触发
        this.$store.commit('globalSetting/setDrawerState', false)
        done()
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
    height: 40px;
    line-height: 40px;
    max-height: 40px;
  }

  .box .box-item span {
    width: 170px;
    max-width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #606266;
  }

  .box .box-item [float="right"] {
    position: absolute;
    right: 10px;
    transform: translateY(50%);
  }

  .box .box-item [pickerC] {
    top: -8px;
  }

</style>