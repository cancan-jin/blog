const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Content = require("../models/Content");
var data;

/*
*通用数据处理 
*/

router.use(function(req,res,next){
    data = {
        userInfo: req.userInfo,
        categories: []
    }
    //读取分类信息
    Category.find().sort({_id:-1}).then(function(categories){
        data.categories = categories;
        next();
    })
    
})

/*
*前台首页 
*/
router.get("/",(req,res,next)=>{
    /*
    * render（）函数第一个参数表示渲染模板的名称，第二个参数表示渲染模板传递的数据 
    */
  
    data.category = req.query.category || "";
    data.page = Number(req.query.page || 1); 
    data.limit = 2;  
    data.count = 0;                                    
    data.pages = 0;

   var where ={};
   if(data.category){
       where.category = data.category
   }

    //读取内容
    Content.where(where).countDocuments()
    .then(function(count){
       data.count = count;
       data.pages = Math.ceil(data.count/data.limit);//向上取整总页数
       data.page = Math.min(data.page, data.pages);
       data.page = Math.max(data.page, 1);
       let skip = (data.page - 1) * data.limit;
       return Content.where(where).find().sort({addTime:-1}).limit(data.limit).skip(skip).populate(["category","user"]);

   })
   .then(function(contents){
       data.contents = contents;
       //传递参数给静态页面
       res.render("main/index",data)
   })
    
    
})

/*
* 内容详情页
*/
router.get("/view",function(req,res){

    var contentId = req.query.contentid || "";

    Content.findOne({
        _id:contentId
    }).populate("user").then(function(content){
        data.content = content;
        content.views++;
        content.save();
        res.render("main/view",data);
    })

})

module.exports = router;