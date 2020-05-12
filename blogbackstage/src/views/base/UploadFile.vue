<template>
  <div>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-change="handleChange"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <p>自定义上传头像</p>
    <div class="avatar-box">
      <i class="el-icon-plus icon" @click="upload"></i>
      <input class="upload" id="upload" type="file" style="display: none" @change="uploadFile($event)">
      <img :src="img" alt="" class="img" :style="{display: 'none', width: '100%', height: '100%'}">
      <button class="uploadBtn">上传</button>
    </div>
  </div>
</template>

<script>
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
        img: ''
      }
    },
    methods: {
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
      upload() {
        this.$nextTick(() => {
          const upload = this.$el.querySelector(".upload")
          upload.click()
        })
      },
      uploadFile(event) {
        const data = this.getObjectUrl(event.target.files[0])
        this.img = data
        if(data) {
          this.$el.querySelector('.icon').style.display = 'none'
          this.$el.querySelector('.img').style.display = 'block'
          console.log(this.$el.querySelector('.avatar-box'));
        }
      },
      getObjectUrl(file) {
        let url = null;
        if (window.createObjectURL!=undefined) {
          url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
      }
    }
  }
</script>

<style scoped>

  .avatar-box {
    position: relative;
    display: flex;
    width: 150px;
    height: 150px;
    border: 1px dashed blueviolet;
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
</style>