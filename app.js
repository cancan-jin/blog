/*
* 项目名称：应用程序启动页
* 编写：cancan-jin
*/
//加载express模块
const express = require("express");
//加载模板处理模块swig
const swig = require("swig");
//加载数据库模块
const mongoose = require("mongoose");
// 加载body-parser, 用来处理post提交的数据
const bodyParser = require("body-parser");
//加载cookies模块
const Cookies = require("cookies");
//创建app应用
const app = express();

//引入数据库模块
const User = require("./models/User");

//设置静态文件托管
//当用户访问的URL以/public开头，则直接返回对应__dirname + "/public"目录下的文件
app.use("/public",express.static(__dirname + "/public"));

//配置应用模板
//定义当前应用所使用的模板
//第一个参数：表示模板引擎的名称，同时也是模板文件的后缀；第二个参数：表示用于处理解析处理模板内容的方法
app.engine("html",swig.renderFile);
//设置模板文件存放的路径，第一个参数必须是views，第二个参数是目录
app.set("views","./views");
//注册所使用的的模板引擎，第一个参数必须是view engine，第二个参数要和模板文件的后缀一致
app.set("view engine", "html")
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});

//bodyparser设置，解析文本格式
app.use(bodyParser.urlencoded({extended:true}));

//设置cookie
app.use((req,res,next)=>{
    //创建cookie实例，保存在request headers请求头里面
    req.cookies = new Cookies(req,res);
    //新建空对象
    req.userInfo = {};
    //解析登录用户的cookie信息
    if (req.cookies.get("userInfo")){
        try{
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            //查询当前当前登录用户的用户类型，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(err){
            next();
        }
    }else{
        next();
    }
    
})

/*
* 根据不同的功能划分模块 
*/
app.use("/",require("./routers/main"));
app.use("/admin",require("./routers/admin"));
app.use("/api",require("./routers/api"));


mongoose.connect("mongodb://localhost:27018/blog",{useNewUrlParser:true,useUnifiedTopology: true},(err)=>{
    if(err){
        console.log("数据库连接失败");
    }else{
        console.log("数据库连接成功");
        app.listen(3000,()=>{
            console.log("server start");
        });
    }
});
