<template>
  <div>
    <h3>带头卡片</h3>
    <el-row :gutter="15">
      <el-col :md="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <h3>不带头卡片</h3>
    <el-row :gutter="15">
      <el-col :md="8">
        <el-card class="box-card">
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card class="box-card">
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card class="box-card">
          <div v-for="o in 4" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <h3>图片卡片</h3>
    <el-row :gutter="15">
      <el-col :md="8">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">2020-05-11</time>
              <el-button type="text" class="button">操作按钮</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">2020-05-11</time>
              <el-button type="text" class="button">操作按钮</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="8">
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">2020-05-11</time>
              <el-button type="text" class="button">操作按钮</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <h3>卡片阴影</h3>
    <el-row :gutter="15">
      <el-col :md="8">
        <el-card shadow="always">通过shadow属性设置always，可以让卡片永久出现阴影</el-card>
      </el-col>
      <el-col :md="8">
        <el-card shadow="hover">通过shadow属性设置hover，只有当鼠标悬浮在卡片上方时显示阴影</el-card>
      </el-col>
      <el-col :md="8">
        <el-card shadow="none">通过shadow属性设置none，永远不显示阴影</el-card>
      </el-col>
    </el-row>
    <h3>卡片展示</h3>
    <el-row :gutter="15">
      <el-col :md="6">
        <el-card shadow="hover" class="cardL">
          <div @mouseover="mouseOver(1)" @mouseout="mouseOut(1)" ref="card1">
            <img :src="image" alt="" class="image">
            <div class="info">
              <p>1.那雪花洁白如玉，它是天宫派下的小天将，还是月宫桂树上落下的玉叶呢？雪花像美丽的玉色蝴蝶，
                似舞如醉；像吹落的蒲公英；似飘如飞；像天使赏赠的小白花儿；忽散忽聚，飘飘悠悠，轻轻盈盈，
                无愧是大地的杰作！只见眼前的雪花像蝴蝶一样调皮，一会儿落在屋檐下，一会落在树枝上，还不时飘在行人的脸上。
              </p>
            </div>
            <div class="btnGroup">
              <el-button class="btn" type="info">更多信息</el-button>
              <el-button class="btn" type="primary">购买</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="6">
        <el-card shadow="hover" class="cardL">
          <div @mouseover="mouseOver(2)" @mouseout="mouseOut(2)" ref="card2">
            <img :src="image" alt="" class="image">
            <div class="info">
              <p>2.那雪花洁白如玉，它是天宫派下的小天将，还是月宫桂树上落下的玉叶呢？雪花像美丽的玉色蝴蝶，
                似舞如醉；像吹落的蒲公英；似飘如飞；像天使赏赠的小白花儿；忽散忽聚，飘飘悠悠，轻轻盈盈，
                无愧是大地的杰作！只见眼前的雪花像蝴蝶一样调皮，一会儿落在屋檐下，一会落在树枝上，还不时飘在行人的脸上。
              </p>
            </div>
            <div class="btnGroup">
              <el-button class="btn" type="info">更多信息</el-button>
              <el-button class="btn" type="primary">购买</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="6">
        <el-card shadow="hover" class="cardL">
          <div @mouseover="mouseOver(3)" @mouseout="mouseOut(3)" ref="card3">
            <img :src="image" alt="" class="image">
            <div class="info">
              <p>3.那雪花洁白如玉，它是天宫派下的小天将，还是月宫桂树上落下的玉叶呢？雪花像美丽的玉色蝴蝶，
                似舞如醉；像吹落的蒲公英；似飘如飞；像天使赏赠的小白花儿；忽散忽聚，飘飘悠悠，轻轻盈盈，
                无愧是大地的杰作！只见眼前的雪花像蝴蝶一样调皮，一会儿落在屋檐下，一会落在树枝上，还不时飘在行人的脸上。
              </p>
            </div>
            <div class="btnGroup">
              <el-button class="btn" type="info">更多信息</el-button>
              <el-button class="btn" type="primary">购买</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="6">
        <el-card shadow="hover" class="cardL">
          <div @mouseover="mouseOver(4)" @mouseout="mouseOut(4)" ref="card4">
            <img :src="image" alt="" class="image">
            <div class="info">
              <p>4.那雪花洁白如玉，它是天宫派下的小天将，还是月宫桂树上落下的玉叶呢？雪花像美丽的玉色蝴蝶，
                似舞如醉；像吹落的蒲公英；似飘如飞；像天使赏赠的小白花儿；忽散忽聚，飘飘悠悠，轻轻盈盈，
                无愧是大地的杰作！只见眼前的雪花像蝴蝶一样调皮，一会儿落在屋檐下，一会落在树枝上，还不时飘在行人的脸上。
              </p>
            </div>
            <div class="btnGroup">
              <el-button class="btn" type="info">更多信息</el-button>
              <el-button class="btn" type="primary">购买</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "CardList",
    data() {
      return {
        image: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3612597965,1770541226&fm=26&gp=0.jpg'
      }
    },
    methods: {
      /*
      * 测试出多个相同的ref，读取的时候都是得到最后注册的那个ref，所以无法判断当前鼠标悬浮在那个div卡片上，所以，为没div卡片设置了一个下标值，用来判断当前的卡片，如果循环生成卡片也还是这样原理
      * index: 当前卡片的下标值
      * */
      mouseOver(index) {
        //设置也懂动画
        this.$refs['card'+index].querySelector('.btnGroup').style.transition = '.5s ease-in-out'
        //设置按钮组向上移动
        this.$refs['card'+index].querySelector('.btnGroup').style.bottom = '0'
      },
      mouseOut(index) {
        this.$refs['card'+index].querySelector('.btnGroup').style.transition = '.5s ease-in-out'
        //设置按钮组向下移动
        this.$refs['card'+index].querySelector('.btnGroup').style.bottom = '-60px'
      }
    }
  }
</script>

<style scoped>

  .text {
    margin: 5px 0;
  }

  .image {
    width: 100%;
    height: 100%;
  }

  .cardL {
    position: relative;
  }

  .cardL:hover {
    transform: translateY(-10px);
  }

  .cardL .info {
    font-size: 0.9em;
    font-family: "Hiragino Sans GB";
  }

  .cardL .btnGroup {
    width: 100%;
    height: 40px;
    background-color: rgba(0,0,0,0.5);
    position: absolute;
    margin-left: 0;
    left: 0;
    bottom: -60px;
    padding: 10px 0;
  }

  .cardL .btnGroup .btn:first-child {
    position: absolute;
    left: 20px;
  }

  .cardL .btnGroup .btn:last-child {
    position: absolute;
    right: 20px;
  }
</style>