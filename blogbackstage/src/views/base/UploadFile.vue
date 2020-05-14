<template>
  <div>
    <h3>elementUI官方的上传案例</h3>

    <div class="demo1">
      <p>案例一：</p>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="handleChange"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>

    <div class="demo2">
      <p>案例二：</p>
      <p>照片墙上传</p>
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>

    <div class="demo3">
      <h3>自定义上传头像</h3>
      <p>自定义图片使用了vue-cropper插件,这里只演示图片的裁剪功能，至于其他功能可以查看github文档 <a href="https://github.com/xyxiao001/vue-cropper">https://github.com/xyxiao001/vue-cropper</a>
      </p>
      <div class="avatar-box">
        <i class="el-icon-plus icon" @click="upload"></i>
        <input class="upload" id="upload" type="file" accept="image/*" style="display: none"
               @change="uploadFile($event)">
        <img :src="img" alt="" class="img" :style="{display: 'none'}">
        <button class="uploadBtn">上传</button>
      </div>
      <el-dialog
        title="图片上传"
        :visible.sync="imgUploadBox"
        width="35%"
        :before-close="beforeClose">
        <div>
          <!--裁剪区域-->
          <div :style="{width: '400px', height: '400px'}">
            <VueCropper ref="cropper"
                        :img="img"
                        :outputSize="1"
                        :outputType="outputType"
                        :autoCrop="true"
                        :autoCropWidth="200"
                        :autoCropHeight="200"
                        @cropMoving="cropMove"
                        :centerBox="true"
            ></VueCropper>
          </div>
          <!--预览区域-->
          <div class="reading">
            <h3 :style="{marginTop: '0'}">预览图：</h3>
            <div>
              <img :src="readingImg" alt="">
            </div>
          </div>
        </div>
        <span slot="footer">
        <el-button type="info" @click="cancel">取消</el-button>
        <el-button type="primary" @click="uploadImg">上传</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {VueCropper} from 'vue-cropper'

  export default {
    name: "UploadFile",
    data() {
      return {
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],
        dialogImageUrl: '',
        dialogVisible: false,
        img: '', //图片资源
        readingImg: '', //预览图片资源
        outputType: 'jpeg', //图片格式
        imgUploadBox: false
      }
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
      //弹窗
      upload() {
        this.$nextTick(() => {
          const upload = this.$el.querySelector(".upload").click()
        })
      },
      //原生input type=file输入框的上传图片触发事件
      uploadFile(event) {
        this.imgUploadBox = true
        const data = this.getObjectUrl(event.target.files[0])
        this.img = data
      },
      getObjectUrl(file) { //获得图片资源blob
        let url = null;
        //blob:http://localhost:8080/3bf759b8-1c9b-4888-92c8-395d8357cf59
        if (window.createObjectURL != undefined) {
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      beforeClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      //截图框移动函数
      cropMove() {
        // 获取截图的blob数据
        this.$refs.cropper.getCropData((data) => {
          this.readingImg = data
        })
      },
      //取消弹框方法
      cancel() {
        this.img = ''
        this.readingImg = ''
        this.imgUploadBox = false
      },
      //提交图片事件
      uploadImg() {
        if (this.readingImg) {
          //提交到后台
          alert("已提交")
          this.img = this.readingImg
          this.readingImg = ''
          this.imgUploadBox = false
          //上传服务器成功，把当前上传图片的资源预览到上传图片框展示
          this.$nextTick(() => {
            this.$el.querySelector('.icon').style.display = 'none'
            this.$el.querySelector('.img').style.display = 'block'
          })
        }
      }
    },
    components: {
      VueCropper
    }
  }
</script>

<style scoped>

  .avatar-box {
    position: relative;
    display: flex;
    width: 150px;
    height: 150px;
    border: 1px dashed #5F4B8B;
    text-align: center;
  }

  .avatar-box i {
    font-size: 30px;
    line-height: 150px;
    margin: auto;
    cursor: pointer;
  }

  .avatar-box .uploadBtn {
    width: 100%;
    height: 40px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: none;
    cursor: pointer;
  }

  img {
    width: 100%;
    height: 100%;
  }

  .reading {
    position: absolute;
    top: 85px;
    right: 30px;
  }

  .reading div {
    width: 200px;
    height: 200px;
    border: 1px dashed #5F4B8B;
  }

</style>