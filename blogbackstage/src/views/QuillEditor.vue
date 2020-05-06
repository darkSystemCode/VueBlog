<template>
  <el-card shadow="never" :body-style="{padding: '0 10px'}">
    <el-form :inline="true" :model="form" :rules="rules" ref="form">
      <el-form-item prop="title" style="width: 60em">
        <el-input v-model="form.title" placeholder="请输入文章标题"
                  :style="{width: '60rem', marginTop: '1px'}"
                  maxlength="30"
                  show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="save('form')">保存草稿</el-button>
        <el-button type="primary" @click="release('form')">发布文章</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="12">
        <quill-editor class="editor"
                      v-model="content"
                      ref="quillEditor"
                      :style="{height:fuillH+'px'}"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)">
        </quill-editor>
      </el-col>
      <el-col :span="12">
        <div class="output ql-snow" :style="{height: outputH+'px',border: '1px solid #C0C4CC'}">
          <div class="ql-editor" v-html="this.content"></div>
        </div>
      </el-col>
    </el-row>
    <ArticleDialog v-if="visible == true"
                   :visible="visible"
                   :data="dataArray"
                   @close-before="closeBefore"
                   @submit-Article="submitArticle">
    </ArticleDialog>
  </el-card>
</template>

<script>
  //局部引入vue-fuill-editor
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {quillEditor} from 'vue-quill-editor'

  //局部引入highlight.js
  import 'highlight.js/styles/atelier-dune-dark.css'
  import hljs from 'highlight.js/lib/highlight';
  import javascript from 'highlight.js/lib/languages/javascript';
  import java from 'highlight.js/lib/languages/java'

  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('java', java)

  import ArticleDialog from "./ArticleDialog";
  import {axiosUtil} from "../network/axiosUtil";

  export default {
    name: "QuillEditor",
    data() {
      return {
        content: '', //文章内容
        visible: false, //提交文章是否打开对话框
        dataArray: [], //存储传递给ArticleDialog子组件的数据
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'],     //引用，代码块
              [{'header': [1, 2, 3, 4, 5, 6, false]}],     //几级标题
              [{'size': ['small', false, 'large', 'huge']}], // 字体大小
              [{'list': 'ordered'}, {'list': 'bullet'}],     //列表
              [{'indent': '-1'}, {'indent': '+1'}],     // 缩进
              [{'direction': 'rtl'}],             // 文本方向
              [{'color': []}, {'background': []}],     // 字体颜色，字体背景颜色
              [{'font': []}],     //字体
              [{'align': []}],    //对齐方式
              ['clean'], //清除样式
              ['link', 'image', 'video'] //链接、图片、视频
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            }
          },
          theme: 'snow'
        },
        form: {
          title: ''
        },
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'},
            {min: 5, max: 30, message: '标题长度不能小于5个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      onEditorBlur(quill) {
        // console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        // console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        // console.log('editor ready!', quill)
      },
      save(form) { //保存文章
        this.$refs[form].validate(valid => {
          if(valid) {
            alert("保存中...")
          }
        })
      },
      release(form) { //弹出文章对话框
        this.$refs[form].validate(valid => {
          if(valid) {
            this.visible = true
          }
        })
      },
      closeBefore(state) {
        this.visible = state
      },
      submitArticle(state, category, type, editState) {
        this.visible = state
        if(editState) { //执行文章的编辑
          axiosUtil({
            url: '/updateArticle',
            method: 'post',
            data: {
              title: this.form.title,
              content: this.content,
              category: category,
              type: type,
              articleNum: this.$route.query.articleNum
            }
          }).then(res => {
            if(res.code === 19) {
              this.$message({
                type: 'success',
                message: '编辑文章成功'
              })
              //重置当前表单
              this.form.title = ''
              this.content = ''
            } else if(res.code === 20) {
              this.$message.error("编辑文章失败")
            } else if(res.code === "010") {
              this.$message.error("图片插入失败")
            }
          })
        } else { //添加文章
          //弹出对话框，供选择文章类型，文章标签（分类）...
          axiosUtil({
            url: '/submitArticle',
            method: 'post',
            data: {
              title: this.form.title,
              content: this.content,
              category: category,
              type: type
            }
          }).then(res => {
            if(res.code === 10) {
              this.$message({
                type: 'error',
                message: res.msg
              })
            } else if(res.code === 12) {
              this.$message({
                type: 'error',
                message: res.msg
              })
            } else if(res.code === 11) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              //重置当前表单
              this.form.title = ''
              this.content = ''
            }
          }).catch(err => {
            console.log(err);
          })
        }
      }
    },
    computed: {
      fuillH() { //fuillEditor的高度
        return document.documentElement.clientHeight - 258
      },
      outputH() { //浏览页面的高度
        return document.documentElement.clientHeight - 192
      }
    },
    components: {
      quillEditor,
      ArticleDialog
    },
    mounted() {
      //组件创建的时候请求通过文章的编号得到当前文章，并赋值
      axiosUtil({
        url: '/getArticle',
        method: 'get',
        params: {
          articleNum: this.$route.query.articleNum
        }
      }).then(res => {
        if(res.code === 200) {
          this.content = res.data.content
          this.form.title = res.data.title
          this.dataArray.push({
            type: res.data.type,
            category: res.data.category,
            edit: true //这是是否编辑的标记
          })
        }
      })
    }
  }
</script>

<style scoped>

</style>