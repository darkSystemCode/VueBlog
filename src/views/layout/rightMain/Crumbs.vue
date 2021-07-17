<template>
  <el-breadcrumb separator-class="el-icon-d-arrow-right" class="crumbs" crumbs>
    <transition-group name="crumbsTran" tag="span">
      <template v-for="item in getCrumbs">
        <el-breadcrumb-item v-if="item != ''" class="list" :key="String(item)">{{item}}</el-breadcrumb-item>
      </template>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "Crumbs",
    data() {
      return {

      }
    },
    computed: {
      ...mapGetters({
        getCrumbs: 'header/Crumbs'
      })
    }
  }
</script>

<style scoped>

  .crumbs[crumbs] {
    position: absolute;
    left: 50px;
    width: auto;
    max-width: 500px;
    height: 60px;
    line-height: 60px;
    text-align: left;
  }

  .crumbsTran-enter {
    transform: translateX(1rem);
    opacity: 1;
  }

  .crumbsTran-leave-to {
    transform: translateX(2rem);
    opacity: 0;
  }

  .crumbsTran-enter-active {
    transition: all .5s ease-out;
  }

  .crumbsTran-leave-active {
    transition: all .3s ease;
  }
</style>