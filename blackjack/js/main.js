/*定义全局变量*/
var card=new Array(53);
var bet_sore,ins_sore;
var y_sore=5000,c_sore=5000;
var y_A,c_A,y_sum,c_sum,y_mark,c_mark,y_num,c_num,num;
var y_x=565,y_y=450,c_x=565,c_y=65;//定义全局变量设置纸牌的位置
/*定义纸牌对象构造函数*/
function Card(number)
{//value取1-13分别表示A、1-10、J、Q、K
this.value=Math.ceil(number/4);
this.showcard=function(x,y,num,position)//纸牌展示函数
{//使用jQuery添加CSS（映射)，解决在IE中使用DOCTYPE文档定义，无法准确定位的问题
$("#"+position).append($("<span/>").css({'left':x+num*15,'top':y}).append($("<img/>").attr("src","picture/puker/"+number+".jpg")).fadeIn(500*number/number));
}//fadeIn(500*numbet/number)表示在number为0是直接显现，number不为零时用500ms淡入
}
/*开始游戏*/
function start()
{
$("#cards").fadeIn(1200,function(){
cards_top=this.offsetTop;//保存牌堆的位置
cards_left=this.offsetLeft;
bet();});	
}
/*押注--初始化*/
function bet()
{
y_A=0,c_A=0,y_sum=0,c_sum=0,y_mark=0,c_mark=0,y_num=0,c_num=0,num=1;//开局变量初始化
bet_sore=0,ins_sore=0;
$("#sore").text("得分："+y_sore);
$("#ins").text("保险：否");
$(".show").empty();//清除上盘的纸牌
$("#message").text("请选择押注金额");
$("#center_message").html("<a href='#'>500</a><a href='#'>100</a><a href='#'>50</a><a href='#'>20</a><a href='#'>10</a>").hide().show(500);//动态呈现效果
refresh();
$(".message").hide().fadeIn(800);//玩家游戏信息的淡入效果
$("#center_message a").click(function(){bet_sore+=parseInt($(this).text());refresh();});//为每个链接绑定事件处理函数
}
/*押注--刷新*/
function refresh()
{
var options="";
if(bet_sore==y_sore)//当玩家已经押下所有赌注时
{
$("#message").text("您已经用光了所有赌注！");
$("#center_message").fadeOut(500);//淡出效果
}
else if(y_sore-bet_sore<10)//当玩家所剩赌注不足以继续押注时
{//避免玩家在加注选择消失过程中继续点击
bet_sore=Math.floor(y_sore/10)*10;
$("#message").text("对不起，您所剩赌注不足！不能继续加注"); 
$("#center_message").fadeOut(500);//淡出效果
}
else//处理押注额的选项
{
$("#center_message a").each(function(){
if(y_sore-bet_sore<$(this).text())
{
$(this).replaceWith($("<span>"+$(this).text()+"</span>").addClass('bet_sore'));//当所剩赌注不足继续加注较大赌金时
$("#message").text("当前所剩赌金小于"+$(this).text());
}
});
}
$("#bet").html("赌注："+bet_sore);
if(bet_sore)
options="<a href='#' onclick='game()'>确定</a>";
else
options="确定";
if(y_sore-bet_sore>5)//不接受5元零头的押注
options+="<br/><a href='#' onclick='all_in()'>全押</a>";
else
options+="<br/>全押";
if(bet_sore)
options+="<br/><a href='#' onclick='bet()'>重置</a>";//重置将回到开局的初始化状态
else
options+="<br/>重置";
$("#choose").html(options);
}
/*全押*/
function all_in(){
bet_sore=Math.floor(y_sore/10)*10;
refresh();
if(y_sore%10)//不接受5元零头
$("#message").text("5元零头不参与押注，系统退回");
}
/*牌面计算函数*/
function cardsum(sum,value,A_num)
{
if(value>10)
value=10;
else if(value==1)
{
A_num++;
value=11;
}
sum+=value;
if(sum>21&&A_num!=0)
{
sum-=10;
A_num--;
}
return [sum,A_num];
}
/*保险函数*/
function insurance()
{
ins_sore=bet_sore/2;
$("#ins").text("保险：是");
choosemenu(card[1].value);
}
/*玩家选择菜单*/
function choosemenu()
{
$("#message").text("请选择以下操作");
var options="<a href='#' onclick='hit()'>要牌</a>";
if(y_sore>2*bet_sore)
options+="<br/><a href='#' onclick='double()'>加倍</a>";
else
options+="<br/>加倍";
options+="<br/><a href='#' onclick='stand()'>停牌</a>";
if(card[1].value!=1&&y_num==2)
options+="<br/><a href='#' onclick='surrender()'>投降</a>"
else
options+="<br/>投降"
$("#choose").html(options).show();
}
/*要牌*/
function hit()
{
$("#choose a").each(function(){$(this).replaceWith($(this).text());});//隐藏菜单项的链接，防止玩家在动画过程中点击
deal(y_x,y_y,y_num,function(){
card[num].showcard(y_x,y_y,y_num++,"y_show");
var par=cardsum(y_sum,card[num++].value,y_A);
y_sum=par[0];
y_A=par[1];
if(y_sum<22&&y_num<5)//如果玩家没爆点或未满5张牌则继续进入菜单选择，否则系统自动转入停牌阶段
choosemenu();
else 
stand();
});
}
/*双倍加注*/
function double()
{
$("#choose a").each(function(){$(this).replaceWith($(this).text());});//隐藏菜单项的链接，防止玩家在动画过程中点击
deal(y_x,y_y,y_num,function(){
bet_sore*=2;
$("#bet").html("赌注："+bet_sore);
card[num].showcard(y_x,y_y,y_num++,"y_show");
var par=cardsum(y_sum,card[num++].value,y_A);
y_sum=par[0];
stand();
});
}
/*停牌*/
function stand()
{
var par;
$("#choose").empty();
if(y_num==5)//判断玩家是否为五老虎
y_mark=2;
$("#c_show span:eq(1)").remove();//翻开暗牌，即删除纸牌背面然后添加新的纸牌
card[num].showcard(c_x,c_y,1,"c_show");
par=cardsum(c_sum,card[num++].value,c_A);
c_sum=par[0];
c_A=par[1];
if(c_sum==21)//判断电脑是否黑杰克
c_mark=1; 
if(c_sum<17&&c_num<5)
deal(c_x,c_y,c_num,function(){
card[num].showcard(c_x,c_y,c_num++,"c_show");
par=cardsum(c_sum,card[num++].value,c_A);
c_sum=par[0];
c_A=par[1];
if(c_sum<17&&c_num<5)
deal(c_x,c_y,c_num,arguments.callee);//匿名函数递归
else
{
if(c_sum<22&&c_num==5)//判断电脑是否为五老虎
c_mark=2;
vs();	
}
});
else
{
if(c_sum<22&&c_num==5)//判断电脑是否为五老虎
c_mark=2;
vs();	
}
}
/*投降*/
function surrender()
{
y_sore-=bet_sore/2;
$("#sore").text("得分："+y_sore);
$("#center_message").html("<img class='result' src='picture/desk/emotion8.png'>您已经投降了！").hide().fadeIn(500,function(){
if(y_sore<10)//游戏结束判断
{
$("#message").text("对不起，您已经用光了所有赌注！");
$("#choose").text("游戏结束！");
window.setTimeout(function(){$('.show,#center_message,#right_top,#choose,#cards').fadeOut(1200,function(){location.reload()})},5000);//游戏结束后，先淡出再刷新
}
else//单局结束
{
$("#message").text("本局结束，点击\"再来一局\"开始新一轮游戏");
$("#choose").html("<a href='#' onclick='bet()'>再来一局</a>").hide().fadeIn(500);
}
});
}
/*结果判定*/
function vs()
{
var message,get_sore;
if(y_mark==2&&c_mark!=2&&y_sum<22)
{
message="<img class='result' src='picture/desk/emotion1.png'>您以五老虎赢得胜利";
get_sore=2*bet_sore-ins_sore;
}
else if(c_mark==2&&y_mark!=2&&c_sum<22)
{
message="<img class='result' src='picture/desk/emotion7.png'>电脑以五老虎赢得胜利";
get_sore=-2*bet_sore-ins_sore;
}
else if(y_mark==2&&c_mark==2&&y_sum<22&&c_sum<22)
{
message="<img class='result' src='picture/desk/emotion4.png'>两只老虎！平局";
get_sore=0;
}
else if(y_mark==1&&c_mark!=1)
{
message="<img class='result' src='picture/desk/emotion2.png'>您以黑杰克赢得胜利";
get_sore=1.5*bet_sore-ins_sore;
}
else if(y_mark!=1&&c_mark==1)
{
message="<img class='result' src='picture/desk/emotion6.png'>电脑以黑杰克赢得胜利";
get_sore=-1.5*bet_sore-ins_sore;
}
else if(y_mark==1&&c_mark==1)
{
message="<img class='result' src='picture/desk/emotion4.png'>您和电脑同时黑杰克，平局!";
get_sore=0;
}
else if(y_sum>21&&c_sum<=21)
{
message="<img class='result' src='picture/desk/emotion5.png'>您输了";
get_sore=-bet_sore-ins_sore;
}
else if(y_sum<=21&&c_sum>21)
{
message="<img class='result' src='picture/desk/emotion3.png'>您赢了";
get_sore=bet_sore-ins_sore;
}
else if(y_sum>21&&c_sum>21)
{
message="<img class='result' src='picture/desk/emotion4.png'>平局！";
get_sore=0;
}
else if(y_sum<c_sum)
{
message="<img class='result' src='picture/desk/emotion5.png'>您输了";
get_sore=-bet_sore-ins_sore;
}
else if(y_sum>c_sum)
{
message="<img class='result' src='picture/desk/emotion3.png'>您赢了";
get_sore=bet_sore-ins_sore;
}
else if(y_sum==c_sum)
{
message="<img class='result' src='picture/desk/emotion4.png'>平局！";
get_sore=0;
}
y_sore+=get_sore;
$("#center_message").html(message).hide().fadeIn(500,function(){;
$("#sore").text("得分："+y_sore);
if(y_sore<10)//游戏结束判断
{
$("#message").text("对不起，您已经用光了所有赌注！");
$("#choose").text("游戏结束！");
window.setTimeout(function(){$('.show,#center_message,#right_top,#choose,#cards').fadeOut(1200,function(){location.reload()})},5000);//游戏结束后，先淡出再刷新
}
else//单局结束
{
$("#message").text("本局结束，点击\"再来一局\"开始新一轮游戏");
$("#choose").html("<a href='#' onclick='bet()'>再来一局</a>").hide().fadeIn(500);
}
});//慢慢浮现结果信息
}
/*游戏主流程函数*/
function game()
{
var par,j,temp;
$("#choose").empty().show();//前一个操作淡出未清空而影响下个操作，必须在所有选项都淡出后在进入操作
$("#center_message").fadeOut(500,function(){
$(this).empty().show();
setTimeout(function(){	
for(i=0;i<53;i++)//定义一幅新牌
card[i]=new Card(i);
for(i=1;i<53;i++)//只洗后面52张牌，第一张为显示作用的暗牌
{
j=Math.floor(Math.random()*52)+1;
temp=card[j];
card[j]=card[i];
card[i]=temp;
}
deal(c_x,c_y,c_num,function(){
card[num].showcard(c_x,c_y,c_num++,"c_show");
par=cardsum(c_sum,card[num++].value,c_A);
c_sum=par[0];
c_A=par[1];
deal(c_x,c_y,c_num,function(){
card[0].showcard(c_x,c_y,c_num++,"c_show");//电脑发出的第二张牌为暗牌
deal(y_x,y_y,y_num,function(){
card[num].showcard(y_x,y_y,y_num++,"y_show");
par=cardsum(y_sum,card[num++].value,y_A);
y_sum=par[0];
y_A=par[1];
deal(y_x,y_y,y_num,function(){
card[num].showcard(y_x,y_y,y_num++,"y_show");
par=cardsum(y_sum,card[num++].value,y_A);
y_sum=par[0];
y_A=par[1];
if(y_sum==21)//判断玩家是否为黑杰克，如果是跳过选项操作之间停牌对比结果
{
y_mark=1;
stand();
}
else//如果玩家为黑杰克则不再参与下面的选择操作
{
if(card[1].value==1)//判断电脑的明牌是A，则进行保险操作
{
var options;
if(y_sore>1.5*bet_sore)//检查玩家是否有足够的赌注买保险
{
$("#message").text("1 / 11? 是否加保险？");
options="<a href='#' onclick='insurance()'>买保险</a>";
}
else
{
$("#message").text("对不起，您当前的赌金不够买保险");
options="买保险";
}
options+="<br/><a href='#' onclick='choosemenu()'>继续</a>";
$("#choose").html(options);
}
else//判断电脑的明牌不是A，则进行基本选择操作
choosemenu();
};
});
});
});
});
},5200);//纸牌牌堆显现，留5200毫秒等待洗牌操作完成
shuffe();});//加注选项淡出后洗牌
}