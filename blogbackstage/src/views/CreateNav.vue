<template>
  <el-form ref="form" :model="form" :rules="rules" status-icon label-width="80px" :inline="true">
    <el-form-item label="标题" prop="name">
      <el-input v-model="form.name" clearable placeholder="请输入导航标题" autofocus></el-input>
    </el-form-item>
    <el-form-item label="路径" prop="path">
      <el-input v-model="form.path" clearable placeholder="请输入全英文的导航路径"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onCreate('form')">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: "CreateNav",
    data() {
      const validatorName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入导航标题"))
        } else {
          callback()
        }
      };
      const validatorPath = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入导航路径，路径不能为空"))
        } else if (!(/^[a-zA-Z]+$/.test(value))) {
          callback(new Error("路径只能由英文组成"))
        } else {
          callback()
        }
      }
      return {
        form: {
          name: '',
          path: '',
          level: '',
          openChildren: false
        },
        rules: {
          name: [
            {validator: validatorName, trigger: 'blur'}
          ],
          path: [
            {validator: validatorPath, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      onCreate(form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            this.$emit('chil-result', this.form.name, "/" + this.form.path)
          } else {
            this.$message({
              duration: 2000,
              type: "error",
              message: "校验错误，请重新填写"
            })
            return false
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>