<template>
  <div>
    <Perms :permsC.sync="this.addPerms"
           :rolesC.sync="this.addRoles"
           :refreshPerms="this.refreshPerms"
           :refreshRoles="this.refreshRoles"
           @perms_open="permsOpen"
           @roles_open="rolesOpen">
    </Perms>

    <el-divider></el-divider>

    <el-row style="margin-top: 15px">
      <el-col :span="24">
        <el-button type="success" plain @click="addAccountFun">添加账号</el-button>
        <el-table
            :data="userData"
            style="width: 100%">
          <el-table-column
              label="加入时间"
              width="210">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.createTime | format }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="username"
              label="用户名"
              width="180">
          </el-table-column>
          <el-table-column
              prop="email"
              label="邮箱"
              width="200">
          </el-table-column>
          <el-table-column
              prop="perms"
              label="拥有权限"
              width="100"
              :filters="perms"
              :filter-method="filterPerms"
              filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                  :type="scope.row.perms === 'vip' ? 'success' : 'info'"
                  disable-transitions>{{ scope.row.perms }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="roles"
              label="拥有角色"
              width="100"
              :filters="roles"
              :filter-method="filterRoles"
              filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                  :type="scope.row.roles === 'admin' ? 'primary' : 'success'"
                  disable-transitions>{{ scope.row.roles }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  @click="editAccountFun(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="delAccountFun(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- dialog编辑账号信息对话框 -->
    <el-dialog title="编辑账号信息" :visible.sync="editAccount" width="50%" :close-on-click-modal="false">
      <el-form :model="userForm" :rules="formRules" ref="form" label-width="80px">
        <el-form-item label="加入时间">
          <el-input :value="userForm.createTime | format" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="perms">
          <el-select v-model="userForm.perms">
            <el-option v-for="(item, index) in perms"
                       :key="index" :label="item.text"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="userForm.roles">
            <el-option v-for="(item, index) in roles"
                       :key="index" :label="item.text"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="editAccountInfo('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加账号dialog -->
    <el-dialog title="添加账号" :visible.sync="addAccount" width="50%" :close-on-click-modal="false"
               @close="closeAccount('addAForm')">
      <el-form :model="addAccountForm" :rules="addAFRules" ref="addAForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addAccountForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addAccountForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="confirmPass">
          <el-input v-model="addAccountForm.confirmPass" placeholder="再次确认密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :error="emailError">
          <el-input v-model="addAccountForm.email" placeholder="请输入邮箱" @blur="blurEmail"></el-input>
        </el-form-item>
        <el-form-item label="拥有权限" prop="perms">
          <el-select v-model="addAccountForm.perms">
            <el-option v-for="(item, index) in perms"
                       :key="index" :label="item.text"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拥有角色" prop="roles">
          <el-select v-model="addAccountForm.roles">
            <el-option v-for="(item, index) in roles"
                       :key="index" :label="item.text"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitAccount('addAForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加权限 -->
    <el-dialog title="添加权限" :visible.sync="addPerms" width="40%" @close="closePermsDialog('permsForm')">
      <el-form :model="permsForm" :rules="rulePerms" ref="permsForm">
        <el-form-item label="权限名" prop="permsName">
          <el-input v-model="permsForm.permsName" autofocus placeholder="请输入正确的权限名"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="permsDesc">
          <el-input v-model="permsForm.permsDesc" placeholder="请输入权限对应的描述，方便理解"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="success" @click="submitPerms('permsForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoles" width="40%" @close="closeRolesDialog('rolesForm')">
      <el-form :model="rolesForm" :rules="ruleRoles" ref="rolesForm">
        <el-form-item label="角色名" prop="rolesName">
          <el-input v-model="rolesForm.rolesName" autofocus placeholder="请输入正确的角色名"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="rolesDesc">
          <el-input v-model="rolesForm.rolesDesc" placeholder="请输入角色对应的描述，方便理解"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="success" @click="submitRoles('rolesForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <Paging :total="userTotal" :pageSize="userSize" @curr-page="userCurrPageFun"></Paging>
  </div>
</template>

<script>
import Paging from "../../../components/Paging";
import formatTime from "../../../utils/formatTime";
import Perms from "@/views/components/Perms";

export default {
  name: "User",
  data() {
    const valiEmail = (rule, value, callback) => {
      if (value === '') {
        callback("请输入邮箱账号")
      } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback("请输入正确的邮箱账号")
      } else {
        callback()
      }
    };
    const valiPassw = (rule, value, callback) => {
      if (value === '') {
        callback('确认密码不能为空')
      } else if (value != this.addAccountForm.password) {
        callback('两次密码不一致，请重新输入')
      } else {
        callback()
      }
    }
    return {
      userData: [],
      perms: [],
      roles: [],
      userTotal: 0,
      userSize: 3,
      userCurrPage: 1,
      userForm: {
        uid: '',
        createTime: '',
        username: '',
        email: '',
        perms: '',
        roles: ''
      },
      formRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'change'}],
        email: [{required: true, validator: valiEmail, trigger: 'change'}],
        perms: [{required: true, message: '权限不能为空', trigger: 'change'}],
        roles: [{required: true, message: '角色不能为空', trigger: 'change'}]
      },
      addAccountForm: {
        username: '',
        password: '',
        confirmPass: '',
        email: '',
        perms: '',
        roles: ''
      },
      addAFRules: {
        username: [{required: true, message: '请输入用户名', trigger: ['blur', 'change']}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        confirmPass: [{required: true, validator: valiPassw, trigger: 'blur'}],
        email: [{required: true, validator: valiEmail, trigger: 'blur'}],
        perms: [{required: true, message: '权限不能为空', trigger: ['blur', 'change']}],
        roles: [{required: true, message: '角色不能为空', trigger: ['blur', 'change']}]
      },
      permsForm: {
        permsName: '',
        permsDesc: ''
      },
      rulePerms: {
        permsName: [{required: true, message: '权限名不能为空', trigger: ['blur', 'change']}],
        permsDesc: [{required: true, message: '权限描述不能为空', trigger: ['blur', 'change']}]
      },
      rolesForm: {
        rolesName: '',
        rolesDesc: ''
      },
      ruleRoles: {
        rolesName: [{required: true, message: '角色名不能为空', trigger: ['blur', 'change']}],
        rolesDesc: [{required: true, message: '角色描述不能为空', trigger: ['blur', 'change']}]
      },
      oldForm: '',
      newForm: '',
      emailError: '',
      childPage: 0,
      childPageSize: 0,
      editAccount: false,
      addAccount: false,
      addPerms: false,
      addRoles: false,
      refreshPerms: '',
      refreshRoles: ''
    }
  },
  filters: {
    format(value) {
      return formatTime(value, "yyyy-MM-dd hh:mm:ss")
    }
  },
  methods: {
    //编辑账号信息
    editAccountFun(index, row) {
      this.editAccount = true
      this.userForm.createTime = row.createTime
      this.userForm.username = row.username
      this.userForm.email = row.email
      this.userForm.perms = row.perms
      this.userForm.roles = row.roles
      this.oldForm = JSON.stringify(this.userForm)
      this.getPermsAndRoles()
    },
    /**
     * 删除账号信息
     * @params:
     *  userID： 被删除的用户id
     *  page： 当前页页码
     *  pageSize: 当前页展示记录数
     * @return
     *  user 删除后的用户记录
     *  userCurrPage 当前页码
     *  userTotal 删除后的用户总数
     */
    delAccountFun(index, row) {
      let result = this.userData.filter(item => {
        return item.username == row.username
      })
      this.$requestGET({
        url: '/user/delUserAccount/'+ result[0].userID + '?page=' + this.userCurrPage + "&pageSize=" + this.userSize
      }).then(res => {
        if(res.code === 200 && res.type === 'success') {
          this.userData = res.data.user
          this.userCurrPage = res.data.userCurrPage
          this.userTotal = res.data.count
          this.$message({
            message: '删除成功！',
            type: res.type
          })
          return
        }
        this.$message({
          message: '错误代码：' + res.code + "错误信息：" + res.msg,
          type: res.type
        })
      })
    },
    //过滤角色
    filterRoles(value, row) {
      return row.roles === value
    },
    //过滤权限
    filterPerms(value, row) {
      return row.perms === values
    },
    //保存修改后的账号信息
    editAccountInfo(form) {
      this.newForm = this.userForm
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.oldForm != JSON.stringify(this.newForm)) {
            //在userData中筛选出符合条件的数据 抽取出userID
            let result = this.userData.filter(item => {
              return item.username == this.userForm.username
            })
            this.$requestPOST({
              url: '/user/editUserInfo/' + result[0].userID + "?page=" + this.userCurrPage + "&pageSize=" + this.userSize,
              data: this.userForm
            }).then(res => {
              if (res.type == 'error') {
                this.$message.error("错误代码：+" + res.code + " " + "保存用户信息错误！")
              }
              this.userData = res.data.user
              this.userCurrPage = res.data.userCurrPage
              //修改页面不会造成数据库记录的增删 所以不再设置记录总数
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.editAccount = false
            })
          } else {
            this.$message({
              message: '没有修改信息，不允许保存！',
              type: 'info'
            })
          }
        } else {
          this.$message.error("校验未通过！")
        }
      })
    },
    //添加账号
    addAccountFun() {
      this.addAccount = !this.addAccount
      //每次打开添加账号窗口时 获取最新的权限和角色
      this.getPermsAndRoles()
    },
    //添加权限
    permsOpen(value, page, pageSize) {
      this.addPerms = value
      this.childPage = page
      this.childPageSize = pageSize
    },
    //添加角色
    rolesOpen(value, page, pageSize) {
      this.addRoles = value
      this.childPage = page
      this.childPageSize = pageSize
    },
    closeAccount(addAFprm) {
      //在关闭dialog时 清空dialog里的form表单 保持表单默认值
      this.$refs[addAFprm].resetFields()
    },
    closePermsDialog(permsForm) {
      //在关闭dialog时 清空dialog里的form表单 保持表单默认值
      this.$refs[permsForm].resetFields()
    },
    closeRolesDialog(rolesForm) {
      //在关闭dialog时 清空dialog里的form表单 保持表单默认值
      this.$refs[rolesForm].resetFields()
    },
    //Email输入框失去焦点时触发，用于校验当前email是否在数据库中存在，如果存在则提示用户修改，否则校验通过
    blurEmail() {
      this.$requestGET({
        url: '/user/checkEmail/' + this.addAccountForm.email
      }).then(res => {
        if (res.code === 201 && res.type == 'error') {
          this.emailError = res.msg
        }
      })
    },
    /**
     *提交账号
     * 如果校验通过，则提交账号请求
     * params:
     *   userAccountForm: 账号表单
     *   page: 当前页码
     *   pageSize: 当前页展示的记录数
     * return:
     *   success:
     *     user: 返回添加成功用户信息后的当前页记录（后台会判断当前添加成功的记录属于第几页，并返回当前页记录）
     *     count: 数据库中总账号记录数
     *     userCurrPage: 当前页码
     */
    submitAccount(addAFrom) {
      this.$refs[addAFrom].validate(valid => {
        if (valid) {
          this.$requestPOST({
            url: '/user/addAccount' + "?page=" + this.userCurrPage + "&pageSize=" + this.userSize,
            data: {
              username: this.addAccountForm.username,
              password: this.addAccountForm.password,
              email: this.addAccountForm.email,
              perms: this.addAccountForm.perms,
              roles: this.addAccountForm.roles
            }
          }).then(res => {
            if (res.code !== 200 && res.type !== 'success') {
              this.$message({
                message: '错误代码：' + res.code + "错误内容：" + res.msg,
                type: res.type
              })
            }
            this.userData = res.data.user
            this.userTotal = res.data.count
            this.userCurrPage = res.data.userCurrPage
            this.$message({
              message: res.msg,
              type: res.type
            })

            this.addAccount = !this.addAccount
          })
        } else {
          this.$message.error("校验未通过，请校对！")
        }
      })
    },
    /**
     * 用户账号分页控制器页码发生变化时触发，传入当前页码分页形式查询并展示记录
     * params:
     *  page: 当前页码
     *  pageSize: 当前页展示记录数
     *  return:
     *    user: 当前页码记录数
     *    count: 账号记录总数
     *    userCurrPage: 当前页码
     */
    userCurrPageFun(page) {
      this.$requestGET({
        url: '/user/getUser?page=' + page + "&pageSize=" + this.userSize
      }).then(res => {
        if (res.code !== 200 && res.type !== 'success') {
          this.$message({
            message: '错误代码：' + res.code + "错误内容：" + res.msg,
            type: res.type
          })
        }
        this.userData = res.data.user
        this.userTotal = res.data.count
        this.userCurrPage = res.data.userCurrPage
      })
    },
    //提交权限
    submitPerms(permsForm) {
      //提交权限
      this.$refs[permsForm].validate(valid => {
        if (valid) {
          //提交
          this.$requestPOST({
            url: '/user/setPerms?page=' + this.childPage + "&pageSize=" + this.childPageSize,
            data: {
              permsName: this.permsForm.permsName,
              permsDesc: this.permsForm.permsDesc
            }
          }).then(res => {
            if (res.code === 200 && res.type == 'success') {
              let obj = new Object();
              obj.perms = res.data.perms
              obj.permsSize = res.data.permsSize
              obj.permsCurrPage = res.data.permsCurrPage
              this.refreshPerms = obj
              this.$message({
                message: res.msg,
                type: res.type
              })
              this.addPerms = !this.addPerms
            }
          })
        } else {
          this.$message.error("校验未通过，请正确填写")
        }
      })
    },
    /**
     * 提交角色
     * @param rolesForm
     */
    submitRoles(rolesForm) {
      //提交角色
      this.$refs[rolesForm].validate(valid => {
        if (valid) {
          //提交
          this.$requestPOST({
            url: '/user/setRoles?page=' + this.childPage + "&pageSize=" + this.childPageSize,
            data: {
              rolesName: this.rolesForm.rolesName,
              rolesDesc: this.rolesForm.rolesDesc
            }
          }).then(res => {
            if (res.code === 200 && res.type == 'success') {
              let obj = new Object();
              obj.roles = res.data.roles
              obj.rolesSize = res.data.rolesSize
              obj.rolesCurrPage = res.data.rolesCurrPage
              this.refreshRoles = obj
              this.$message({
                message: res.msg,
                type: res.type
              })
              this.addRoles = !this.addRoles
            }
          })
        } else {
          this.$message.error("校验未通过，请正确填写")
        }
      })
    },
    //获得权限和角色方法
    getPermsAndRoles() {
      this.$requestGET({
        url: '/user/getPerms'
      }).then(res => {
        if (res.code === 200) {
          //每次清空旧数组 避免push（）重复
          this.perms.splice(0, this.perms.length)
          this.roles.splice(0, this.roles.length)
          for (let item of res.data[0]) {
            let obj = new Object()
            obj.text = item.permsName
            obj.value = item.permsName
            this.perms.push(obj)
          }
          for (let item of res.data[1]) {
            let obj = new Object()
            obj.text = item.rolesName
            obj.value = item.rolesName
            this.roles.push(obj)
          }
        }
      })
    }
  },
  mounted() {
    //页面渲染时，得到全部用户的数据
    this.$requestGET({url: '/user/getUser?page=' + this.userCurrPage + '&pageSize=' + this.userSize}).then(res => {
      this.userData = res.data.user
      this.userTotal = res.data.count
    })
  },
  components: {
    Paging,
    Perms
  }
}
</script>

<style scoped>

</style>