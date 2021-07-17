<template>
  <div :class="{'menu-wrapper': state}">
    <!--没有子导航-->
    <el-menu-item v-if="!item.child" :index="item.path">
      <i v-if="item.icon" :class="item.icon" :style="{color: getTextColor}"></i>
      <span slot="title">{{ item.meta.title }}</span>
    </el-menu-item>
    <!--有子导航-->
    <el-submenu :show-timeout="5000" :hide-timeout="5000" v-else :index="String(index+1)">
      <!--父级-->
      <template slot="title">
        <!--如果item有icon才添加icon图标-->
        <i v-if="item.icon" :class="item.icon" :style="{color: getTextColor}"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </template>
      <!--子级-->
      <!--判断子导航是否存在下一级的子导航，如果没有则渲染自己，如果有则递归组件-->
      <!--如果子导航中没有存在下一级的子导航 则是<el-menu-item> 否则为<el-submenu>-->
      <template v-for="(cItem, cIndex) in item.child" :index="String(index+1+'-'+cIndex+1)">
        <el-menu-item v-if="!cItem.child" :index="cItem.path">{{ cItem.meta.title }}</el-menu-item>
        <el-submenu v-else :index="String(index+1+'-'+cIndex+1)">
          <i v-if="item.icon" :class="cItem.icon"></i>
          <span slot="title">{{ cItem.meta.title }}</span>
          <!--递归自己 遍历子..导航-->
          <template v-for="(item, parentIndex) in cItem.child">
            <SideNav :item="item" :index="parentIndex" :state="state"></SideNav>
          </template>
        </el-submenu>
      </template>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: "SideNav",
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    state: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    getTextColor() { //图标颜色 对应文字的颜色
      return this.$store.state.globalSetting.aTextColor
    }
  }
}
</script>

<style scoped>
/*.el-menu-item, .el-submenu{*/
/*  transition: border-color .5s,background-color .5s,color .5s!important;*/
/*  -webkit-transition: border-color .5s,background-color .5s,color .5s!important;*/
/*}*/

.el-submenu [class^=fa] {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 16px;
}

.menu-wrapper span[slot="title"] {
  display: none;
}

</style>