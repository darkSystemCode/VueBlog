<template>
  <div>
    <div class="condition">
      <span style="font-size: 18px">筛选：</span>
      <span>检索文章编号：</span>
      <el-input v-model="articleNum" placeholder="输入文章编号" @input="inputChange" :clearable="true"
                :style="{width: '140px'}"></el-input>
      <span style="margin-left: 5px">检索时间段：</span>
      <el-date-picker v-model="times" type="daterange" range-separator="至" start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy 年 MM 月 dd 日"
                      value-format="timestamp"
                      @change="timeChange">
      </el-date-picker>
      <span style="margin-left: 5px">文章类型：</span>
      <el-radio v-model="type" label="原创" @change="radioChange" :style="{lineHeight: '40px'}">原创</el-radio>
      <el-radio v-model="type" label="转载" @change="radioChange" :style="{lineHeight: '40px'}">转载</el-radio>
      <el-button type="warning" @click="defaultF">初始化条件</el-button>
    </div>
    <JsonExcel :data="tableData" :fields="fields" worksheet="sheet1" name="文章" :before-generate="beforeDownL" :before-finish="beforeFin">
      <el-button type="primary">DOWNLOAD <i class="fa fa-download"></i></el-button>
      <el-progress :percentage="progress" v-if="showProgress"></el-progress>
    </JsonExcel>
    <el-table :data="tableData" class="table" :max-height="getHeight" empty-text="本来无一物，何处惹尘埃">
      <el-table-column fixed prop="articleNum" label="文章编号" width="180"></el-table-column>
      <el-table-column prop="createTime" :formatter="dateFormat" label="创建日期" width="180"></el-table-column>
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="content" label="文章内容" width="400"></el-table-column>
      <el-table-column prop="category" label="类别" width="100"></el-table-column>
      <el-table-column prop="type" label="类型" width="100"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" width="120"></el-table-column>
      <el-table-column prop="readingNum" label="阅读量" width="100"></el-table-column>
      <el-table-column prop="likeNum" label="点赞量" width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="editRow(scope.$index, tableData)" type="text" size="small">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Paging @curr-page="currPage" :total="total"></Paging>
  </div>
</template>

<script>
  import Paging from "../components/Paging"
  import {axiosUtil} from "../network/axiosUtil"
  import formatTime from "../utils/formatTime"
  import JsonExcel from "vue-json-excel"

  export default {
    name: "ArticleManager",
    data() {
      return {
        articleNum: '',
        times: '',
        type: '',
        tableData: [
          {
            articleNum: 'sdf215g4sd5s21',
            createTime: '1589360053',
            title: 'Vue高阶',
            content: 'Vue高阶知识大全，一个月快速入门，从零到精英，其实挺厉害了...',
            category: 'Vue',
            type: '原创',
            updateTime: '',
            readingNum: '600',
            likeNum: '15'
          },
          {
            articleNum: 'sdf215g4sd5s21',
            createTime: '1589360053',
            title: 'Vue高阶',
            content: 'Vue高阶知识大全，一个月快速入门，从零到精英，其实挺厉害了...',
            category: 'Vue',
            type: '原创',
            updateTime: '',
            readingNum: '600',
            likeNum: '15'
          },
          {
            articleNum: 'sdf215g4sd5s21',
            createTime: '1589360053',
            title: 'Vue高阶',
            content: 'Vue高阶知识大全，一个月快速入门，从零到精英，其实挺厉害了...',
            category: 'Vue',
            type: '原创',
            updateTime: '',
            readingNum: '600',
            likeNum: '15'
          },
          {
            articleNum: 'sdf215g4sd5s21',
            createTime: '1589360053',
            title: 'Vue高阶',
            content: 'Vue高阶知识大全，一个月快速入门，从零到精英，其实挺厉害了...',
            category: 'Vue',
            type: '原创',
            updateTime: '',
            readingNum: '600',
            likeNum: '15'
          }
        ],
        fields: {
          '文章编号': 'articleNum',
          '创建时间': 'createTime',
          '标题': 'title',
          '内容': 'content',
          '分类': 'category',
          '类型': 'type',
          '阅读量': 'readingNum',
          '点赞量': 'likeNum'
        },
        page: 1, //当前页码
        total: 0, //返回数据的总数
        showProgress: false, //是否显示导出excel进度条
        progress: 0 //进度条进度
      }
    },
    computed: {
      getHeight() {
        return document.documentElement.clientHeight - 170
      }
    },
    methods: {
      /*编辑文章 跳转到富文本组件*/
      editRow(index, rows) {
        this.$router.push({
          path: '/quillEditor',
          query: {
            articleNum: rows[index].articleNum
          }
        })
      },
      /*格式化时间格式*/
      dateFormat(row, col) {
        let resDate
        let date = row[col.property]
        if (date != null) {
          resDate = this.formatTime(date)
        }
        return resDate
      },
      formatTime(time) { //格式化时间
        return formatTime(time, "yyyy-MM-dd hh:mm:ss")
      },
      /*时间段输入框值发生改变时触发 value：当前输入框值*/
      timeChange(value) {
        let articleNum = ''
        let type = ''
        if (type !== " ") {
          type = this.type
        }
        if (this.articleNum !== " ") {
          articleNum = this.articleNum
        }
        let startTime = ''
        let endTime = ''
        if (this.times != null) {
          startTime = value[0]
          endTime = value[1]
        }
        this.requestInterface(articleNum, startTime, endTime, type, this.page)
      },
      /*文章编号输入框值发生改变时触发 values：当前输入框值*/
      inputChange(value) {
        let type = ''
        let startTime = ''
        let endTime = ''
        if (type !== " ") {
          type = this.type
        }
        if (this.times != null) {
          if (this.times.length != 0) {
            startTime = this.times[0]
            endTime = this.times[1]
          }
        }
        this.requestInterface(value, startTime, endTime, type, this.page)
      },
      /*文章类型单选框选中状态发生时触发，value：当前选中值*/
      radioChange(value) {
        //判断请求接口前，是否还存在前置的条件 如果存在，则一起追加进条件去请求接口数据
        let articleNum = ''
        let startTime = ''
        let endTime = ''
        if (this.articleNum !== " ") {
          articleNum = this.articleNum
        }
        if (this.times != null) {
          if (this.times.length != 0) {
            startTime = this.times[0]
            endTime = this.times[1]
          }
        }
        this.requestInterface(articleNum, startTime, endTime, value, this.page)
      },
      requestInterface(articleNum, startTime, endTime, type, currPage) {
        axiosUtil({
          url: '/getAllArticle',
          method: 'get',
          params: {
            startTime: startTime,
            endTime: endTime,
            type: type,
            articleNum: articleNum,
            currPage: currPage
          }
        }).then(res => {
          if (res.code === 200) {
            this.tableData = res.data
            this.total = res.data.length
          }
        })
      },
      /*初始化条件 全部条件清空*/
      defaultF() {
        this.articleNum = ''
        this.times = ''
        this.type = ''
        this.requestInterface("", "", "", "", this.page)
      },
      //当前页发生改变时触发，重新请求数据
      currPage(page) {
        this.page = page
        this.requestInterface(this.articleNum, this.times[0], this.times[1], this.type, this.page)
      },
      /*
      * 导出excel前函数
      * */
      beforeDownL() {
        this.showProgress = true
        for (let i = 0; i < 50; i++) {
          this.progress += 2
        }
      },
      /*
      * 导出excel完成前函数
      * */
      beforeFin() {
        setTimeout(() => {
          this.showProgress = false
        }, 500)
      }
    },
    created() {
      axiosUtil({
        url: '/getAllArticle',
        method: 'get',
        params: {
          currPage: this.page
        }
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.data.length
        }
      })
    },
    components: {
      Paging,
      JsonExcel
    }
  }
</script>

<style scoped>
  .table {
    margin-top: 5px;
  }

  .condition {
    height: 40px;
    line-height: 40px;
    display: flex;
  }
</style>