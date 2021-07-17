<template>
  <div>
    <div style="margin: 5px 0 15px 0">
      <el-button type="primary" icon="el-icon-plus" circle @click="visible(true)"></el-button>
      <span style="color: #C0C4CC"><i class="el-icon-back"></i>生成导航栏请点这</span>
    </div>
    <el-dialog title="添加导航标题" :visible.sync="dialogVisible" :close-on-click-modal="false" width="40%">
      <CreateNav v-if="dialogVisible" @child-result="getResult" :parentNav="navData"></CreateNav>
    </el-dialog>
    <el-table
      :data="navData.length ==0?[]:navData"
      style="width: 100%"
      :row-key="getRowKeys"
      border
      lazy
      :load="load"
      ref="table"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="title"
        label="导航名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="导航路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="navDesc"
        label="导航描述">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deleteRow(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import CreateNav from "./CreateNav";

  export default {
    name: "SetNav",
    data() {
      return {
        dialogVisible: false,
        navData: [],
        index: 1
      }
    },
    methods: {
      getNav() {
        this.$requestGET({url: '/getNav'}).then(res => {
          if (res.code === 200) {
            this.navData = res.data
          }
        })
      },
      //返回表格table 树的唯一ID
      getRowKeys(row) {
        return row.nid == undefined ? row.ncid + "." + row.nid : row.nid;
      },
      /**
       * 设置导航（父，子导航）
       * obj: {
          type: 导航类型 1 父导航 2 子导航
          name: 导航名称
          path: 导航路径
          desc: 导航描述
          parent: 父类导航ID
         }
       * 1.每次插入导航成功后，会返回自增长ID，用于表示当前导航，或者用于后期的删除导航操作
       * 2.添加操作完成后，把当前数据响应式的追加到navData数组或者数组的children中，保证页面级的数据同步性
       * */
      getResult(obj) {
        if (obj.type === '1') {
          this.$requestPOST({
            url: '/setNav',
            data: {
              title: obj.title,
              path: obj.path,
              navDesc: obj.desc
            }
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              //添加导航成功添加数据到navData中
              this.navData.push({
                title: obj.title,
                path: obj.path,
                navDesc: obj.desc,
                children:[],
                hasChildren: false,
                nid: res.data
              })
              // this.getNav()
              this.dialogVisible = false
            } else if (res.code === 4000) {
              this.$message.error(res.msg)
            }
          })
        } else {
          this.$requestPOST({
            url: '/setChildNav',
            data: {
              navNumber: obj.parent,
              title: obj.title,
              path: obj.path,
              navDesc: obj.desc
            }
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: res.msg
              })
              //把导航数据添加到父导航的children中
              let item = new Object()
              item.title = obj.title
              item.path = obj.path
              item.desc = obj.desc
              item.navNumber = obj.parent
              item.ncid = res.data
              for (let items of this.navData) {
                if(items.nid == obj.parent) {
                  if(items.children == null) {
                    items.children = []
                  }
                  items.hasChildren = true
                  this.$set(items.children, items.children.length, item)
                  this.dialogVisible = false
                  break
                }
              }
            } else if (res.code === 4000) {
              this.$message.error(res.msg)
            }
          })
        }
      },
      /**
       * 异步加载子导航
       * tree:当前树结构
       * treeNode：当前树结构的节点，可以操作数据
       * resolve:函数返回异步加载的数据
       * */
      load(tree, treeNode, resolve) {
        this.$requestGET({url: '/getChildNav', data: {parentIndex: tree.nid}}).then(res => {
          if (res.code === 200) {
            //通过ID请求子导航 保证数据的真实
            for (let item of this.navData) {
              if (item.nid == tree.nid) {
                item.children = res.data
                resolve(item.children)
              }
            }
          }
        })
      },
      /**
       * 删除当前行记录数据
       * 1.删除父级导航，如果该导航存在子导航，则弹窗提示，依旧要删除则会删除当前导航下的所有子导航，否则只删除当前导航
       * 2.删除父级导航下的子导航，通过该子导航的id(ncid)进行删除持久化数据
       * 3.删除导航数据后，都需要进行响应式的页面级的局部刷新，不连接数据库数据，但依旧可以保证数据的一致性，专业保证了数据的一致性下，得到了性能的优化
       * index: 行好
       * row: 当前行的全部数据
       * */
      deleteRow(index, row) {
        let parentID = null
        let childID = null
        if (row.nid !== undefined) {
          parentID = row.nid
        } else {
          parentID = row.navNumber
          childID = row.ncid
        }
        if (parentID != null && childID == null) {
          if(!row.hasChildren) {
            //删除父导航
            this.$requestGET({url: '/deleteParentNav/' + parentID}).then(res => {
              if (res.code === 200) {
                //响应式删除数据，只针对当前请求到的导航数据进行响应式的删除，不触碰数据库的数据（但是依旧保持了数据的一致性）==》页面层次
                this.navData = this.navData.filter(item => {
                  return item.title != row.title
                })
                this.$message({
                  type: 'success',
                  message: '删除' + row.title + '导航成功！'
                })
              }
            })
          } else {
            this.$confirm('当前"'+row.title+'"导航存在子导航，是否确定全部删除？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.$requestGET({url: '/deleteAllNav/' + parentID}).then(res => {
                if(res.code === 200) {
                  this.navData = this.navData.filter(item => {
                    return item.nid != parentID
                  })
                  this.$message({
                    type: 'success',
                    message: '全部删除成功!'
                  });
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            })
          }
        } else {
          //删除子导航
          this.$requestGET({url: '/deleteChildNav/' + childID}).then(res => {
            if (res.code === 200) {
              //删除父导航下的子导航--响应式的删除 但保证数据的一致性
              for(let items of this.navData) {
                if(items.nid == parentID) {
                  items.children = items.children.filter(childs => {
                    return childs.ncid != childID
                  })
                  this.refreshData(parentID, items.children)
                }
              }
              this.$message({
                type: 'success',
                message: '删除' + row.title + '子导航成功！'
              })
            }
          })
        }
      },
      /**
       * 局部刷新表格树形数据
       * id: 父级的ID
       * data： 需要局部刷新的数据（这里只是局部刷新父级ID下的子导航数据childrenData）
       * */
      refreshData(id, data) {
        this.$set(this.$refs.table.store.states.lazyTreeNodeMap, id, data)
      },
      visible(state) {  //state: 是否打开dialog level：当前的导航级数
        this.dialogVisible = state
      }
    },
    created() {
      this.getNav()
    },
    components: {
      CreateNav
    }
  }
</script>

<style scoped>
  .demo-dynamic {
    width: 460px;
  }

  .codeShow {
    background-color: #C0C4CC;
  }
</style>