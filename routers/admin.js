const express = require("express");
const fs = require("fs");
const router = express.Router();
const User = require("../models/User");
const Category = require("../models/Category");
const Content = require("../models/Content");

router.use((req,res,next)=>{
    if(!req.userInfo.isAdmin){
        res.send("对不起，只有管理员才可以进入该页面");
        return;
    }
    next();
})
/*
let components = []
const files = fs.readdirSync('./components')
files.forEach(function (item, index) {
    let stat = fs.lstatSync("./components/" + item)
    if (stat.isDirectory() === true) { 
      components.push(item)
    }
})

console.log(components);
*/

/*
* 首页
*/

router.get("/",function(req,res){
    res.render("admin/index",{
        userInfo:req.userInfo
    })
})

/*
* 用户管理 
*/
router.get("/user",function(req,res){
    /*
    * 从数据库中查询所有数据
    *
    * limit(Number):限制获取的数据条数
    * 
    * skip():忽略或者跳过数据的条数
    * 
    * 每页显示5条
    * 第一页：1-5，skip：0 =》(当前页-1)*limit
    * 第二页：6-10，skip：5
    * 
    */
    let page = Number(req.query.page || 1);  //当前页码
    let limit = 5;                           //每页显示数据条数            
    let pages = 0                            //总页数
    
    User.countDocuments().then(function(count){

        pages = Math.ceil(count/limit);//向上取整总页数
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        let skip = (page - 1) * limit; 
        User.find().limit(limit).skip(skip).then((users)=>{
            res.render("admin/user_index",{
                userInfo:req.userInfo,
                users:users,
                page:page,
                count:count,
                pages:pages,
                limit:limit   
            })
        })
    })
   
})

/*
*分类管理首页 
*/
router.get("/category",function(req,res){
    /*
    * 从数据库中查询所有数据
    *
    * limit(Number):限制获取的数据条数
    * 
    * skip():忽略或者跳过数据的条数
    * 
    * 每页显示5条
    * 第一页：1-5，skip：0 =》(当前页-1)*limit
    * 第二页：6-10，skip：5
    * 
    */
    let page = Number(req.query.page || 1);  //当前页码
    let limit = 5;                           //每页显示数据条数            
    let pages = 0                            //总页数

    Category.countDocuments().then(function(count){

        pages = Math.ceil(count/limit);//向上取整总页数
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        let skip = (page - 1) * limit; 
        //sort({_id:-1})查询出来的数据降序排列，1表示升序
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then((categories)=>{
            res.render("admin/category_index",{
                userInfo:req.userInfo,
                categories:categories,
                page:page,
                count:count,
                pages:pages,
                limit:limit   
            })
        })
    })
   
})

/*
*添加分类模板页面 
*/
router.get("/category/add",(req,res)=>{
    res.render("admin/category_add",{
        userInfo:req.userInfo
    })
})

/*
*添加分类数据的保存 
*/
router.post("/category/add",(req,res)=>{
    
    let name =req.body.name;

    if(name == ""){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"名称不能为空"
        });
        return;
    }

    //数据库中是否已经存在同名分类名
    Category.findOne({
        name:name
    }).then((fs)=>{
        if(!fs){           
            return Category.insertMany({name:name})
        }else{
            //数据库中已经存在该分类
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"分类已经存在了"
            })
            return Promise.reject();
        }
    }).then(()=>{
        res.render("admin/success",{
            userInfo:req.userInfo,
            message:'分类保存成功',
            url:"/admin/category"
        })
    }).catch((err)=>{
        console.log("添加失败")
        return;
    })

})

/*
* 分类的修改，获取修改信息 
*/
router.get("/category/edit",function(req,res){

    //获取要修改的分类信息，并且用表单的形式展现出来
    var id = req.query.id || "";

    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){         
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"分类信息不存在"
            });
           
            //return Promise.reject();
        }else{
            res.render("admin/category_edit",{
                userInfo:req.userInfo,
                category:category
            });
        }

    }).catch((err)=>{
       console.log("修改失败");
       return
    })
})

/*
* 分类的修改保存 
*/

router.post("/category/edit",function(req,res){

    //获取要修改的分类信息，并且用表单的形式展现出来
    var id = req.query.id;

    //获取post提交过来的名称
    var name = req.body.name;

    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"分类信息不存在"
            })
            return Promise.reject();
        }else{
            //当用户没有做任何修改提交的时候,直接保存
            if(name == category.name){
                res.render("admin/success",{
                    userInfo:req.userInfo,
                    message:"修改成功",
                    url:"/admin/category"
                })
                return Promise.reject();
            }else{

                //要修改的分类名称是否已经在数据库中存在
                //查询是否存在ID不同用户名相同的
                //$ne表示不等于
                return Category.findOne({
                    _id:{$ne: id},
                    name:name
                })

            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"数据库已经存在相同的分类名称"
            })
            return Promise.reject();
        }else{
            return Category.updateOne({
                _id:id
            },{
                name:name
            })
        }
    }).then(function(){
        res.render("admin/success",{
            userInfo:req.userInfo,
            message:"修改成功",
            url:"/admin/category"
        })
    })

})

/*
*分类的删除 
*/

router.get("/category/delete",function(req,res){
    let id = req.query.id;
    Category.deleteOne({
        _id:id
    }).then(function(){
        res.render("admin/success",{
            userInfo:req.userInfo,
            message:"删除成功",
            url:"/admin/category"
        })
    })
})

/*
*内容管理首页 
*/
router.get("/content",function(req,res){

    let page = Number(req.query.page || 1);  //当前页码
    let limit = 5;                           //每页显示数据条数            
    let pages = 0                            //总页数

    Content.countDocuments().then(function(count){

        pages = Math.ceil(count/limit);//向上取整总页数
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        let skip = (page - 1) * limit; 
        //sort({_id:-1})查询出来的数据降序排列，1表示升序
        //populate("category")中的category是数据库contents表结构里的一个关联字段
        Content.find().sort({addTime:-1}).limit(limit).skip(skip).populate(["category","user"]).then((contents)=>{
            res.render("admin/content_index",{
                userInfo:req.userInfo,
                contents:contents,
                page:page,
                count:count,
                pages:pages,
                limit:limit   
            })
        })
    })
})

/*
*内容管理添加 
*/
router.get("/content/add",function(req,res){
    Category.find().then(function(categories){

        res.render("admin/content_add",{
            userInfo:req.userInfo,
            categories:categories

        })

    })
    
})

/*
*内容保存 
*/
router.post("/content/add",function(req,res){
    let{category, title, description, content} = req.body;

    if(category == ""){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"内容分类不能为空",
        })
        return;
    }

    if(title == ""){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"内容标题不能为空",
        })
        return;
    }
    
    //保存数据到数据库
    Content.findOne({
        title:title
    }).then((fs)=>{
        if(!fs){           
            return Content.insertMany({category:category,title:title,user:req.userInfo._id.toString(),description:description,content:content})
        }else{
            //数据库中已经存在该分类
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"内容已经存在了"
            })
            return Promise.reject();
        }
    }).then(()=>{
        res.render("admin/success",{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:"/admin/content"
        })
    }).catch((err)=>{
        console.log("添加失败")
        return;
    })

})

/*
* 内容的修改，获取修改信息 
*/
router.get("/content/edit",function(req,res){

    //获取要修改的内容信息
    var id = req.query.id || "";
    Category.find().sort({_id:-1}).then(function(categories){
        return Content.findOne({
            _id:id
        }).populate("category").then(function(content){
            if(!content){         
                res.render("admin/error",{
                    userInfo:req.userInfo,
                    message:"内容不存在"
                });              
                return Promise.reject();
            }else{
                res.render("admin/content_edit",{
                    userInfo:req.userInfo,
                    categories:categories,
                    content:content
                });
                return;
            }   
        })
    }).catch((err)=>{
        console.log("修改失败");
        return
    })
    
})

/*
* 保存修改内容 
*/

router.post("/content/edit",function(req,res){

    let{title,category,description,content}=req.body;
    var id = req.query.id || "";

    if(category == ""){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"内容分类不能为空",
        })
        return;
    }

    if(title == ""){
        res.render("admin/error",{
            userInfo:req.userInfo,
            message:"内容标题不能为空",
        })
        return;
    }

    //获取要修改的分类信息
    Content.findOne({
        _id:id
    }).then(function(content){
        if(!content){
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"内容不存在"
            })
            return Promise.reject();
        }else{
            //当用户没有做任何修改提交的时候,直接保存
            if(title == content.title && category == content.category && description == content.description && content == content.content){
                res.render("admin/success",{
                    userInfo:req.userInfo,
                    message:"修改成功",
                    url:"/admin/content"
                })
                return Promise.reject();
            }else{

                //要修改的分类名称是否已经在数据库中存在
                //查询是否存在ID不同用户名相同的
                //$ne表示不等于
                return Content.findOne({
                    _id:{$ne: id},
                    title:title
                })

            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render("admin/error",{
                userInfo:req.userInfo,
                message:"数据库已经存在相同的内容标题"
            })
            return Promise.reject();
        }else{
            return Content.updateOne({
                _id:id
            },{
                category:category,
                title:title,
                description:description,
                content:content
            })
        }
    }).then(function(){
        res.render("admin/success",{
            userInfo:req.userInfo,
            message:"修改成功",
            url:"/admin/content"
            //url:"/admin/content/edit?id" + id
        })
    }).catch(function(err){
        console.log("保存失败");
        return;
    })

})

/*
*内容的删除 
*/

router.get("/content/delete",function(req,res){
    let id = req.query.id;
    Content.deleteOne({
        _id:id
    }).then(function(){
        res.render("admin/success",{
            userInfo:req.userInfo,
            message:"删除成功",
            url:"/admin/content"
        })
    })
})


module.exports = router;