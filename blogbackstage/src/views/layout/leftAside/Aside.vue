<template>
  <div style="height: 100%">
    <!--logo栏位-->
    <div v-if="nav.LOGO && this.nav.LOGO.id === '1'"
         class="avatar avatar-flex"
         :style="{width: (getCollapseState == false)?'200px':'64px'}">
      <div>
        <a href="javascript:;">
          <img :src="require('@/assets'+nav.LOGO.img)" alt="" :style="{width: '50px', height: '50px'}">
          <span>{{nav.LOGO.title}}</span>
        </a>
      </div>
    </div>
    <el-menu :default-active="String(activeNav)"
             @select="selected"
             class="el-menu-vertical"
             :collapse="getCollapseState"
             :background-color="getAsideColor"
             :text-color="getATextColor"
             :active-text-color="getActiveColor"
             :unique-opened=getDoubleOpen
             :default-openeds="defaultOpen"
             ref="menu"
             router>
      <!--动态生成sideItem-->
      <template v-for="(item, parentIndex) in nav.nav">
        <SideNav :item="item" :index="parentIndex" :state="getCollapseState"></SideNav>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import SideNav from "./SideNav";
  import {mapGetters} from "vuex";
  import Axios from "axios";
  import style from "@/assets/css/public.css"

  export default {
    name: "Aside",
    data() {
      return {
        nav: [], //左侧导航数据数组
        defaultOpen: ['0']
      }
    },
    computed: {
      activeNav() {
        //当前激活的导航
        return this.$route.path
      },
      /*
      * 在VUEX中获得asideColor颜色值
      * */
      ...mapGetters({
        getAsideColor: 'globalSetting/AsideColor',
        getATextColor: 'globalSetting/ATextColor',
        getActiveColor: 'globalSetting/ActiveColor',
        getDoubleOpen: 'globalSetting/DoubleOpen',
        getCollapseState: 'header/CollapseState'
      })
    },
    methods: {
      selected(path) {
        this.$emit('selected-path', path)
      }
    },
    created() {
      //获得导航的json数据
      Axios({
        url: location.protocol + "/nav.json",
        method: "get"
      }).then(res => {
        //把导航数据存入vuex中
        this.$store.dispatch('header/setNavs', {
          nav: res.data.nav
        })
        this.nav = res.data
      })
    },
    components: {
      SideNav
    }
  }
</script>

<style scoped>
  @import "~font-awesome/css/font-awesome.min.css";

  .el-menu-vertical:not(.el-menu--collapse) {
    padding-top: 60px;
    width: 200px;
    min-height: 400px;
    height: calc(100% - 60px);
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

  .el-menu--collapse {
    height: 100%;
    margin-top: 60px
  }

  .el-submenu [class^=fa] {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 16px;
  }
</style>