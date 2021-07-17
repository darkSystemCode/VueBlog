<template>
  <div style="height: 40px; max-height: 40px">
    <canvas class="canvas" width="150" height="40" @click="again"></canvas>
  </div>
</template>

<script>
  export default {
    name: "Validate",
    data () {
      return {
        ctx: '',
        result: '', //返回验证码结果变量
        //canvas宽高
        width: 150,
        height: 40,
        //颜色范围
        backgroundColorMin: 130,
        backgroundColorMax:250,
        //字母数字
        letter: ['a','b','c','d','e','f','g','h','i','j','k','l','n','m','o','p','q','r','s','t','u','v','w','x','y','z',
          'A','B','C','D','E','F','G','H','I','J','K','L','N','M','O','P','Q','R','S','T','U','V','W','X','Y','Z','1','2',
          '3','4','5','6','7','8','9','0']
      }
    },
    methods: {
      //随机生成一个数
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      //随机生成颜色
      randomColor(min, max) {
        const r = this.randomNum(min, max)
        const g = this.randomNum(min, max)
        const b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
      },
      //绘制验证码
      drawPic() {
        //绘制背景
        this.ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
        this.ctx.strokeStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)

        this.ctx.fillRect(0, 0, this.width, this.height)
        this.ctx.strokeRect(0,0, this.width, this.height)
        for (let i = 0; i < 6; i++) {
          const index = Math.floor(Math.random() * this.letter.length)
          this.result = this.result.concat(this.letter[index])
        }
        this.drawText(this.result) //6位验证码
        this.drawLine()
        this.drawSpot()
        //把验证码存入vuex中
        this.$store.commit('code/setCode', this.result)
      },
      //绘制文字
      drawText(text) {
        this.ctx.font = "40px SimHei"
        this.ctx.fillStyle = this.randomColor(50, 150) //随机生成文本颜色
        this.ctx.textBaseline = "top" //文本基线
        const textWidth = this.ctx.measureText(text) //得到文本的宽度
        this.ctx.fillText(text, this.randomNum(0, this.width - textWidth.width), 0) //绘制文本
      },
      //绘制验证码线条
      drawLine() {
        for (let i=0; i <= 6; i++) {
          //开始绘制形状
          this.ctx.beginPath()
          this.ctx.strokeStyle = this.randomColor(this.width, this.height)
          this.ctx.moveTo(this.randomNum(0, this.width), this.randomNum(0, this.height)) //起始点
          this.ctx.lineTo(this.randomNum(0, this.width),this.randomNum(0, this.height)) //终止点
          //结束绘制
          this.ctx.stroke()
        }
      },
      //绘制验证码模糊点
      drawSpot() {
        for (let i = 0; i < 15; i++) {
          this.ctx.beginPath()
          this.ctx.fillStyle = this.randomColor(this.width, this.height)
          this.ctx.arc(this.randomNum(0, this.width),this.randomNum(0, this.height),2,0,Math.PI * 2,true)
          this.ctx.fill()
        }
      },
      //点击验证码重新渲染
      again() {
        this.result = '' //清空验证码
        this.drawPic()
      }
    },
    mounted() {
      this.$nextTick(() => {
        const canvas = this.$el.querySelector('.canvas')
        //检测浏览器是否支持canvas
        if(canvas.getContext){
          this.ctx = canvas.getContext('2d')
          this.drawPic()
        } else {
          alert("您的浏览器不支持canvas，无法显示验证码")
        }
      })
    }
  }
</script>

<style scoped>

  .canvas {
    cursor: pointer;
  }
</style>