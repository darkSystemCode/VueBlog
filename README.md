# VueBlog

# blogbackstage文件夹是博客后台管理系统
集成了NProgress进度条，不再做无聊的等待  
vue-jsonExcel表格数据的导出excel表，解决繁琐的数据整理  
vue全家桶，一步到位，方便快捷  
vue-echarts快速生成可视化表格  
vue-cropper图片上传（裁剪，预览...）  
界面简洁，简而实用，麻雀虽小，五官俱全，适用于日常开发。  

# 安装步骤
#download,解压后，在WS终端运行：  
npm run install ----等待安装依赖完毕  
npm run serve   ----执行/运行项目  
如果需要打包项目则运行：  
npm run build  

# 后台管理系统测试账号：
username: test  
password: test123

# 在线Demo
云服务器已过期

# 更新：
2020-10-11：  
1.更新路由：把静态路由，全部通过public下的nav.json（左侧导航栏的本地json文件）自动注入路由配置，减少了配置路由过程。  
2.路由自动注入规则：  
  2.1、路由的path值以首字母大写开头，例：path: '/Welcome'  
  
2021-07-17：  
1.修改页面的UI使其支持动态更改主题色  
2.优化代码，修复若干bug  
3.对接后台接口，后面会持续优化  
4.修改动态路由的格式  
  public/nav.json  
  {  
    "icon": "el-icon-s-platform",  
    "meta": {  
      "title": "控制台"  
    },  
      "child": [
        {  
          "meta": {  
            "title": "主控制台",  
            "close": false  
          },  
          "path": "/Welcome"  
        },  
        {  
          "meta": {  
            "title": "个人档案",  
            "close": true  
          },  
          "path": "/Profile"  
        }  
      ]  
    }  
 数据按vue官方路由格式配置 把数据全部放在元数组meta中，可以嵌套多层child（配置了child需要把当前导航的path去掉），如上代码拓展：  
  {  
    "icon": "el-icon-s-platform",  
      "meta": {  
        "title": "控制台"  
      },  
      "child": [  
        {  
          "meta": {  
            "title": "主控制台",  
            "close": false  
          },  
          child: [  
           {...相同格式配置路由对象}  
          ]  
        },  
        {  
          "meta": {  
            "title": "个人档案",  
            "close": true  
          },  
          "path": "/Profile"  
        }  
      ]  
    }  
# 后台代码加群找群主要 懒得上传在github了
# 最后，如果此项目能帮助到大家，希望给个star  
# 联系方式： QQ：154954264  
