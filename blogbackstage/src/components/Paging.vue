<template>
  <el-pagination
    :page-size="10"
    layout="total, prev, pager, next"
    :total="total"
    @current-change="currentC"
    :style="{textAlign: 'center'}">
  </el-pagination>
</template>

<script>
  export default {
    name: "Paging",
    props: {
      total: {
        type: Number,
        required: true
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

</style>