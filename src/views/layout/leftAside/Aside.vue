<template>
  <div class="aside_container">
    <!--logo栏位-->
    <div v-if="nav.LOGO && this.nav.LOGO.id === '1'"
         class="logo"
         :style="{width: (getCollapseState == false)?'200px':'64px', backgroundColor: this.getThemeColor}">
      <div :style="{minWidth: getCollapseState? '64px': '60px'}" class="img">
        <img :src="require('@/assets'+nav.LOGO.img)" alt="" style="width: 100%">
      </div>
      <span>{{ nav.LOGO.title }}</span>
    </div>
    <div>
      <el-menu :default-active="String(activeNav)"
               class="el-menu-vertical"
               :collapse="getCollapseState"
               :background-color="getAsideColor"
               :text-color="getATextColor"
               :active-text-color="getActiveColor"
               :unique-opened="!getDoubleOpen"
               :default-openeds="defaultOpen"
               ref="menu"
               router>
        <!--动态生成sideItem-->
        <template v-for="(item, parentIndex) in nav.nav">
          <SideNav :item="item" :index="parentIndex" :state="getCollapseState"></SideNav>
        </template>
      </el-menu>
    </div>
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
  components: {
    SideNav
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
      getCollapseState: 'header/CollapseState',
      getThemeColor: 'globalSetting/getTheme_color',
      getAsideTitle: 'header/AsideTitle',
      getNavs: 'header/Navs'
    })
  },
  created() {
    this.nav = this.getNavs
  }
}
</script>

<style scoped>
@import "~font-awesome/css/font-awesome.min.css";

/*elementui控制navMenu折叠动画的类默认.3s*/
.horizontal-collapse-transition {
  transition: all .5s ease;
}

a {
  margin: 0;
  padding: 0;
}

.aside_container {
  height: 100%;
  min-width: 64px;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.aside_container .logo {
  height: 60px;
  max-height: 60px;
  line-height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: width .5s ease;
}

.aside_container .logo .img {
  width: 60px;
  min-width: 60px;
  max-width: 64px;
  height: 60px;
  min-height: 60px;
  max-height: 64px;
}

.aside_container .logo span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aside_container .logo:hover {
  box-shadow: inset 0 0 6px #b3b3b3;
  transition: all 0.5s ease;
}

.el-menu {
  border-right: 0!important;
}

.el-menu-vertical {
  height: calc(100vh - 60px);
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-submenu [class^=fa] {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 16px;
}
</style>