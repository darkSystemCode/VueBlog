<template>
  <div>
    <div class="block">
      <span class="demonstration">默认</span>
      <el-slider v-model="value1"></el-slider>
    </div>
    <div class="block">
      <span class="demonstration">自定义初始值</span>
      <el-slider v-model="value2"></el-slider>
    </div>
    <div class="block">
      <span class="demonstration">隐藏 Tooltip</span>
      <el-slider v-model="value3" :show-tooltip="false"></el-slider>
    </div>
    <div class="block">
      <span class="demonstration">格式化 Tooltip</span>
      <el-slider v-model="value4" :format-tooltip="formatTooltip"></el-slider>
    </div>
    <div class="block">
      <span class="demonstration">禁用</span>
      <el-slider v-model="value5" disabled></el-slider>
    </div>

    <div class="block">
      <span class="demonstration">不显示间断点</span>
      <el-slider
        v-model="value6"
        :step="10">
      </el-slider>
    </div>
    <div class="block">
      <span class="demonstration">显示间断点</span>
      <el-slider
        v-model="value7"
        :step="10"
        show-stops>
      </el-slider>
    </div>

    <p>竖向滑动条</p>
    <div class="block">
      <el-slider
        v-model="value8"
        vertical
        height="200px">
      </el-slider>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Slider",
    data() {
      return {
        value1: 0,
        value2: 50,
        value3: 36,
        value4: 48,
        value5: 42,
        value6: 95,
        value7: 10,
        value8: 0
      }
    },
    methods: {
      formatTooltip(val) {
        return val / 100;
      }
    }
  }
</script>

<style scoped>

</style>