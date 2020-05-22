<template>
  <div class="waterFall-box" ref="box">
    <div class="img-box" v-for="(item, index) in images" :key="index" ref="img">
      <img :src="item.img" alt="">
    </div>
    <footer v-if="isLoad == false"
            :style="{position: 'absolute', top: Math.max(...heightArray)+'px', color: 'red', left: '50%', transform: 'translateX(-50%)'}">
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
        imgWidth: 220, //图片的宽度
        heightArray: [],  //存储高度数组，用于判断最小高度的图片位置
        isLoad: true,  //是否继续加载图片
        surplusW: 0, //是否存在剩余宽度
        offsetP: 0,
        count: 0
      }
    },
    methods: {
      /**
       * 预加载图片资源
       * */
      loadImgHeight() {
        let count = 0 //计数变量 判断是否预加载图片是否完成
        this.images.forEach((item) => {
          //使用image类预加载图片
          let image = new Image()
          image.src = item.img
          image.onload = image.onerror = event => {
            count++
            if(count == this.images.length) {
              this.$nextTick(() => {
                this.init()
                this.positionImg(0)
              })
            }
          }
        })
      },
      /**
       * @remarks 初始化
       * 初始化容器的宽度，计算出容器可容纳多少固定宽度图片的列，
       * 如果可排列固定宽度的图片宽度无法沾满容器的宽度，需要计算出空余的宽度，固定首图片的left
       * */
      init() {
        //得到页面的宽度
        const pageWidth_padding = this.$refs.box.clientWidth
        //页面的padding像素
        this.offsetP = this.$refs.box.style.paddingLeft.replace(/[^0-9]/ig, "")
        //获得页面的真实宽度（除去padding、margin、border...）
        const pageWidth = pageWidth_padding - (this.offsetP * 2)
        //计算出当前页面可展示多少列图片
        const column = Math.floor(pageWidth / this.imgWidth)
        //偏移像素值
        this.surplusW = pageWidth - (column * this.imgWidth)
        //初始化存储高度数组
        for (let i = 0; i < column; i++) {
          this.heightArray.push(0)
        }
      },
      /**
       * @remark 定位图片
       * @param:
       *  start: 循环开始位置，开始为0，如果滚动条滑到底部，则start为容器存在图片资源的数量即this.images.length
       *  ----------宽高都计算img的父容器的宽高
       * */
      positionImg(start) {
        //获得img标签的父容器的DOM
        let parentDom = this.$refs.img
        for (let i = start; i < this.images.length; i++) {
          //获得最小高度
          const minHeight = Math.min(...this.heightArray)
          //获得最小高度索引
          const index = this.heightArray.indexOf(minHeight)
          //获得当前图片的高度
          const currHeight = parentDom[i].clientHeight
          //定位
          parentDom[i].style.position = 'absolute'
          parentDom[i].style.top = minHeight + 'px'
          parentDom[i].style.left = this.imgWidth * index + + ((Math.floor((this.surplusW / 2)) + 30)) +  'px'
          this.heightArray[index] += currHeight+5
        }
        //对父容器赋值当前heightArray数组的最大高度
        this.$refs.box.style.height = Math.max(...this.heightArray) + 50 + 'px'
      }
    },
    mounted() {
      const _this = this

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
              _this.count += 1
              if(_this.count == 4) {
                _this.isLoad = false
              }
              if(_this.isLoad) {
                const start = _this.images.length
                for (let item of res.data.data) {
                  _this.images.push(item)
                }
                //滑到底部继续加载图片，this.$nextTick()异步加载，待资源虚拟DOM加载完毕
                _this.$nextTick(() => {
                  _this.positionImg(start)
                })
              }
            }
          })
        }
      })
    },
    created() {
      Axios({
        url: '/waterFall.json',
        method: 'get'
      }).then(res => {
        if (res.data.code == 200) {
          this.images = res.data.data ? res.data.data : []
          this.loadImgHeight()
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
    float: left;
  }

  .waterFall-box .img-box img {
    width: 100%;
    border-radius: 10px;
    animation: imgBox .5s ease-in-out;
  }

  .waterFall-box .img-box img:hover {
    transform: translateY(-3px);
    transition: transform .5s ease-in-out;
    box-shadow: 0 20px 20px 2px #737373;
  }

  @keyframes imgBox {
    0%{
      opacity: 0;
      transform: translateY(-100px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

</style>