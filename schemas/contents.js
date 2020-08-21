const mongoose = require("mongoose");

//内容的表结构
module.exports = new mongoose.Schema({
    //关联字段,分类
    category: {
        type:mongoose.Schema.Types.ObjectId,
        //引用的是分类数据库模块Category
        ref:"Category"
    },
    //关联字段,用户
    user: {
        type:mongoose.Schema.Types.ObjectId,
        //引用的是分类数据库模块User
        ref:"User"
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //内容点击量
    views:{
        type:Number,
        default:0
    },
    //标题
    title:{
        type:String,
        default:""
    },
    //简介
    description:{
        type:String,
        default:""
    },
    //内容
    content:{
        type:String,
        default:""
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
    
})