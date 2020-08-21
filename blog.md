# blog开发笔记

## 项目前期准备

### 1、安装好项目需要的开发环境

+ **开发环境**
  + nodejs：后台开发语言
  + nmp：包管理工具
  + mongodb：后台数据库
  + github：代码托管
  + robo3t：mongodb可视化工具

> github安装时是选择在vs code中运行，VScode终端中输入：git config ++global user.name "git用户名"，git config ++global user.email "git邮箱"，提交master；在gibhub.com中新建代码仓库，返回VScode选择推送到命令，远程连接github，然后将代码上传。在根目录下新建文件.gitignore,复制不准备上传文件的相对路径粘贴在.gitignore文件。

+ **github安装**
  + 下载并安装vs code
  + 下载并安装github，选择编辑器时选择在vs code中运行
  + VScode终端中输入：git config ++global user.name "git用户名"，git config ++global user.email "git邮箱"
  + 新建项目，在源代码管理中初始化储存库
  + 点击“提交”按钮，并输入master
  + VScode源代码管理界面中选择“推送到”命令，然后添加远程->从github添加远程->登录
  + 打开gibhub.com网站，在gibhub.com中新建代码仓库blog
  + 再次在VScode源代码管理界面中选择“推送到”命令，然后添加远程->从github添加远程->选择blog

### 2、项目需求分析

+ **前台功能**
  + 首页
  + 列表页
  + 内容页
  + 注册
  + 登录

+ **后台功能**
  + 分类管理（列表，增删改查）
  + 内容管理（列表，增删改查）
  + 评论管理（查看、删除）

### 开发前的准备工作

+ **开发前的准备工作**
  + 新建项目文件夹，并在终端输入npm init初始化
  + 安装相关依赖包
    + express：构建web服务器 / api服务器
    + body+parser：解析post请求数据
    + cookies：读/写cookies
    + swig：模板解析引擎
    + mongoose：操作mongodb数据库
    + markdown：markdown语法解析生成模块

  + **创建目录结构**
    + db：数据库存放目录
    + models：数据库模型文件目录
    + public：静态资源目录
    + routers：路由文件目录
    + schemas：数据库结构文件
    + views：模板视图文件目录
    + app.js：服务器启动文件

### 3、创建应用app.js

+ **创建应用**
  + 创建应用、监听端口
  + 用户的访问，用户通过URL访问web应用

+ **处理请求输出**
  + 路由绑定，通过app.get()或app.post()等方法可以把URL路径绑定一个或多个函数
  + app.get("/",function(req,res,next){})
    + req:request对象，保存客户端请求相关的一些数据
    + res:response对象，服务端输出对象，提供了一些服务器端输出相关的一些方法
    + next:方法，用户执行下一个和路径匹配的函数
  + 内容输出，通过res.send(string)发送内容至客户端

+ **使用模板**
  + 使用swig模板模块，前后端分离
  + 模板配置swig，使用swig.renderFile方法解析后缀为html的文件
+ **静态文件托管**
  + 静态文件托管目录public
  + app.use("/public",express.static(__dirname + "/public"))

### 3.1、app.use

+ **app.use是express调用中间件的方法**
  + 所谓中间件（middleware），就是处理HTTP请求的函数
  + app.use() 里面的函数，只有当浏览器发出HTTP请求时，才会启用，进行过滤、筛选
  + app.use((req,res,next)=>{next()})
    + next()让不同的中间件串联起来，当当前中间件工作完成后，通知下一个中间件执行，从而实现对同一请求的多重处理
    + 当需要执行下一个函数时，则加入next，如果选择终止则不加入next

### 3.2、函数与方法

+ **面向过程的叫函数，函数着重定义**
  + 函数声明:function fn(x){return x+1;},可以提前被调用
  + 函数表达式:var fn = function(x){ return x+1},不可提前调用，必须在函数表达式之后使用
  + Fuction构造函数生成实例:var sum = new Function("num1", "num2", "num1+num2")
    + Fuction构造函数前面都是函数参数，最后一个字符串参数表示函数体
    + 需要两层解析，一是函数解析，而是对内部字符串的解析，耗性能
    + 书写麻烦，函数体还不能写复杂
    + 不推荐使用
  + 匿名函数，是指没有函数名的函数：function(x,y){return x+y}
    + 匿名函数自调用(function(x,y){return x+y})(1,2)
  + 函数的内部属性
    + arguments对象保存着传递给函数的参数
    + arguments.length表示实际传入参数的个数

+ **面向对象的叫方法，方法强调执行**
  + 方法（method）是通过对象调用的javascript函数
  + 方法本身也是函数，它只是比较特殊的函数
  + 调用方法obj.method()

### 4、功能开发

+ **模块划分**
  + 前台模块，app.use("/",require("./routers/main"))
  + 后台管理模块,app.use("/admin",require("./routers/admin"))
  + api模块,app.use("/api",require("./routers/api"))
+ **开发顺序**
  + 先完成后台管理功能模块
  + 再完成前端展示
+ **新建数据库管理**
  + 命令行工具进入d:\mongodb\bin
  + 输入mongod --dbpath=D:\nodejs\blog\db --port=27018，设置项目数据库路径和端口
  + robo3t中新建链接
+ **创建数据库表结构**
+ **将数据库对象转换为模型**
  + 数据库表结构相当于数据的属性，类似人物角色的姓名、身高、年龄、体重、学历等，不同的人不同的属性，相对应的不同的数据不同的属性。
  + 根据自定义的数据属性创建模型，如{name: String,age:Number}
  + 通过数据模型创建数据
  + 将数据存入数据库

### 5、前端静态页面编写

+ html页面
+ css样式
+ js页面效果
+ ajax数据传递

### 5.1、前端静态模板渲染

+ **使用ejs渲染引擎**
  + app.set('views','./views');
  + app.engine('html',ejs.__express);
  + app.set('view engine','html');
  + ejs引擎接收参数方式：   <%=KeyName%>

+ **使用ｓｗｉｇ进行渲染ＨＴＭＬ模板**
  + app.set('views','./views');
  + app.engine('html',swig.renderFile);
  + app.set('view engine','html');
  + swig引擎接收参数方式：{{KeyName}}

### 6、注册逻辑及往数据库插入数据

+ **前端界面发送ajax请求**
  + 数据类型 type: "post"
  + 接口地址 url: "/api/user/register"
  + 发送的数据 {username,password,repassword}
  + 数据类型 dataType: "json"
  + 请求成功返回信息

+ **服务器接收数据**
  + 服务器通过req.body方法接收前端发送的数据
  + let{username,paaaword}=req.body
  + 前端输入验证，判断注册账号密码是否为空

+ **查询数据库数据**
  + 通过mongoose自定义模块的find（）方法，查询数据是否存在
  + 如果已存在，则返回错误提示“用户名已经被注册”
  + 如果不存在，则通过insertMany（）方法插入数据，并返回“注册成功信息”

> **前端**--通过接口地址（URL链接）发送ajax请求-->
  **服务器(启动页)**--加载自定义api路由模块-->
  **自定义模块（接口路由文件）**--加载数据库模块--加载数据库表结构模块-->
  **mongodb数据库**

### 6.1、cookies

+ **登录工作流程**
  + 前端点击登录发送登录用户信息
  + 服务器将信息存到cookie（request headers请求头里的cookie）
  + 服务器将cookie信息返回给浏览器
  + 浏览器刷新时，request headers中携带cookie信息，完成登录验证

+ **cookie简介**
  + cookie是服务器存储在浏览器本地的小型文本文件，如登录信息，网页浏览记录等
  + http是无状态协议，也就是说，当你访问一个网页后再访问这个网站的另一个网页，服务器是不知道这是同一个浏览器用户在访问同一个网站,即不知道是谁发起的链接

### 6.2、判断用户类型

+ 数据库添加字段isAdmin，数据类型Boolean，默认false
+ 引入数据库模块
+ 查询数据库，并判断用户类型

### for、for in及for of的区别

+ 遍历数组
  + for遍历的是索引值
  + for in遍历的也是索引值
  + for of遍历的是数组里的元素
+ 遍历对象
  + for只能对数组遍历
  + for in遍历的对象的key值，如{username：“alon”，age：18}，遍历结果是username，age
  + for of不能遍历对象，只能遍历iterator对象

### 端口被占用修改

+ 查询3000端口被占用情况：netstat -o -n -a | findstr :3000
+ 结束进程：taskkill /F /PID 7080，终止7080的进程
