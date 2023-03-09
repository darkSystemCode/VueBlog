# VueBlog

# 运行截图

![image](https://github.com/darkSystemCode/VueBlog/blob/master/public/img/1.png)
![image](https://github.com/darkSystemCode/VueBlog/blob/master/public/img/2.png)
![image](https://github.com/darkSystemCode/VueBlog/blob/master/public/img/3.png)
![image](https://github.com/darkSystemCode/VueBlog/blob/master/public/img/4.png)


# blogbackstage文件夹是博客后台管理系统
集成了NProgress进度条，不再做无聊的等待  
vue-jsonExcel表格数据的导出excel表，解决繁琐的数据整理  
vue全家桶，一步到位，方便快捷  
vue-echarts快速生成可视化表格  
vue-cropper图片上传（裁剪，预览...）  
界面简洁，简而实用，麻雀虽小，五官俱全，适用于日常开发  
你只需要在public\nav.json配置新添加的页面路由即可直接在页面上显示，由于webpack的import()使用静态编译，全变量无法通过编译，所以文件只能在/views/文件夹下拓展  
规则如下：  
icon：标题图标  
meta：元数据  
meta.title：标题名称  
meta.close：标题是否可关闭  
meta.first：是否为首页，只允许配置一个  
meta.prePath: 配置路径前缀，用于适应/views/下的所有文件夹，比如/views/base/test.vue，可以这样配置prePath='/base/test',需带上'/'  
path：路由路径，路径首字母必须大写，对应新建的.vue文件也是首字母大写，否则匹配不到  
child：子路由，配置规则一样，如果存在child字段，那么父对象不需要配置path字段  

```javascript
  位于public\nav.json文件
  数据按vue官方路由格式配置 把数据全部放在元数组meta中，可以嵌套多层child（配置了child需要把当前导航的path去掉）  
  {  
    "icon": "el-icon-s-platform",  
    "meta": {  
      "title": "控制台"  
    },  
    "child": [
      {  
        "meta": {  
          "title": "主控制台",  
          "close": false,
          "prePath": "/base",
          "first": true
        },  
        "path": "/Welcome"  
      },  
      {  
        "meta": {  
           "title": "个人档案",  
           "close": true,
           "prePath": "/base"
        },  
        "path": "/Profile"  
      }  
    ],
    {
      "icon": "el-icon-user-solid",
      "meta": {
        "title": "角色管理",
        "close": true,
        "prePath": "/base/user"
      },
      "path": "/User"
    }  
  }  
  ```  
注意事项：如果在项目运行期间修改了meta.prePath字段值，导致页面无法加载修改后的页面，那么可以重新编译运行下项目即可。

# 安装步骤
下载master主分支的代码，解压并导入到WebStorm,在WebStorm打开终端窗口：  
1.执行
```
npm run install
```
----等待安装依赖完毕（无错误包）  
2.执行
```
npm run serve
```
----执行/运行项目  
如果需要打包项目  
3.执行
```
npm run build
```

# 后台管理系统测试账号：
以数据库user表为准  
**默认账号密码：test/test123**

# 在线Demo
云服务器已过期

# 更新：
> 2020-10-11：  

1.  更新路由：把静态路由，全部通过public下的nav.json（左侧导航栏的本地json文件）自动注入路由配置，减少了配置路由过程。  
2.   路由自动注入规则：  
  2.1、路由的path值以首字母大写开头，例：path: '/Welcome'  
  
> 2021-07-17：  

1. 修改页面的UI使其支持动态更改主题色  
2. 优化代码，修复若干bug  
3. 对接后台接口，后面会持续优化  
4. 修改动态路由的格式  

> 2023-01-02：
1. nav.json文件添加first字段，只允许存在一个first字段，该字段用于表示当前路径为首页
2. 优化首页流程，不再固定通过path:'Welcome'来确定首页，而是通过配置first：true来标识，建议配置first的路径放在第一位，这样可以减少查找时间
3. 优化标题栏，标题栏添加横向滚动功能
4. 优化左侧菜单栏  
5. 优化nav.json文件，支持新增文件在/views/文件夹下拓展  
# 后台代码加群找群主要 懒得上传在github了
# 最后，如果此项目能帮助到大家，希望给个star  
# 联系方式： QQ群：819339098 
