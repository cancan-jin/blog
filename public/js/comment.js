var perpage = 5;
var page = 1;
var pages = 0;
var comments=[]


$("#messageBtn").on("click",function(){
    $.ajax({
        type: "POST",
        url: "/api/comment/post",
        data:{
            contentid:$("#contentId").val(),
            content:$("#messageContent").val()
        },
        success:function(responseData){
            $("#messageContent").val("");
            comments = responseData.data.comments.reverse()
            renderComment();
        }
    })
})

$.ajax({
    url: "/api/comment",
    data:{
        contentid:$("#contentId").val()
    },
    success:function(responseData){
        comments =responseData.data.reverse();
        renderComment();
    }
})

$(".pager").delegate("a", "click",function(){
    if($(this).parent().hasClass("previous")){
        page--
    }else{
        page++
    }
    renderComment();
})

function renderComment(){
    
    $("#messageCount").html(comments.length);
    pages = Math.max(Math.ceil(comments.length / perpage),1);
    var start = Math.max(0,(page-1)*perpage);
    var end = Math.min(start + perpage,comments.length);

    $(".pager li").eq(1).html(page + '/' + pages)

    if(page<=1){
        page = 1;
        $(".pager li").eq(0).html("没有上一页了")
    }else{
        $(".pager li").eq(0).html('<a href="javascript:;">上一页</a>')
    } 

    if(page>=pages){
        page = pages;
        $(".pager li").eq(2).html("没有下一页了")
    }else{
        $(".pager li").eq(2).html('<a href="javascript:;">下一页</a>')
    }
    
    if(comments.length == 0){
        $(".msg_inf").html("<h2>还没有留言</h2>")
    }else{
        var html = "";
        for(var i=start; i<end; i++){
           
                    
            html += '<ul>'+
            '<li><strong>'+comments[i].username+'</strong><span>'+formDate(comments[i].postTime)+'</span></li>'+
            '<li>'+comments[i].content+'</li>'+
            '</ul>'
        }
        $(".msg_inf").html(html)
    }
    

}

function formDate(dd){
   var date1 = new Date(dd);
   return date1.getFullYear() + '年' + (date1.getMonth()+1) + '月' + date1.getDate() + '日' +
   date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}