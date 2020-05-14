<template>
  <div class="waterFall-box" :style="{height: height+'px'}">
    <div class="img-box" v-for="(item, index) in images" :key="index" ref="img">
      <img :src="item" alt="">
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "WaterFall",
    data() {
      return {
        images: [
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24915_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24916_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24918_s.jpg',
          'http://pic.sc.chinaz.com/Files/pic/pic9/202005/zzpic24944_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24971_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24972_s.jpg',
          'http://pic.sc.chinaz.com/Files/pic/pic9/202005/zzpic24970_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24948_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24947_s.jpg',
          'http://pic.sc.chinaz.com/Files/pic/pic9/202005/zzpic24914_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24881_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202005/zzpic24880_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202005/zzpic24877_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/bpic20200_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24882_s.jpg',
          'http://pic.sc.chinaz.com/Files/pic/pic9/202005/zzpic24866_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24868_s.jpg',
          'http://pic.sc.chinaz.com/Files/pic/pic9/202005/zzpic24912_s.jpg',
          'http://pic.sc.chinaz.com/Files/pic/pic9/202004/bpic20176_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202004/bpic20180_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202005/zzpic24841_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202005/zzpic24844_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202005/hpic2393_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202005/hpic2394_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202005/hpic2392_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202005/hpic2396_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202004/zzpic24814_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202004/zzpic24816_s.jpg',
          'http://pic2.sc.chinaz.com/Files/pic/pic9/202004/bpic20173_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24905_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24904_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24839_s.jpg',
          'http://pic1.sc.chinaz.com/Files/pic/pic9/202005/zzpic24837_s.jpg'
        ],
        imgWidth: 0,
        height: 0
      }
    },
    computed: {
      ...mapGetters({
        asideState: 'header/CollapseState'
      })
    },
    methods: {
      //处理瀑布流图片
      //获得图片框的宽度
      //处理图片瀑布流
      waterfallHandler() {
        let pageWidth
        this.imgWidth = this.$refs.img[0].offsetWidth

        if (this.asideState) {
          pageWidth = document.body.clientWidth - 60 - 17
        } else {
          pageWidth = document.body.clientWidth - 200 - 17
        }
        // console.log(pageWidth - 40);
        //判断当前窗口可是宽度可以存在多少个列的图片
        let column = Math.floor(pageWidth / this.imgWidth)
        // console.log(((pageWidth - 40) - (200 * column)))
        //存储高度数组
        let heightArray = new Array()
        for (let i = 0; i < column; i++) {
          heightArray[i] = 0
        }
        //遍历所有图片定位处理
        for (let j = 0; j < this.$refs.img.length; j++) {
          let index = 0
          let minHeight = heightArray[0]
          const itemHeight = this.$refs.img[j].children[0].height
          //获得最小高度
          for (let i = 0; i < heightArray.length; i++) {
            if(minHeight > heightArray[i]) {
              index = i
              minHeight = heightArray[i]
            }
          }
          this.$refs.img[j].style.position = 'absolute'
          this.$refs.img[j].style.left = this.imgWidth * index + 63 +'px',
          this.$refs.img[j].style.top = minHeight + 'px'
          heightArray[index] += itemHeight + 10
        }


      }
    },
    mounted() {
      this.$nextTick(() => {
        this.height = document.documentElement.scrollHeight - 200
        setTimeout(() => {
          this.waterfallHandler()
        }, 500)
      })
    }
  }
</script>

<style scoped>

  .waterFall-box {
    position: relative;
    text-align: center;
    overflow-y: auto;
  }

  .waterFall-box .img-box {
    width: 200px;
    vertical-align: top;
    display: inline;
    padding: 5px;
  }

  .waterFall-box .img-box img:hover {
    transform: translateY(-5px);
    transition: all .5s ease;
    box-shadow: 0 0 5px 3px #cccccc;
  }
</style>