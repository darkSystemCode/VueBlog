<template>
  <!--             width: (getCollapseState == false)?'calc(100% - 200px)':'calc(100% - 64px)',-->
  <el-header class="header-flex"
             :style="{left: (getCollapseState == true)?'64px':'',
                 backgroundColor: getHeaderBColor,
                 color: getHeaderColor}">
    <!--左侧导航收缩按钮-->
    <div v-if="!getLeftMenu" float="left" @click="isOpen">
      <p multiBtn>
        <i :class="{'el-icon-s-fold': getCollapseState == false?true:false,
          'el-icon-s-unfold': getCollapseState == true?true:false}">
        </i>
      </p>
    </div>
    <!--面包屑组件-->
    <Crumbs v-if="getCrumbsState"></Crumbs>
    <!--右侧按钮组-->
    <div float="right">
      <!--通知按钮-->
      <el-popover
          placement="top-start"
          title="通知"
          width="200"
          trigger="click">
        <el-divider></el-divider>
        <div>
          <p><i class="el-icon-success" sColor></i><a href="#">这是第一条通知</a></p>
          <p><i class="el-icon-warning" wColor></i>这是第一条警告通知</p>
        </div>
        <el-divider></el-divider>
        <div class="btn-ground">
          <el-button type="primary" size="mini">全部已读</el-button>
          <el-button type="danger" size="mini">清空</el-button>
        </div>
        <p slot="reference" multiBtn @click="MQBox">
          <el-tooltip class="item" effect="dark" content="系统通知" placement="bottom">
            <i class="el-icon-message-solid badge"></i>
          </el-tooltip>
        </p>
      </el-popover>
      <!--刷新按钮-->
      <el-tooltip class="item" effect="dark" content="刷新页面" placement="bottom">
        <p multiBtn @click="$router.go(0)"><i class="el-icon-refresh"></i></p>
      </el-tooltip>

      <!--个人信息-->
      <el-dropdown trigger="hover" placement="bottom" @command="handleCommand">
        <p class="el-dropdown-link" multiBtn>
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </p>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item command="updatePass">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--多功能按钮，展开全局设置-->
      <el-tooltip class="item" effect="dark" content="全局设置页面" placement="bottom">
        <p multiBtn rotate @click="openGlobalSetting"><i class="el-icon-more"></i></p>
      </el-tooltip>
    </div>
    <GlbSetting :drawer="getDrawerState"></GlbSetting>
  </el-header>
</template>

<script>
import GlbSetting from "../../../components/GlbSetting"
import Crumbs from "./Crumbs"
import {mapGetters} from "vuex"

export default {
  name: "Header",
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      getHeaderBColor: 'globalSetting/HeaderBColor',
      getHeaderColor: 'globalSetting/HeaderColor',
      getDrawerState: 'globalSetting/openDrawer',
      getCollapseState: 'header/CollapseState',
      getLeftMenu: 'globalSetting/getLeftMenu',
      getCrumbsState: 'globalSetting/CrumbsState'
    })
  },
  methods: {
    isOpen() {
      //判断左侧栏是否展开或收缩
      if (this.getCollapseState == false) {
        this.$store.commit('header/setCollapse', true)
        this.$notify({
          title: '成功',
          message: '关闭左侧导航栏',
          type: 'success',
          duration: 1000
        });
      } else {
        this.$store.commit('header/setCollapse', false)
        this.$notify({
          title: '成功',
          message: '打开左侧导航栏',
          type: 'success',
          duration: 1000
        });
      }
    },
    MQBox() {

    },
    //个人信息按钮
    handleCommand(command) {
      if (command === "profile") {
        this.$router.push({
          path: '/profile'
        })
      } else if (command === "updatePass") {
        this.$router.push({
          path: '/updatePass'
        })
      } else if (command == "logout") {
        this.$requestGET({
          url: '/logout'
        }).then(res => {
          if (res.code === 200) {
            this.$router.push({
              path: '/Login',
              query: {
                autoLogin: false
              }
            })
          }
        })
      }
    },
    openGlobalSetting() {
      this.$store.commit('globalSetting/setDrawerState', true)
    }
  },
  components: {
    GlbSetting,
    Crumbs
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
  transition: all .5s ease;
}

.header-flex {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  z-index: 10;
}

p[multiBtn] {
  width: 38px;
  max-width: 38px;
  height: 38px;
  max-height: 38px;
  font-size: 18px;
  border-radius: 38px;
  margin: 2px;
  cursor: pointer;
  display: inline-flex;
  vertical-align: middle;
}

[multiBtn] i {
  line-height: 38px;
  margin: 0 auto;
}

[multiBtn]:hover {
  box-shadow: 0 0 6px #b3b3b3 inset;
  transition: all 0.5s ease;
}

[rotate] i {
  transform: rotate(90deg);
}

[sColor] {
  color: #67C23A;
  margin-right: 2px;
}

[wColor] {
  color: #E6A23C;
  margin-right: 2px;
}

[float="left"] {
  position: absolute;
  left: 0;
  cursor: pointer;
}

[float="right"] {
  position: absolute;
  right: 20px;
  cursor: pointer;
}

.badge:after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  /*margin-top: 0px;*/
  background-color: #e60000;
  border-radius: 10px;
}

</style>