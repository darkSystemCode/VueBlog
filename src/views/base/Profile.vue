<template>
  <div>
    <el-card shadow="always" class="card">
      <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
      <div class="baseInfo">
        <p>{{name}}</p>
        <p>{{introduce}}</p>
      </div>
    </el-card>

    <el-row :gutter="10" :style="{marginTop: '20px'}">
      <el-col :span="6">
        <el-card>
          <el-table :data="articleData" style="width: 100%">
            <el-table-column prop="data" label="发布时间" width="180"></el-table-column>
            <el-table-column prop="title" label="文章标题" width="180"></el-table-column>
          </el-table>
          <el-pagination
            :page-size="6"
            layout="total, prev, pager, next"
            :total="36">
          </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/12 20:46</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/3 20:46</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/2" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/2 20:46</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  export default {
    name: "Profile",
    data() {
      return {
        name: '',
        introduce: '阳光明媚，未来不可辜负。',
        articleData: [
          {
            data: '1587525931',
            title: '谈谈做这个项目的感受'
          },
          {
            data: '1587525931',
            title: '谈谈做这个项目的感受'
          },
          {
            data: '1587525931',
            title: '谈谈做这个项目的感受'
          },
          {
            data: '1587525931',
            title: '谈谈做这个项目的感受'
          },
          {
            data: '1587525931',
            title: '谈谈做这个项目的感受'
          },
          {
            data: '1587525931',
            title: '谈谈做这个项目的感受'
          }
        ]
      }
    },
    created() {
      let profile = JSON.parse(sessionStorage.getItem("profile"))
      if(profile) {
        this.name = profile
      }
    }
  }
</script>

<style scoped>

  .card {
    position: relative;
    display: flex;
    height: 146px;
  }

  .baseInfo {
    position: absolute;
    left: 140px;
    top: 20%;
  }

  .baseInfo>p:nth-child(1) {
    display: inline;
  }
</style>