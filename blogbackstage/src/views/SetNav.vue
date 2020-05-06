<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" circle @click="visible(true, 1, '')"></el-button>
    <span style="color: #C0C4CC"><i class="el-icon-back"></i>生成导航栏请点这</span>
    <el-dialog title="添加导航标题" :visible.sync="dialogVisible" width="55%">
      <CreateNav v-if="dialogVisible" @chil-result="getResult" :level="this.level"></CreateNav>
    </el-dialog>
    <el-collapse v-model="activeName" accordion @change="openCollapse">
      <el-collapse-item v-for="item in navData" :title="item.title" :name="item.nid" :key="item.nid">
        <template v-if="childNavData.length != 0">
          <div v-for="child in childNavData" :key="item.ncid">
            <p v-if="item.nid == child.navNumber">
              {{child.childTitle}}
            </p>
          </div>
        </template>
        <el-button type="primary" icon="el-icon-plus" circle @click="visible(true, 2, item.nid)"
                   size="mini"></el-button>
        <span style="color: #C0C4CC"><i class="el-icon-back"></i>生成导航栏请点这</span>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import CreateNav from "./CreateNav";
  import {setNav, getNav, setChildNav, getChildNav} from "../network/navRequest";

  export default {
    name: "SetNav",
    data() {
      return {
        dialogVisible: false,
        navData: [],
        childNavData: [],
        currChildIndex: 0, //当前设置子导航的一级导航下标
        level: 0, //层级 0没有层级 1一级导航 2二级导航
        activeName: 0
      }
    },
    methods: {
      getResult(title, path) {
        if (title != null && path != null) {
          if (this.level === 1) { //一级导航
            setNav(title, path).then(res => {
              if (res.code === "013") {
                this.$message({
                  duration: 2000,
                  type: 'success',
                  message: res.msg
                })
                //添加导航成功添加数据到navData中
                this.navData.push({
                  title: title,
                  path: path
                })
                this.dialogVisible = false
              } else if (res.code === "014") {
                this.$message.error(res.msg)
              }
            }).catch(err => {
              console.log(err);
            })
          } else if (this.level === 2) { //二级导航
            setChildNav(this.currChildIndex, title, path).then(res => {
              if (res.code === "015") {
                this.$message({
                  duration: 2000,
                  type: 'success',
                  message: res.msg
                })
                //添加导航成功添加数据到navData中
                //请求子导航
                getChildNav(this.activeName).then(res => {
                  if (res.code === "200") {
                    this.childNavData = res.data;
                  }
                })
                this.dialogVisible = false
              } else if (res.code === "016") {
                this.$message.error(res.msg)
              }
            }).catch(err => {
              console.log(err);
            })
          }
        }
      },
      visible(state, level, id) {  //state: 是否打开dialog level：当前的导航级数
        this.dialogVisible = state
        this.level = level
        this.currChildIndex = id
      },
      openCollapse(activeName) { //折叠面板发生改变时触发 activeName：当前被打开的折叠面板的name
        //请求子导航
        getChildNav(activeName).then(res => {
          if (res.code === "200") {
            this.childNavData = res.data;
          }
        })
      }
    },
    created() {
      getNav().then(res => {
        if (res.code === "200") {
          this.navData = res.data;
        }
      }).catch(err => {
        console.log(err);
      })
    },
    components: {
      CreateNav
    }
  }
</script>

<style scoped>
  .demo-dynamic {
    width: 460px;
  }

  .codeShow {
    background-color: #C0C4CC;
  }
</style>