<template>
  <div>
    <el-table :data="mails" border style="width: 100%" empty-text="本来无一物，何处惹尘埃">
      <el-table-column fixed prop="date" :formatter="dateFormat" label="日期" width="160"></el-table-column>
      <el-table-column prop="sendAccount" label="QQ账号" width="110"></el-table-column>
      <el-table-column prop="sendEmail" label="邮箱账号" width="180"></el-table-column>
      <el-table-column prop="advises" label="建议"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isReply == 0" @click="replyWin(scope.row)" type="text" size="small">回复</el-button>
          <el-button v-if="scope.row.isReply == 1" type="text" size="small">已回复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="回复邮件" :visible.sync="isOpen" width="50%" :before-close="beforeClose">
      <div>
        <el-form :model="replyEmail" :rules="rules" ref="replyForm" label-width="120px">
          <el-form-item label="对方邮箱">
            <el-input v-model="replyEmail.toEmail" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="回复内容" prop="content">
            <el-input
              type="textarea"
              v-model="replyEmail.content"
              :rows="8"
              show-word-limit
              maxlength="200"
              placeholder="请输入回复内容"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="sendEmail('replyForm')">发 送</el-button>
      </span>
    </el-dialog>
    <Paging @curr-page="currPage" :total="total"></Paging>
  </div>
</template>

<script>
  import Paging from "../components/Paging"
  import {axiosUtil} from "../network/axiosUtil"
  import formatTime from '../utils/formatTime'

  export default {
    name: "Mail",
    data() {
      return {
        mails: [
          {
            date: '1589360053',
            sendAccount: '154954266',
            sendEmail: '18454245441',
            advises: '测试数据1',
            isReply: 0
          },
          {
            date: '1589360053',
            sendAccount: '154954266',
            sendEmail: '18454245441',
            advises: '测试数据2',
            isReply: 1
          },
          {
            date: '1589360053',
            sendAccount: '154954266',
            sendEmail: '18454245441',
            advises: '测试数据3',
            isReply: 0
          },
          {
            date: '1589360053',
            sendAccount: '154954266',
            sendEmail: '18454245441',
            advises: '测试数据4',
            isReply: 0
          }
        ],
        isOpen: false,
        replyEmail: {
          toEmail: '',
          content: ''
        },
        rules: {
          content: [
            {required: true, message: '请输入200字以内的回复内容', max: '200', trigger: "blur"}
          ]
        },
        total: 40, //返回数据总数
        page: 1 //当前页数
      }
    },
    methods: {
      //时间戳转换时间格式
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
      //打开回复邮件窗口，默认显示对方邮箱，且不可修改
      replyWin(row) {
        this.isOpen = true
        this.replyEmail.toEmail = row.sendEmail
      },
      //点击右上角的关闭按钮前，也需要询问是否发送当前邮件
      beforeClose(done) {
        let state = confirm("是否需要提交当前邮件？")
        if (state) {
          this.sendEmail('replyForm')
        } else {
          done()
        }
      },
      /**
       * 发送邮件，请求后台接口
       * */
      sendEmail(replyForm) {
        let data = this.$refs[replyForm].model
        axiosUtil({
          url: '/sendEmail',
          method: 'POST',
          data: {
            sendEmail: data.toEmail,
            advises: data.content
          }
        }).then(res => {
          if (res.code === 200) {
            this.mails = res.data
            this.isOpen = false
          }
        })
      },
      currPage(page) {
        this.page = page
        axiosUtil({
          url: '/getEmailAdv',
          method: 'get',
          params: {
            currPage: this.page
          }
        }).then(res => {
          if (res.code === 200) {
            this.mails = res.data
          }
        })
      }
    },
    created() {
      axiosUtil({
        url: '/getEmailAdv',
        method: 'get',
        params: {
          currPage: this.page
        }
      }).then(res => {
        if (res.code === 200) {
          this.mails = res.data
          this.total = res.data.length
        }
      })
    },
    components: {
      Paging
    }
  }
</script>

<style scoped>

</style>