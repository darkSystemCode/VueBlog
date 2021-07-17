<template>
  <el-dialog title="发布文章" :visible="visible" width="40%" :before-close="closeBefore">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="文章分类" prop="category">
        <el-select v-model="form.category" filterable allow-create default-first-option placeholder="请选择文章分类">
          <el-option v-for="item in form.categorys"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择文章类型">
          <el-option label="原创" value="原创"></el-option>
          <el-option label="转载" value="转载"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span :style="{color: '#F56C6C'}">**不要提交涉及政治问题，涉黄，暴力等损坏利益的文章</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitArticle('form')">文章提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "ArticleDialog",
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      data: {
        type: Array
      }
    },
    data() {
      return {
        form: {
          type: '',
          category: '',
          categorys: [{  //后面请求数据库分类展示
            value: 'HTML',
            label: 'HTML'
          }, {
            value: 'CSS',
            label: 'CSS'
          }, {
            value: 'JavaScript',
            label: 'JavaScript'
          }]
        },
        rules: {
          category: [
            {required: true, message: '请选择文章分类', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择文章类型', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      closeBefore(done) {
        this.$emit("close-before", false)
        done()
      },
      submitArticle(form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            if(this.data[0].edit) {
              this.$emit("submit-Article", false, this.form.category, this.form.type, true)
            } else {
              this.$emit("submit-Article", false, this.form.category, this.form.type)
            }
          } else {
            return false
          }
        })
      }
    },
    created() {
      if (this.data[0].length != 0) {
        let res = this.data[0]
        this.form.type = res.type
        this.form.category = res.category
      }
    }
  }
</script>

<style scoped>

</style>