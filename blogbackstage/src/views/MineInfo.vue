<template>
  <div style="width: 50%;margin: 0 auto">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="个人昵称" prop="username" required>
        <el-input v-model.trim="form.username" placeholder="输入昵称"></el-input>
      </el-form-item>
      <!--<el-form-item label="头像">
        <el-upload class="avatar-uploader"
                   :action="baseUrl+'/saveAvatar'"
                   :show-file-list="false"
                   :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="背景墙">
        <el-upload class="avatar-uploader"
                   :action="baseUrl+'/saveAvatar'"
                   :show-file-list="false"
                   :on-success="backAvatarSuccess"
                   :before-upload="beforeAvatarUpload">
          <img v-if="backImgUrl" :src="backImgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>-->
      <el-form-item label="个人技能" prop="skill">
        <el-select v-model="form.value"
                   multiple
                   filterable
                   allow-create
                   default-first-option
                   placeholder="请选择文章标签">
          <el-option v-for="item in form.options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="个人介绍" prop="textarea" required>
        <el-input type="textarea" v-model.trim="form.textarea" :rows="6" maxlength="200"
                  show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button @click="onReset('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {setMineInfo} from "../network/minInfoRequest";

  export default {
    name: "MineInfo",
    data() {
      const validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("昵称不能为空"))
        } else {
          callback()
        }
      };
      const validateInfo = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("个人介绍不能为空"))
        } else {
          callback()
        }
      }
      return {
        form: {
          username: '',
          options: [{
            value: 'HTML',
            label: 'HTML'
          }, {
            value: 'Java',
            label: 'Java'
          }, {
            value: 'JavaScript',
            label: 'JavaScript'
          }],
          value: [],
          textarea: ''
        },
        rules: {
          username: [
            {validator: validateName, trigger: 'blur'}
          ],
          textarea: [
            {validator: validateInfo, trigger: 'blur'}
          ]
        },
        baseUrl: 'http://localhost:8808',
        imageUrl: '',
        backImgUrl: ''
      }
    },
    methods: {
      onSubmit(form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            setMineInfo(this.form.username, this.form.value.toString(), this.form.textarea, this.imageUrl, this.backImgUrl).then(res => {
              if (res.code == "017") {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.$refs[form].resetFields()
                this.form.value = ''
                this.imageUrl = ''
                this.backImgUrl = ''
              } else if (res.code === 18) {
                this.$message.error('保存个人信息失败！')
              }
            }).catch(err => {
              console.log(err);
            })
          } else {
            alert("提交失败")
            return false
          }
        })
      },
      onReset(form) {
        this.$refs[form].resetFields();
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        alert("before")
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG && !isPNG) {
          this.$message.error('上传头像图片只能是 JPG、PNG 格式');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M && (isPNG || isJPG);
      },
      backAvatarSuccess(res, file) {
        this.backImgUrl = URL.createObjectURL(file.raw);
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader {
    width: 178px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>