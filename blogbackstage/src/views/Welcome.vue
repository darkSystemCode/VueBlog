<template>
  <div class="welcome">
    <el-row :gutter="10" class="row">
      <el-col :span="24">
        <el-card id="card" class="card">
          <v-chart :options="active"></v-chart>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="row">
      <el-col :span="6">
        <el-card shadow="hover" class="topCard card">
          <div slot="header">
            <span>阅读量</span>
            <el-tag type="danger" effect="dark" class="btn">日</el-tag>
          </div>
          <div class="content">
            <ICountUp :delay="delay" :endVal="120" :options="options('', '','','')"></ICountUp>
            <span class="range">
              <!--el-icon-caret-left el-icon-caret-right el-icon-caret-bottom el-icon-caret-top-->
              同日比：<span><i class="el-icon-caret-top" :style="{color: '#67C23A', fontSize: '20px'}"></i>2%</span>
            </span>
            <el-divider></el-divider>
            <div class="other">总阅读量：50000</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="topCard card">
          <div slot="header">
            <span>发布量</span>
            <el-tag type="danger" effect="dark" class="btn">日</el-tag>
          </div>
          <div class="content">
            <ICountUp :delay="delay" :endVal="50" :options="options('','','','')"/>
            <el-divider></el-divider>
            <div class="other">总发布量：182</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="topCard card">
          <div slot="header">
            <span>销售额</span>
            <el-tag type="warning" effect="dark" class="btn">年</el-tag>
          </div>
          <div class="content">
            <ICountUp :delay="delay" :endVal="400000" :options="options('','','￥','')"/>
            <el-divider></el-divider>
            <div class="other">
              <el-progress :percentage="percentage" :color="customColors"></el-progress>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="topCard card">
          <div slot="header">
            <span>用户量</span>
          </div>
          <div class="content">
            <ICountUp :delay="delay" :endVal="10" :options="options('','','','')"/>
            <el-divider></el-divider>
            <div class="other">希望更多的用户进来</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="row">
      <el-col :span="17">
        <el-row :gutter="5">
          <el-col :span="12">
            <el-card shadow="always" class="card">
              <div slot="header">最新发布文章</div>
              <ul>
                <li v-for="(item, index) in newArticle" :key="index">
                  <span number>{{index+1}}</span>
                  <span articleHeader>{{item.title}}</span>
                </li>
              </ul>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="always" class="card">
              <div slot="header">精选文章</div>
              <ul>
                <li v-for="(item, index) in selectedArticle" :key="index">
                  <span number>{{index+1}}</span>
                  <span articleHeader>{{item.title}}</span>
                </li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="24">
            <el-card shadow="always" style="margin-top: 10px" class="card">
              <div slot="header"><i class="el-icon-info"></i><span>说明</span></div>
              <div style="height: 271px">
                <el-card shadow="hover">
                  前端页面：
                  <a href="javascript:;" @click="jump('http://47.115.55.12:81')">http://47.115.55.12:81</a>
                </el-card>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7">
        <el-card shadow="always" class="cardBottom card">
          <div slot="header"><i class="el-icon-message-solid"></i><span>通告</span></div>
          <div class="notice">
            <el-timeline :reverse="true">
              <el-timeline-item
                v-for="(item, index) in notice"
                :key="index"
                :timestamp="item.times | filterTimes"
                placement="top">
                {{item.content}}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
        <el-card shadow="always" class="cardBottom card">
          <div slot="header"><i class="el-icon-s-help"></i><span>帮助</span></div>
          <div>
            <el-card shadow="hover" style="margin-bottom: 10px;background-color: #E6A23C">
              点击查看
            </el-card>
            <el-card shadow="hover">
              点击帮助
            </el-card>
          </div>
        </el-card>
        <el-card shadow="always" class="cardBottom card">
          <div slot="header"><i class="el-icon-info"></i><span>信息</span></div>
          <div>
            <el-button icon="el-icon-search" circle></el-button>
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="success" icon="el-icon-check" circle></el-button>
            <el-button type="info" icon="el-icon-message" circle></el-button>
            <el-button type="warning" icon="el-icon-star-off" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import ICountUp from 'vue-countup-v2'
  import formatTime from '../utils/formatTime'

  export default {
    name: "Welcome",
    data() {
      return {
        week: '',
        delay: 500,
        width: '',
        newArticle: [
          {title: "VUE知识大全"},
          {title: "JavaEE一篇过，让你恍然大悟"},
          {title: "SpringBoot整合mybaits的配置"},
          {title: "VUE快速入门"},
          {title: "JavaHashMap详解"},
          {title: "SpringBoot常用注解"}
        ],
        selectedArticle: [
          {title: "JAVA永不言败"},
          {title: "VUE面试大全"},
          {title: "JAVAEE入门指南"},
          {title: "JAVA不败的传说"},
          {title: "中间件学习笔记"},
          {title: "redis笔记"}
        ],
        notice: [
          {
            content: '最新通知，后端管理系统正式上线',
            times: '1588143594'
          },
          {
            content: '12月25日，系统进行一次升级',
            times: '1588143594'
          },
          {
            content: '最新报道，这个系统很棒哦',
            times: '1588143594'
          },
          {
            content: '希望系统优化更加好',
            times: '1588143594'
          },
          {
            content: '12月25日，系统进行一次升级',
            times: '1588143594'
          },
          {
            content: '最新报道，这个系统很棒哦',
            times: '1588143594'
          },
          {
            content: '希望系统优化更加好',
            times: '1588143594'
          }
        ],
        percentage: 20,
        customColors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ],
        active: {
          legend: {
            data: ['发布量', '活跃量']
          },
          tooltip: {
            trigger: 'none',
            axisPointer: {
              type: 'cross'
            }
          },
          xAxis: {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value',
            name: '总数'
          },
          series: [
            {
              name: '发布量',
              data: [0, 0, 0, 0, 0, 10, 5],
              type: 'line',
              smooth: true
            },
            {
              name: '活跃量',
              data: [1, 1, 0, 2, 10, 5, 1],
              type: 'line',
              smooth: true
            }
          ]
        }
      }
    },
    filters: {
      //格式化时间戳
      filterTimes(times) {
        return formatTime(times, "yyyy-MM-dd")
      }
    },
    methods: {
      /*
      * countup.js的options封装
      * @params：
      *   userEasing: 默认为true
      *   userGrouping： 默认为true
      *   separator： 数字间的分隔符，默认为没有空格符
      *   decimal：小数
      *   prefix: 数字前缀
      *   suffix：数字后缀
      * */
      options(separator, decimal, prefix, suffix) {
        let option = new Object()
        option.userEasing = true
        option.userGrouping = true
        option.separator = separator
        option.decimal = decimal
        option.prefix = prefix
        option.suffix = suffix
        return option
      },
      jump(url) {
        window.open(url)
      }
    },
    mounted() {
      this.$nextTick(() => {
        /*
        * 设置通知模块的样式，如果可以滚动，下部出现内部阴影，如果滚动了出现上部阴影（此时下部阴影不显示）
        * */
        let clientH //dom容器的高度
        let scrollH //滚动的高度
        const noticeDom = this.$el.querySelector('.notice')
        clientH = noticeDom.clientHeight
        scrollH = noticeDom.scrollHeight
        //出现了滚动条
        if(scrollH > clientH) {
          //设置下部阴影
          noticeDom.style.boxShadow = '0 -8px 8px -12px #000000 inset'
        }
        noticeDom.addEventListener('scroll', function() {
          if(noticeDom.scrollTop == 0) {
            //设置下部阴影
            noticeDom.style.boxShadow = '0 -8px 8px -12px #000000 inset'
          } else {
            //设置上部阴影
            noticeDom.style.boxShadow = '0 8px 8px -12px #000000 inset'
          }
        })
      })
    },
    components: {
      "v-chart": ECharts,
      ICountUp
    }
  }
</script>

<style scoped>
  .row, .cardBottom {
    margin-bottom: 10px;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  ul li {
    list-style-type: none;
    padding: 3px 0;
    display: flex;
  }

  ul li span[number] {
    display: block;
    width: 21px;
    max-width: 21px;
    min-width: 21px;
    height: 21px;
    max-height: 21px;
    line-height: 21px;
    border-radius: 21px;
    margin-right: 5px;
    text-align: center;
    background-color: #5F4B8B;
    color: #FFFFFF;
  }

  ul li span[articleHeader]:hover {
    width: 100%;
    border-radius: 3px;
    cursor: pointer;
    background-color: #F2F6FC;
  }

  .topCard {
    width: 100%;
    height: 196px;
    overflow: hidden;
  }

  .topCard .btn, .range, .card .btn {
    float: right;
  }

  .topCard .content {
    font-size: 20px;
    font-weight: 600;
  }

  .topCard .content span:nth-child(1) {
    color: #5F4B8B;
  }

  .topCard .content .other {
    font-size: 16px;
    font-weight: 400;
  }

  .echarts {
    width: 100%;
    height: 500px;
  }

  .range {
    font-size: 14px;
    color: #8c939d;
    vertical-align: middle;
  }

  [middle] {
    height: 58px;
    line-height: 58px;
    position: absolute;
    top: 0;
    right: 15px;
  }

  .notice {
    height: 145px;
    overflow-y: auto;
  }

  /*::-webkit-scrollbar 滚动条整体部分*/
  /*::-webkit-scrollbar-thumb  滚动条里面的小方块，能向上向下移动（或往左往右移动，取决于是垂直滚动条还是水平滚动条）*/
  /*::-webkit-scrollbar-track  滚动条的轨道（里面装有Thumb）*/
  /*::-webkit-scrollbar-button 滚动条的轨道的两端按钮，允许通过点击微调小方块的位置。*/
  /*::-webkit-scrollbar-track-piece 内层轨道，滚动条中间部分（除去）*/
  /*::-webkit-scrollbar-corner 边角，即两个滚动条的交汇处*/
  /*::-webkit-resizer 两个滚动条的交汇处上用于通过拖动调整元素大小的小控件*/

  .notice::-webkit-scrollbar {
    width: 4px;
    background-color: #F5F5F5;
  }

  .notice::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #b3b3b3;
  }


</style>