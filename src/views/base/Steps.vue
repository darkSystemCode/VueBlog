<template>
  <div>
    <h3>付款流程</h3>
    <el-steps :active="active" finish-status="success">
      <el-step title="未付款"></el-step>
      <el-step title="已付款"></el-step>
      <el-step title="已完成"></el-step>
    </el-steps>
    <el-button @click="nextStep">next</el-button>

    <h3>流程指导</h3>
    <el-steps :active="active_two" finish-status="success">
      <el-step title="填写用户信息"></el-step>
      <el-step title="已付款"></el-step>
      <el-step title="已完成"></el-step>
    </el-steps>
    <template v-if="active_two==1">
      <div class="container">
        <el-form :model="form" :rules="ruleForm" ref="form" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="form.sex" placeholder="请输入性别"></el-input>
          </el-form-item>
          <el-form-item label="个人介绍" prop="introduce">
            <el-input v-model="form.introduce" type="textarea" placeholder="请输入个人介绍"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nextS('form')">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template v-if="active_two == 2">
      <div class="container">
        <h4>请确认信息的完整性</h4>
        <p><span>username: </span><span>{{this.form.username}}</span></p>
        <p><span>sex: </span><span>{{this.form.sex}}</span></p>
        <p><span>introduce: </span><span>{{this.form.introduce}}</span></p>
        <el-button type="info" @click="pre">上一步</el-button>
        <el-button type="primary" @click="success">确认</el-button>
      </div>
    </template>
    <template v-if="active_two == 3">
      <div class="container">
        <h3><i class="fa fa-meh-o"></i>用户信息已提交</h3>
        <el-button type="primary">查看用户信息</el-button>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: "Steps",
    data() {
      return {
        active: 1,
        active_two: 1,
        form: {
          username: '',
          sex: '',
          introduce: ''
        },
        ruleForm: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '性别不能为空', trigger: 'blur'}
          ],
          introduce: [
            {required: true, message: '个人介绍不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      nextStep() {
        this.active++
        if(this.active === 4) {
          this.active = 1
        }
      },
      nextS(form) {
        this.$refs[form].validate( state => {
          if(state) {
            this.active_two = 2
          }
        })
      },
      pre() {
        this.active_two = 1
      },
      success() {
        this.active_two = 3
      }
    }
  }
</script>

<style scoped>

  .container {
    width: 40%;
    margin: 0 auto;
    text-align: center;
  }
</style>