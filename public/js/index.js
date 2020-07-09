$(function(){
    //切换到注册面板
    $("#login").find("a").on("click",function(){
        $("#reg").show();
        $("#login").hide();
    });
    //注册到登录面板
    $("#reg").find("a").on("click",function(){
        $("#login").show();
        $("#reg").hide();
    });
    //注册功能
    $("#reg").find("button").on("click", function(){
        //通过ajax提交请求
        $.ajax({
            type: "post",
            url: "/api/user/register",
            data: {
                username: $("#reg").find("input[name='username']").val(),
                password: $("#reg").find("input[name='password']").val(),
                repassword: $("#reg").find("input[name='repassword']").val()
            },
            dataType: "json",
            success: function(result){
                $("#errormessage").html(result.message);
                if(!result.code){
                    //注册成功
                    setTimeout(function(){
                        $("#login").show();
                        $("#reg").hide();
                    },1000);
                }
            }
        });
    });

    //登录功能
    $("#login").find("button").on("click",()=>{
        $.ajax({
            type: "post",
            url: "/api/user/login",
            data: {
                username:$("#login").find("input[name='username']").val(),
                password:$("#login").find("input[name='password']").val()
            },
            dataType: "json",
            success: (result)=>{
                $("#login_errormessage").html(result.message);
                if(!result.code){
                    setTimeout(()=>{
                        $("#login").hide();
                        $("#user_information").show();
                        //显示登录用户信息
                        $("#userMain").find(".username").html(result.data.username);
                        $("#userMain").find(".information").html("您好，欢迎光临我的博客");

                    },1000)
                }
            }
        })
    })
})