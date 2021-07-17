<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="always" class="col_card">
          <el-row>
            <el-col :span="6" class="col_btn">
              <div class="col_btn_div">
                <el-button type="primary" @click="addPermsFun" class="perms">添加权限</el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <el-table :data="permsTable"
                        style="width: 100%"
                        max-height="300"
                        :fit="true"
                        empty-text="本来无一物，何处惹尘埃。">
                <el-table-column
                    prop="permsName"
                    label="权限名"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="permsDesc"
                    label="权限描述">
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="delPerms(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <Paging :total="permsTotal" :pageSize="pageSize" :currPage.sync="permsCurrPage" @curr-page="currPermsPage"></Paging>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" class="col_card">
          <el-row>
            <el-col :span="6" class="col_btn">
              <div class="col_btn_div">
                <el-button type="primary" @click="addRolesFun" class="roles">添加角色</el-button>
              </div>
            </el-col>
            <el-col :span="18">
              <el-table :data="rolesTable"
                        style="width: 100%"
                        max-height="300"
                        empty-text="本来无一物，何处惹尘埃。">
                <el-table-column
                    prop="rolesName"
                    label="角色名"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="rolesDesc"
                    label="角色描述">
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="danger"
                        @click="delRoles(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <Paging :total="rolesTotal" :pageSize="pageSize" :currPage.sync="rolesCurrPage" @curr-page="currRolesPage"></Paging>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Paging from "@/components/Paging";

export default {
  name: "Perms",
  props: {
    permsC: {
      type: Boolean,
      required: true,
      default: false
    },
    rolesC: {
      type: Boolean,
      required: true,
      default: false
    },
    refreshPerms: {
      required: true
    },
    refreshRoles: {
      required: true
    }
  },
  data() {
    return {
      permsCurrPage: 1,
      rolesCurrPage: 1,
      permsTotal: 0,
      rolesTotal: 0,
      // page: 1, //默认页数
      pageSize: 3, //表显示总数
      permsTable: [],
      rolesTable: []
    }
  },
  watch: {
    refreshPerms: function(newValue, oldValue) {
      this.permsTable = newValue.perms
      this.permsTotal = newValue.permsSize
      this.permsCurrPage = newValue.permsCurrPage
    },
    refreshRoles: function(newValue) {
      this.rolesTable = newValue.roles
      this.rolesTotal = newValue.rolesSize
      this.rolesCurrPage = newValue.rolesCurrPage
    }
  },
  methods: {
    getPerms(page) {
      this.$requestGET({
        url: '/user/getPerms/' + page + "/" + this.pageSize
      }).then(res => {
        if (res.code === 200 && res.type == 'success') {
          //权限
          this.permsTable = res.data.perms
          this.permsTotal = res.data.permsSize
        } else {
          this.$message({
            message: this.msg,
            type: this.type
          })
        }
      })
    },
    getRoles(page) {
      this.$requestGET({
        url: '/user/getRoles/' + page + "/" + this.pageSize
      }).then(res => {
        if (res.code === 200 && res.type == 'success') {
          //角色
          this.rolesTable = res.data.roles
          this.rolesTotal = res.data.rolesSize
        } else {
          this.$message({
            message: this.msg,
            type: this.type
          })
        }
      })
    },
    //添加权限
    addPermsFun() {
      this.$emit('perms_open', true, this.permsCurrPage, this.pageSize)
    },
    //添加角色
    addRolesFun() {
      this.$emit('roles_open', true, this.rolesCurrPage, this.pageSize)
    },
    currPermsPage(currPage) {
      this.permsCurrPage = currPage
      this.getPerms(currPage)
    },
    currRolesPage(currPage) {
      this.rolesCurrPage = currPage
      this.getRoles(currPage)
    },
    delPerms(row) {
      this.$requestGET({
        url: '/user/delPerms/' + row.permsName +"?page=" + this.permsCurrPage +"&pageSize=" + this.pageSize
      }).then(res => {
        if(res.code === 200 && res.type == 'success') {
          //权限
          this.permsTable = res.data.perms
          this.permsTotal = res.data.permsSize
          if(this.permsTotal % 3 ==0) {
            this.permsCurrPage -= 1
          }
          this.$message({
            message: res.msg,
            type: res.type
          })
        } else {
          this.$message({
            message: res.msg,
            type: res.type
          })
        }
      })
    },
    delRoles(row) {
      this.$requestGET({
        url: '/user/delRoles/' + row.rolesName + "?page=" + this.rolesCurrPage + "&pageSize=" + this.pageSize
      }).then(res => {
        if(res.code === 200 && res.type == 'success') {
          //角色
          this.rolesTable = res.data.roles
          this.rolesTotal = res.data.rolesSize
          if(this.rolesTotal % 3 ==0) {
            this.rolesCurrPage -= 1
          }
          this.$message({
            message: res.msg,
            type: res.type
          })
        } else {
          this.$message({
            message: res.msg,
            type: res.type
          })
        }
      })
    }
  },
  mounted() {
    this.getPerms(this.permsCurrPage)
    this.getRoles(this.rolesCurrPage)
  },
  components: {
    Paging
  }
}
</script>

<style scoped>
.perms, .roles {
  width: 100px;
  height: 100px;
  border-radius: 100px;
}

.col_card {
  position: relative;
  height: 300px;
  max-height: 300px;
}

.div_flex {
  display: flex;
  flex-direction: column;
}

.col_btn {
  padding: 20px;
}

.col_btn_div {
  width: 100%;
  height: 150px;
  line-height: 150px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0px 0px 3px 1px #C0C4CC;
}

</style>