<template>
  <section class="section">
    <el-form :model="form" ref="passW" :rules="ruleForm" label-width="120" label-position="top">
      <el-form-item prop="oldPass" label="旧密码">
        <el-input v-model="form.oldPass" show-password></el-input>
      </el-form-item>
      <el-form-item prop="newPass" label="新密码">
        <el-input v-model="form.newPass" show-password></el-input>
      </el-form-item>
      <el-form-item prop="requirePass" label="确认密码">
        <el-input v-model="form.requirePass" show-password></el-input>
      </el-form-item>
      <el-form-item prop="code" label="验证码" class="codeItem">
        <el-input v-model="form.code" class="codeRes"></el-input>
        <div class="code"><Validate /></div>
      </el-form-item>
      <el-form-item class="btn-group">
        <el-button type="primary" @click="submit('passW')">确认修改</el-button>
        <el-button type="danger" @click="cancel('passW')">取 消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import Validate from "../components/Validate";
  import { mapState } from 'vuex'
  export default {
    name: "HomeUpdatePass",
    data() {
      let oldPass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error("请输入旧密码"))
        } else if(!/^[A-Za-z0-9]{6,16}$/.test(value)) {
          callback(new Error("密码可以是数字、英文，且长度为6-16"))
        } else {
          callback()
        }
      };
      let newPass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error("请输入新密码"))
        } else if(!/^[A-Za-z0-9]{6,16}$/.test(value)) {
          callback(new Error("密码可以是数字、英文，且长度为6-16"))
        } else {
          callback()
        }
      };
      let rePass = (rule, value, callback) => {
        if(value === '') {
          callback(new Error("请输入确认密码"))
        } else if(value != this.form.newPass) {
          callback(new Error("两次密码不一致，请重新输入"))
        } else {
          callback()
        }
      };
      let codes = (rule, value, callback) => {
        if(value === '') {
          callback(new Error("验证码不能为空"))
        } else if(value != this.validates.code.toString().toLowerCase()) {
          callback(new Error("验证码不正确！请重新填写"))
        } else{
          callback()
        }
      }
      return {
        form: {
          oldPass: '',
          newPass: '',
          requirePass: '',
          code: ''
        },
        ruleForm: {
          oldPass: [
            {validator: oldPass, trigger: 'blur'}
          ],
          newPass: [
            {validator: newPass, trigger: 'blur'}
          ],
          requirePass: [
            {validator: rePass, trigger: 'blur'}
          ],
          code: [
            {validator: codes, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState({
        validates: state => state.code
      })
    },
    methods: {
      submit(form) {
        this.$refs[form].validate( state => {
          if(state) {
            //清空验证码
            // code ...
            alert("ok")
            //code ...
          }
        })
      },
      cancel(form) {
        this.$refs[form].resetFields()
      }
    },
    components: {
      Validate
    }
  }
</script>

<style scoped>

  .section {
    width: 40%;
    margin: 0 auto;
  }

  .btn-group {
    text-align: center;
  }

  .codeItem {
    position: relative;
  }

  .codeRes {
    width: 30%;
  }

  .code {
    width: 25%;
    height: 40px;
    position: absolute;
    top: 0;
    left: 35%;
  }

</style>