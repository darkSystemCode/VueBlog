<template>
  <div class="container">
    <div class="box">
      <span number number_f_f>4</span>
      <span ref="number_z" number number_z>0</span>
      <span number number_f_l>4</span>
      <p class="box-shadow" ref="box_shadow"></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NotPath_404",
    mounted() {
      this.$nextTick(() => {
        let shadow = this.$refs.box_shadow
        setTimeout(() => {
          shadow.style.boxShadow = "0 -50px 120px 35px #737373"
        }, 400)
      })
    }
  }
</script>

<style scoped>

  .container {
    position: relative;
    margin-top: 200px;
    text-align: center;
    vertical-align: middle;
  }

  .container .box span[number] {
    position: absolute;
    top: 0;
    width: 100px;
    height: 15px;
    font-size: 130px;
    font-weight: 600;
    padding: 20px;
  }

  .container .box .box-shadow {
    position: absolute;
    top: 180px;
    left: 50%;
    width: 50%;
    height: 30px;
    transform: translateX(-50%);
    background-color: #737373;
  }

  .container .box span[number_f_f] {
    left: 35%;
    animation: number-f-f 2s ease-in-out;
  }

  .container .box span[number_z] {
    left: 45%;
    animation: number-z .5s ease;
  }

  .container .box span[number_f_l] {
    left: 55%;
    animation: number-f-l 2s ease-in-out;
  }

  @keyframes number-f-f {
    0%{
      opacity: 0;
      transform: translateX(800px);
    }
    40% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(80px);
      color: #409EFF;
    }
    60% {
      transform: translateX(0);
    }
    70% {
      transform: translateX(30px);
      color: #8c939d;
    }
    80% {
      transform: translateX(0);
    }
    80% {
      transform: translateY(5px);
    }
    100%{
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes number-f-l {
    0%{
      opacity: 0;
      transform: translateX(-800px);
    }
    40% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-80px);
      color: #409EFF;
    }
    60% {
      transform: translateX(0);
    }
    70% {
      transform: translateX(-30px);
      color: #8c939d;
    }
    80% {
      transform: translateX(0);
    }
    80% {
      transform: translateY(-5px);
    }
    100%{
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes number-z {
    0%{
      opacity: 0;
      transform: translateY(-800px);
    }
    100%{
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>