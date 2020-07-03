<template>
  <div class="loginBox" id="loginBox" :style="{height: getHeight+'px'}">
    <div class="login" login>
      <el-card shadow="always">
        <el-avatar :src="require('../assets/imgs/logo.png')" :size="80" avatar></el-avatar>
        <div class="form" form>
          <el-form :model="loginForm" :rules="rules" ref="login" label-width="70px" label-position="left">
            <el-form-item label="用户名" prop="username">
              <el-input v-model.trim="loginForm.username" @focus="showUnTip=true" autofocus></el-input>
              <div tip v-if="showUnTip == true && this.loginForm.username == '' ">
                <p>
                  1、用户名可以是中文、英文、数字或组合
                </p>
                <p>
                  2、用户名的长度为2~8
                </p>
                <p>
                  3、不能包含特殊字符
                </p>
              </div>
            </el-form-item>
            <el-form-item label="密 码" prop="password">
              <el-input show-password v-model.trim="loginForm.password" @focus="showPsTip=true"></el-input>
              <div tip v-if="showPsTip == true && this.loginForm.password == '' ">
                <p>
                  1、密码可以是中文、英文、数字或组合
                </p>
                <p>
                  2、密码的长度为6~16
                </p>
                <p>
                  3、不能包含特殊字符
                </p>
              </div>
            </el-form-item>
            <el-form-item label="确认密码" prop="verifyPass">
              <el-input show-password v-model.trim="loginForm.verifyPass"></el-input>
            </el-form-item>
            <el-form-item marginBottom>
              <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
              <!--              <el-checkbox v-model="remPs">记住密码</el-checkbox>-->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :style="{width: '100%'}" @click="login('login')">登 录</el-button>
            </el-form-item>
          </el-form>
          <div register="true">
            <a href="javascript:;" @click="toRegister">快速注册</a>
            <a href="#">忘记密码？</a>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      let username = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入用户名"))
        } else if (!/^[\u4e00-\u9fa5A-Za-z0-9]{2,16}$/.test(value)) {
          callback(new Error("用户名只能输入中文、英文、数字组合，且长度为2-8"))
        } else {
          this.showUnTip = false
          callback()
        }
      };
      let password = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入密码"))
        } else if (!/^[A-Za-z0-9]{6,16}$/.test(value)) {
          callback(new Error("密码可以是数字、英文，且长度为6-16"))
        } else {
          this.showPsTip = false
          callback()
        }
      };
      let verifyPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入确认密码"))
        } else if (value != this.loginForm.password) {
          callback(new Error("两次密码不一致，请重新输入"))
        } else {
          callback()
        }
      }
      return {
        showUnTip: false, //是否显示用户名输入提示
        showPsTip: false, //是否显示密码输入提示
        autoLogin: false, //是否勾选自动登录功能
        // remPs: false, //是否勾选记住密码
        height: '',
        loginForm: {
          username: '',
          password: '',
          verifyPass: ''
        },
        rules: {
          username: [
            {validator: username, trigger: 'blur'}
          ],
          password: [
            {
              validator: password, trigger: 'blur'
            }
          ],
          verifyPass: [
            {validator: verifyPass, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      async getLogin() {
        let res = this.$request({
          url: '/toLogin',
          method: 'post',
          params: {
            username: this.loginForm.username,
            password: this.loginForm.password,
            autoL: this.autoLogin
          }
        })
        return res
      },
      login_success() {
        this.getLogin().then(res => {
          if (res != null && res.code === 200) {
            window.localStorage.setItem("username", JSON.stringify(this.loginForm.username))
            window.localStorage.setItem("autoLogin", JSON.stringify(this.autoLogin))
            sessionStorage.setItem("user", JSON.stringify(res.data))
            this.$message({
              type: 'success',
              message: res.msg,
              duration: 2000
            })
            //登录成功 跳转到首页
            this.$router.push({
              path: '/home'
            })
          } else {
            //登录失败继续登录
            this.$message.error(res.msg)
            this.loginForm.username = ''
            this.loginForm.password = ''
            this.loginForm.verifyPass = ''
            this.autoLogin = false
            this.remPs = false
          }
        })
      },
      //测试账号 ，不用过后台
      testAccount() {
        //测试账号
        if (this.loginForm.username === "test" && this.loginForm.password === "test123" && this.loginForm.verifyPass === "test123") {
          /*把登录成功的个人信息存入session域中*/
          let profile = new Object()
          profile.username = this.loginForm.username
          profile.password = this.loginForm.password
          sessionStorage.setItem("user", JSON.stringify({
            username: profile.username,
            token: '154954264jun'
          }))
          this.$message({
            type: 'success',
            message: '登录成功',
            duration: 2000
          })
          //登录成功 跳转到首页
          this.$router.push({
            path: '/home'
          })
        } else {
          //登录失败继续登录
          this.$message.error("登录失败，用户名或密码错误，请重新登录")
          this.$router.push({
            path: '/login'
          })
        }
      },
      login(form) {
        this.$refs[form].validate(state => {
          if (state) {
            if (this.loginForm.username === "test") {
              this.testAccount()
            } else {
              //校验后台用户数据
              this.login_success()
            }
          }
        })
      },
      toRegister() {
        this.$router.push({
          path: '/register'
        })
      }
    },
    computed: {
      getHeight() {
        this.height = document.documentElement.clientHeight
        return this.height
      }
    },
    mounted() {
      let _this = this
      window.addEventListener('resize', function () {
        _this.height = document.documentElement.clientHeight
      })
      window.addEventListener('keyup', function (event) {
        if (event.key == 'Enter') {
          _this.login('login')
        }
      })

      //进来先判断，上次登录是否勾选了自动登录和记住密码
      //勾选了记住密码
      this.loginForm.username = JSON.parse(window.localStorage.getItem("username"))
      const autoL = JSON.parse(window.localStorage.getItem("autoLogin"))
      if (autoL === true) {
        this.autoLogin = autoL
        this.loginForm.password = 'password'
        this.loginForm.verifyPass = 'password'
        if (parseInt(this.$route.query.autoL) !== 2) {
          setTimeout(() => {
            this.login_success()
          }, 1500)
        }
      }
    }
  }
</script>

<style scoped>

  #loginBox {
    position: relative;
    width: 100%;
    background: url("../assets/imgs/login.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .login[login] {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 400px;
    height: 500px;
  }

  .login [avatar] {
    position: absolute;
    top: -40px;
    left: 40%;
  }

  .login .form[form] {
    margin-top: 40px;
  }

  .login .form [tip] > p {
    line-height: 1.5em;
    margin: 0;
    padding: 0;
    color: #C0C4CC;
    animation: tip 0.8s ease;
  }

  @keyframes tip {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  [marginBottom] {
    margin-bottom: 0;
  }

  [register="true"] a {
    float: right;
    margin-top: 0;
    margin-bottom: 10px;
    margin-left: 10px;
    text-decoration: none;
    color: #606266;
  }

  [register="true"] a:nth-child(1):hover {
    color: #409EFF;
  }

  [register="true"] a:nth-child(2):hover {
    color: #E6A23C;
  }
</style>