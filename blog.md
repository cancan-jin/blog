# blog开发笔记

## 项目前期准备

### 安装好项目需要的开发环境
+ 开发环境
  - nodejs：后台开发语言
  - nmp：包管理工具
  - mongodb：后台数据库
  - github：代码托管
  - robo3t：mongodb可视化工具

> github安装时是选择在vs code中运行，VScode终端中输入：git config --global user.name "git用户名"，git config --global user.email "git邮箱"，提交master；在gibhub.com中新建代码仓库，返回VScode选择推送到命令，远程连接github，然后将代码上传。在根目录下新建文件.gitignore,复制不准备上传文件的相对路径粘贴在.gitignore文件。

### 项目需求分析
+ 前台功能
  - 首页 
  - 列表页
  - 内容页
  - 注册
  - 登录

+ 后台功能
  - 分类管理（列表，增删改查）
  - 内容管理（列表，增删改查）
  - 评论管理（查看、删除）

### 开发前的准备工作
+ 开发前的准备工作
  - 新建项目文件夹，并在终端输入npm init初始化
  - 安装相关依赖包
    - express：构建web服务器 / api服务器
    - body-parser：解析post请求数据
    - cookies：读/写cookies
    - swig：模板解析引擎
    - mongoose：操作mongodb数据库
    - markdown：markdown语法解析生成模块
  - 创建目录结构
    - db：数据库存放目录
    - models：数据库模型文件目录
    - public：静态资源目录
    - routers：路由文件目录
    - schemas：数据库结构文件
    - views：模板视图文件目录
    - app.js：服务器启动文件

### 创建应用app.js
+ 创建应用
  - 创建应用、监听端口
  - 用户的访问，用户通过URL访问web应用
+ 处理请求输出
  - 路由绑定，通过app.get()或app.post()等方法可以把URL路径绑定一个或多个函数
  - app.get("/",function(req,res,next){})
    - req:request对象，保存客户端请求相关的一些数据
    - res:response对象，服务端输出对象，提供了一些服务器端输出相关的一些方法
    - next:方法，用户执行下一个和路径匹配的函数
  - 内容输出，通过res.send(string)发送内容至客户端
+ 使用模板
  - 使用swig模板模块，前后端分离
  - 模板配置swig，使用swig.renderFile方法解析后缀为html的文件
+ 静态文件托管
  - 静态文件托管目录public
  - app.use("/public",express.static(__dirname + "/public"))

### 功能开发
+ 模块划分
  - 前台模块，app.use("/",require("./routers/main"))
  - 后台管理模块,app.use("/admin",require("./routers/admin"))
  - api模块,app.use("/api",require("./routers/api"))
+ 开发顺序
  - 先完成后台管理功能模块
  - 再完成前端展示
+ 新建数据库管理
  - 命令行工具进入d:\mongodb\bin
  - 输入mongod --dbpath=D:\nodejs\blog\db --port=27018，设置项目数据库路径和端口
  - robo3t中新建链接
+ 创建数据库表结构
+ 将数据库对象转换为模型
  - 数据库表结构相当于数据的属性，类似人物角色的姓名、身高、年龄、体重、学历等，不同的人不同的属性，相对应的不同的数据不同的属性。
  - 根据自定义的数据属性创建模型，如{name: String,age:Number}
  - 通过数据模型创建数据
  - 将数据存入数据库

### 前端静态页面编写
+ html页面
+ css样式
+ js页面效果
+ ajax数据传递

### 注册逻辑及往数据库插入数据
+ 前端界面发送ajax请求
  - 数据类型 type: "post"
  - 接口地址 url: "/api/user/register"
  - 发送的数据 {username,password,repassword}
  - 数据类型 dataType: "json"
  - 请求成功返回信息
+ 服务器接收数据
  - 服务器通过req.body方法接收前端发送的数据
  - let{username,paaaword}=req.body
  - 前端输入验证，判断注册账号密码是否为空
+ 查询数据库数据
  - 通过mongoose自定义模块的find（）方法，查询数据是否存在
  - 如果已存在，则返回错误提示“用户名已经被注册”
  - 如果不存在，则通过insertMany（）方法插入数据，并返回“注册成功信息”
> **前端**--通过接口地址（URL链接）发送ajax请求-->**服务器(启动页)**--加载自定义api路由模块-->**自定义模块（接口路由文件）**--加载数据库模块--加载数据库表结构模块-->**mongodb数据库**
 
