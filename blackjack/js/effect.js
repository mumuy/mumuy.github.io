/*当文档加载完必后，加载下列特效*/
$(document).ready(function(){
$("#logo").hover(function(){flag=setTimeout(function(){
$("#logo img").fadeOut(600);					  
$("#me").show(1200);
},750);//设置延时，避免鼠标偶然经过而触发事件
},
function(){
clearTimeout(flag);//避免鼠标偶然经过又离开后，延时事件执行
$("#me").hide(1200,function(){
$("#logo img").fadeIn(600);});
})
$("#cards").hide()//一开始让牌堆隐藏
});
/*洗牌*/
function shuffe(){
$("#cards").animate({left:'550px'},1000,function(){
$(this).hide();
setTimeout(function(){$("#center_message").empty();$("#cards").show().animate({left:'0px'},1000)},3000);
$("#center_message").append($("<span/><span/><span/><span/><span/>").addClass('desk_cards').append($("<img/>").attr("src","picture/puker/0.jpg")));
$(".desk_cards:eq(0)").css({'margin-right':'-80px'});
$(".desk_cards:eq(1)").css({'margin-right':'-80px'});
$(".desk_cards:eq(3)").css({'margin-left':'-80px'});
$(".desk_cards:eq(4)").css({'margin-left':'-80px'});
for(var i=0;i<5;i++)
$(".desk_card:eq("+i+")").css('z-index',i);
for(i=0;i<6;i++)
{
$(".desk_cards:eq(1)").animate({left:'100px'},250,function(){$(this).css('z-index',3);}).animate({left:'0px'},250,function(){$(this).css('z-index',1);});
$(".desk_cards:eq(3)").animate({left:'-100px'},250,function(){$(this).css('z-index',1);}).animate({left:'0px'},250,function(){$(this).css('z-index',3);});
}
for(i=0;i<5;i++)
{
$(".desk_cards:eq(0)").animate({left:'200px'},300,function(){$(this).css('z-index',4);}).animate({left:'0px'},400,function(){$(this).css('z-index',0);});
$(".desk_cards:eq(4)").animate({left:'-200px'},300,function(){$(this).css('z-index',0);}).animate({left:'0px'},400,function(){$(this).css('z-index',4);});	
}
});
}
/*发牌*/
function deal(x,y,num,fn)
{
if(arguments.length==3)
fn=new Function("");//如果没有第三个函数参数，则设该参数为空函数
$("#card").animate({left:x+num*15-cards_left,top:y-cards_top},650,function(){
$("#cards").empty().append($("<span id='card'/>").append($("<img/>").attr("src","picture/puker/0.jpg")));
fn();
});
}
