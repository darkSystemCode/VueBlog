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
      <!-- quillEditor编辑区域 -->
      <el-col :span="quillWidth" style="transition: all ease-in-out 1s">
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
      <!-- quillEditor预览区域 -->
      <transition name="readView">
        <el-col :span="12" v-if="show">
          <div class="output ql-snow" :style="{height: outputH+'px',border: '1px solid #C0C4CC'}">
            <el-button type="warning" icon="el-icon-close" circle class="closeIcon" @click="closeReadV"></el-button>
            <div class="ql-editor" v-html="this.content"></div>
          </div>
        </el-col>
      </transition>
      <div class="capsule" type="primary">
        <div ref="capsule" class="switch">
          <el-switch
            v-model="show"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </div>
      </div>
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
        },
        show: true
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
          if (valid) {
            alert("保存中...")
          }
        })
      },
      release(form) { //弹出文章对话框
        this.$refs[form].validate(valid => {
          if (valid) {
            this.visible = true
          }
        })
      },
      closeBefore(state) {
        this.visible = state
      },
      submitArticle(state, category, type, editState) {
        this.visible = state
        if (editState) { //执行文章的编辑
          this.$requestPOST({
            url: '/updateArticle',
            data: {
              title: this.form.title,
              content: this.content,
              category: category,
              type: type,
              articleNum: this.$route.query.articleNum
            }
          }).then(res => {
            // console.log("edit")
            if (res.code === "019") {
              this.$message({
                type: 'success',
                message: '编辑文章成功'
              })
              //重置当前表单
              this.form.title = ''
              this.content = ''
            } else if (res.code === "020") {
              this.$message.error("编辑文章失败")
            } else if (res.code === "010") {
              this.$message.error("图片插入失败")
            }
          })
        } else { //添加文章
          //弹出对话框，供选择文章类型，文章标签（分类）...
          this.$requestPOST({
            url: '/submitArticle',
            data: {
              title: this.form.title,
              content: this.content,
              category: category,
              type: type
            }
          }).then(res => {
            if (res.code === "010") {
              this.$message({
                type: 'error',
                message: res.msg
              })
            } else if (res.code === "012") {
              this.$message({
                type: 'error',
                message: res.msg
              })
            } else if (res.code === "011") {
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
      },
      /**
       * 关闭富文本阅览页面
       * */
      closeReadV() {
        this.show = !this.show
      }
    },
    computed: {
      fuillH() { //fuillEditor的高度
        return document.documentElement.clientHeight - 258
      },
      outputH() { //浏览页面的高度
        return document.documentElement.clientHeight - 192
      },
      quillWidth() {
        if (!this.show) {
          let temp = 12
          if(temp = 24) {
            return temp
          }
          return temp++
        } else {
          return 12
        }
      }
    },
    components: {
      quillEditor,
      ArticleDialog
    },
    created() {
      //组件创建的时候请求通过文章的编号得到当前文章，并赋值
      this.$requestGET({
        url: '/getArticle/' + this.$route.query.articleNum
      }).then(res => {
        if (res.code === "200") {
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
  .output {
    position: relative;
  }

  .closeIcon {
    position: absolute;
    transform: translateY(-50%);
    right: 50%;
  }

  .closeIcon:hover {
    transform: translateY(-58%);
    transition: transform ease 0.5s;
    background-color: red;
    color: #000000;
  }

  .capsule {
    position: absolute;
    right: 0;
    transform: translateY(-100%);
    min-width: 20px;
    width: 20px;
    min-height: 30px;
    line-height: 30px;
    background-color: #5F4B8B;
    color: #C0C4CC;
    border-radius: 5px;
    text-align: center;
    transition: width 1s;
    -webkit-transition: width 1s;
    overflow: hidden;
  }

  .capsule:hover {
    width: 80px;
    max-width: 100px;
  }

  .capsule .switch {
    position: absolute;
    transform: translateX(50%);
  }

  .readView-enter-active {
    transition: all 2s ease-in-out;
  }

  .readView-leave-active {
    /*transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
    display: none;
  }

  .readView-enter, .readView-leave-to {
    transform: translateX(350%);
  }
</style>