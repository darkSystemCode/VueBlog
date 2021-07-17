<template>
  <div class="container">
    <!--对当前窗体进行分类添加，默认为添加父类导航，可以通过radio选择添加子类导航，如果选择添加子类导航，则需要定位父类（即子类在哪个父类导航下）-->
    <div class="radioG">
      <el-radio-group v-model="radioGroup">
        <el-radio label="1" border>父类导航</el-radio>
        <el-radio label="2" border>子类导航</el-radio>
      </el-radio-group>
    </div>
    <el-form ref="form" :model="form" :rules="rules" status-icon label-width="80px">
      <div v-if="radioGroup == '1'">
        <el-form-item label="名称" prop="name" >
          <el-input v-model="form.name" clearable placeholder="请输入导航名称"></el-input>
        </el-form-item>
      </div>
      <div v-else>
        <div class="tip">
          <p>父级导航：用于定位当前需要添加的子导航归属于那个导航分类下。</p>
        </div>
        <el-form-item label="父导航" prop="parent">
          <el-select v-model="form.parent" placeholder="请选择父级导航" style="width: 100%">
            <el-option
              v-for="item in getParentNav"
              :key="item.nid"
              :label="item.title"
              :value="item.nid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子名称" prop="name">
          <el-input v-model="form.name" clearable placeholder="请输入子导航名称"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path" clearable placeholder="请输入全英文的导航路径"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input type="textarea" v-model="form.desc" maxlength="20" show-word-limit clearable
                  placeholder="请输入导航的描述"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onCreate('form')">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "CreateNav",
    props: {
      parentNav: {
        type: Array,
        required: true
      }
    },
    computed: {
      getParentNav() {
        return this.parentNav
      }
    },
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
      };
      const validatorParent = (rule, value, callback) => {
        if(value === '') {
          callback(new Error("请选择父导航"))
        } else {
          callback()
        }
      }
      return {
        radioGroup: '1',
        form: {
          name: '',
          path: '',
          desc: '',
          level: '',
          parent: '',
          openChildren: false
        },
        rules: {
          name: [
            {required: true, validator: validatorName, trigger: 'blur'}
          ],
          path: [
            {required: true, validator: validatorPath, trigger: 'blur'}
          ],
          parent: [
            {required: true, validator: validatorParent, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      onCreate(form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            //把弹窗输入的数据传给父组件 如果选择类型是子导航 则需要再添加一个parent项
            let obj = new Object()
            obj.type = this.radioGroup
            obj.title = this.form.name
            obj.path = "/" + this.form.path
            obj.desc = this.form.desc
            if(this.radioGroup === '2') {
              obj.parent = this.form.parent
            }
            this.$emit('child-result', obj)
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
  .container {
    width: 100%;
    margin: 0 auto;
  }

  .radioG {
    text-align: center;
    margin-bottom: 20px;
  }

  .tip {
    padding-left: 15px;
    color: #C0C4CC;
    margin-bottom: 25px;
  }
</style>