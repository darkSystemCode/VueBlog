<template>
  <!-- 分页控制器 如果只有一页不显示分页控制器 params: :current-page: 当前页码，:page-size: 分页总页数， :total: 总记录数 如果需要监听页码的改变，接受curr-page方法即可 -->
  <el-pagination
      v-if="total <= pageSize? false: true"
      :current-page.sync="curr_page"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="currentC"
      class="footer">
  </el-pagination>
</template>

<script>
export default {
  name: "Paging",
  props: {
    currPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    }
  },
  watch: {
    currPage: function (newValue, oldValue) {
      this.curr_page = newValue
    }
  },
  data() {
    return {
      curr_page: 1
    }
  },
  methods: {
    //当前页发生改变时触发
    currentC(page) {
      this.$emit('curr-page', page)
    }
  }
}
</script>

<style scoped>
.footer {
  text-align: center;
}
</style>