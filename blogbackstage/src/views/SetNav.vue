<template>
  <div>
    <div class="box-content">
      <el-row :gutter="20">
        <template v-if="navData.length !== 0">
          <el-col :span="6" class="col" v-for="item in navData" :key="item.nid">
            <div class="content" ref="contents">
              <div class="header">{{item.title}}</div>
              <div class="main">
                <template v-if="item.children != null || childNavData != ''">
                  <div class="child" v-for="(childItem, index) in item.children" :key="index">
                    <div v-if="item.nid === childItem.navNumber">{{childItem.childTitle}}</div>
                  </div>
                </template>
                <div class="child">
                  <el-button type="primary" icon="el-icon-plus" circle @click="visible(true, 2, item.nid)"
                             size="mini"></el-button>
                </div>
              </div>
            </div>
          </el-col>
        </template>
        <el-col :span="6" class="col">
          <div class="add-box">
            <el-button type="primary" icon="el-icon-plus" circle @click="visible(true, 1, '')"></el-button>
            <span style="color: #C0C4CC"><i class="el-icon-back"></i>生成导航栏请点这</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--添加导航标题的弹窗dialog-->
    <el-dialog title="添加导航标题" :visible.sync="dialogVisible" width="55%">
      <CreateNav v-if="dialogVisible" @chil-result="getResult" :level="this.level"></CreateNav>
    </el-dialog>
  </div>
</template>

<script>
  import CreateNav from "./CreateNav";

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
            this.$request({
              url: '/setNav',
              data: {
                title: title,
                path: path
              },
              method: 'post'
            }).then(res => {
              if (res.code === 200) {
                console.log(res.data)
                this.$message({
                  duration: 2000,
                  type: 'success',
                  message: res.data
                })
                //添加导航成功添加数据到navData中
                this.navData.push({
                  title: title,
                  path: path
                })
                this.dialogVisible = false
              } else if (res.code === 201) {
                this.$message.error(res.msg)
              }
            }).catch(err => {
              console.log(err);
            })
          } else if (this.level === 2) { //二级导航
            this.$request({
              url: '/setChildNav',
              method: 'post',
              data: {
                navNumber: this.currChildIndex,
                childTitle: title,
                childPath: path
              }
            }).then(res => {
              if (res.code === 200) {
                this.$message({
                  duration: 2000,
                  type: 'success',
                  message: res.data
                })
                //添加导航成功后，把当前的数据存入父级导航的children字段中，
                //动态更新子导航的数据（也可以查询数据库更新，其实都一样的，
                // 数据能保持一致就好，至于那种实现方法，自行选择咯，但是说到底，最好还是读取后台数据更新较好，哈哈哈）
                //我一样提供了一个借口 getChildNav(activeName)
                for (let item of this.navData) {
                  if (item.nid === this.currChildIndex) {
                    item.children.push({
                      navNumber: this.currChildIndex,
                      childTitle: title,
                      childPath: path
                    })
                  }
                }

                this.dialogVisible = false
              } else if (res.code === 201) {
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
      }
    },
    mounted() {
      this.$request({
        url: '/getNav',
        method: 'post'
      }).then(res => {
        if (res.code === 200) {
          this.navData = res.data;
        }
      }).catch(err => {
        console.log(err);
      })

      //待页面加载完毕后执行
      this.$nextTick(() => {
        // console.log(this.$refs.contents);
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

  .box-content .col {
    padding-bottom: 10px;
  }

  .box-content .add-box {
    min-height: 98px;
    display: block;
    border: 1px dashed #5F4B8B;
    border-radius: 5px;
    padding: 10px;
    line-height: 78px;
    text-align: center;
  }

  .box-content .content {
    border: 1px solid #5F4B8B;
    border-radius: 5px;
  }

  .box-content .content .header {
    height: 50px;
    line-height: 50px;
    background: #cccccc;
    text-align: center;
  }

  .box-content .content .main {
    display: flex;
    flex-wrap: wrap;
  }

  .box-content .content .child, .box-content .content .main {
    padding: 10px;
  }

</style>