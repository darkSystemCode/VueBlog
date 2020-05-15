<template>
  <div class="waterFall-box" :style="{height: (height+70)+'px'}" ref="box">
    <div class="img-box" v-for="(item, index) in images" :key="index" ref="img" :style="{padding: offsetPixel+'px'}">
      <img :src="item.img" alt="">
    </div>
    <footer v-if="isLoad = false"
            :style="{position: 'absolute', top: (height+50)+'px', color: 'red', left: '50%', transform: 'translateX(-50%)'}">
      没有图片加载了...
    </footer>
  </div>
</template>

<script>
  import Axios from 'axios'

  export default {
    name: "WaterFall",
    data() {
      return {
        images: [], //存储图片资源
        imgWidth: 0, //图片的宽度
        height: 0, //容器的高度，等于图片总的最大高度
        heightArray: [],  //存储高度数组，用于判断最小高度的图片位置
        isLoad: true,  //是否继续加载图片
        surplusW: 0, //是否存在剩余宽度
        offsetPixel: 5, //左右偏移像素
        padding: 0 //容器是否存在padding
      }
    },
    methods: {
      /*
      * 初始化函数
      * 计算得到可展示页面的宽度
      * 计算出可排列的列数
      * 初始化高度数组heightArray
      * */
      initHeight() {
        //获得页面的真实宽度（除去padding、margin、border...）
        const pageWidth = this.$refs.box.clientWidth
        this.padding = this.$refs.box.style.paddingLeft.replace(/[^0-9]/ig, "")
        //其实this.imgWidth是图片所在盒子div的真实宽度
        this.imgWidth = this.$refs.img[0].clientWidth
        //判断当前窗口可是宽度可以存在多少个列的图片
        let column = Math.floor( pageWidth / this.imgWidth)
        //获得布满column列后是否还剩余宽度，如果剩余，则计算出排列图片的左右间隙
        console.log(pageWidth);
        console.log(column * this.imgWidth);
        this.surplusW = pageWidth - (column * this.imgWidth)
        console.log(this.surplusW);
        //存储高度数组
        this.heightArray = new Array()
        for (let i = 0; i < column; i++) {
          this.heightArray[i] = 0
        }
      },
      /*
      * 对图片进行定位处理函数
      * 处理瀑布流图片
      * start: 遍历开始的位置
      * */
      waterfallHandler(start) {
        //遍历所有图片定位处理
        for (let j = start; j < this.images.length; j++) {
          let index = 0
          //获得当前图片高度
          const itemHeight = this.$refs.img[j].children[0].height
          //获得最小高度
          let minHeight = Math.min(...this.heightArray)
          //最小高度索引
          index = this.heightArray.indexOf(minHeight)
          //对图片进行定位处理
          this.$refs.img[j].style.position = 'absolute'
          // console.log((this.imgWidth * index + (Math.floor(this.surplusW / 2))) + 10);
          this.$refs.img[j].style.left = this.imgWidth * index + (Math.floor(this.surplusW / 2)) + 'px'
          this.$refs.img[j].style.top = minHeight + 'px'
          //把当前高度覆盖当前最小高度索引位置
          this.heightArray[index] += itemHeight + this.offsetPixel*2
        }
        //父容器赋值最大高度，使可显示
        this.height = Math.max(...this.heightArray)
      }
    },
    mounted() {
      const _this = this
      Axios({
        url: '/waterFall.json',
        method: 'get'
      }).then(res => {
        if (res.data.code == 200) {
          this.images = res.data.data
          this.$nextTick(() => {
            setTimeout(() => {
              //初始化最小高度
              _this.initHeight()
              _this.waterfallHandler(0)
            }, 100)
          })
        }
      })

      //监听滚动条滚动，实现懒加载图片
      window.addEventListener('scroll', function () {
        //得到可滚动距离
        const scrollDistance = document.documentElement.scrollHeight - document.documentElement.clientHeight
        //滚动到顶部的距离
        const scroll = document.documentElement.scrollTop
        if (scrollDistance == scroll) {
          Axios({
            url: '/waterFall2.json',
            method: 'get'
          }).then(res => {
            if (res.data.code == 200) {
              const start = _this.images.length
              for (let item of res.data.data) {
                _this.images.push(item)
              }
              setTimeout(() => {
                _this.waterfallHandler(start)
              }, 100)
            }
          })
        }
      })
    }
  }
</script>

<style scoped>

  .waterFall-box {
    position: relative;
    text-align: center;
    overflow-y: hidden;
  }

  .waterFall-box .img-box {
    width: 210px;
    vertical-align: top;
    display: block;
    /*padding: 5px;*/
    float: left;
  }

  .waterFall-box .img-box img {
    width: 100%;
  }

  .waterFall-box .img-box img:hover {
    /*transform: translateY(-5px);*/
    /*transition: transform .5s ease;*/
    box-shadow: 0 0 5px 3px #cccccc;
  }

  .waterFall-box .img-box img {
    animation: img .5s ease;
  }

  @keyframes img {
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    100% {
      opacity: 1;
    }
  }
</style>