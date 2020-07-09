const express = require("express");
const router = express.Router();
const User = require("../models/User")

//统一返回格式
var responseData;

router.use(function(req,res,next){
    responseData = {
        code: 0,
        message: "",
        data: {}
    };
    next();
})

/*
* 用户注册逻辑
* 一、前端输入验证
*     1、用户名不能为空
*     2、密码不能为空
*     3、两次输入密码必须一致
* 二、数据库验证
*     1、用户名是否已经被注册  
*/
router.post("/user/register", function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    //也可以这样写let {username,password,repassword}=req.body;
    
    //用户名是否为空
    if(username == ""){
        responseData.code = 1;
        responseData.message = "用户名不能为空"
        res.json(responseData);
        return;
    };
    //密码是否为空
    if(password == ""){
        responseData.code = 2;
        responseData.message = "密码不能为空"
        res.json(responseData);
        return;
    };
    //两次输入的密码必须一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = "两次输入的密码不一致"
        res.json(responseData);
        return;
    };


    /*
    * 用户名是否已经被注册，如果数据库中已经存在，表示已经被注册
    * User.find({username:username})是一个promise对象
    * 通过return User.insertMany({username:username,password:password})，形成链式调用
    * find()返回的是一个数组，findOne()返回的是一个对象
    */
    User.find({username:username})
    .then(function(data){
        if(data.length===0){
            return User.insertMany({username:username,password:password});
        }else{
            responseData.code=4;
            responseData.message="用户名已经被注册";
            res.json(responseData);
            return;
        }
    })
    .then(function(){
        responseData.message = "注册成功";
        res.json(responseData);
    })
    .catch((err)=>{
        console.log("数据插入失败");
        return;
    })
   
    
    /*User.findOne({
        username:username
    }).then(function(userInfo){
        if (userInfo){
            responseData.code=4;
            responseData.message="用户名已经被注册";
            res.json(responseData);
            return;
        }else{
            var user = new User({
                username:username,
                password:password
            });
            return user.save();
        }
    }).then(function(newUserInfo){
        responseData.message = "注册成功";
        res.json(responseData);
    })*/
   
});

/*
* 用户登录逻辑
* 一、前端输入验证
*     1、用户名不能为空
*     2、密码不能为空
* 二、 数据库验证
*     1、密码错误
*     2、用户名未注册
*/
router.post("/user/login",(req,res)=>{
    let {username, password} = req.body;
    //前端输入验证
    if(username == "" || password == ""){
        responseData.code = 1;
        responseData.message = "用户名和密码不能为空"
        res.json(responseData);
        return;
    };
    //数据库验证
    User.find({username:username,password:password})
    .then((data)=>{
        if(data.length > 0){
            responseData.message = "登录成功";
            //find()方法查询返回的是一个数组，所以要用data[0]
            responseData.data = {
                _id: data[0]._id,
                username: data[0].username 
            };
            res.json(responseData);
            return;
        }else{
            responseData.code = 2;
            responseData.message = "用户名或密码错误"
            res.json(responseData);
            return;
        }
    })
    .catch((err)=>{
        console.log("登录失败");
        return;
    })
})

module.exports = router;