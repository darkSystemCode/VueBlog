<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="crumbs" crumbs>
    <transition-group name="list" tag="span">
      <template v-for="item in crumbs">
        <el-breadcrumb-item v-if="item != ''" class="list" :key="String(item)">{{item}}</el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: "Crumbs",
    props: {
      crumbs: Array
    }
  }
</script>

<style scoped>

  .crumbs[crumbs] {
    position: absolute;
    left: 50px;
    width: 400px;
    max-width: 500px;
    height: 60px;
    line-height: 60px;
    text-align: left;
  }

  .list-enter, .list-leave-to{
    /*transform: translateX(30px);*/
    opacity: 0;
  }

  .list-enter-active {
    transition: all 1s ease;
  }

</style>