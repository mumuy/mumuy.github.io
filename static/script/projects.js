(function(){
	let list = [{
		'url':'https://passer-by.com/relationship/',
		'name':'亲戚关系计算器'
	},{
		'url':'https://jquerywidget.com/',
		'name':'jQuery插件库'
	},{
		'url':'https://passer-by.com/pacman/',
		'name':'吃豆人游戏'
	},{
		'url':'https://passer-by.com/gobang/',
		'name':'五子棋人机对战'
	},{
		'url':'https://passer-by.com/data_location/',
		'name':'行政区划数据'
	},{
		'url':'https://passer-by.com/idcard/',
		'name':'身份证号码解析'
	},{
		'url':'https://passer-by.com/calendar/',
		'name':'万年历'
	},{
		'url':'https://passer-by.com/datex/',
		'name':'时间格式化'
	},{
		'url':'https://passer-by.com/datex/timezone.html',
		'name':'世界各城市时间'
	},{
		'url':'https://passer-by.com/browser/',
		'name':'浏览器判断'
	},{
		'url':'https://passer-by.com/widget-qrcode/',
		'name':'二维码美化组件'
	},{
		'url':'https://passer-by.com/widget-code/',
		'name':'代码着色美化组件'
	},{
		'url':'https://passer-by.com/widget-markdown/',
		'name':'Markdown实时渲染'
	},{
		'url':'https://passer-by.com/widget-region/',
		'name':'行政区划选择器'
	},{
		'url':'https://passer-by.com/widget-datetime/',
		'name':'日期时间选择器'
	},{
		'url':'https://passer-by.com/livestorage/',
		'name':'响应式数据本地存储'
	},{
		'url':'https://passer-by.com/anynumber/',
		'name':'大数浮点数计算'
	},{
		'url':'https://passer-by.com/ajax/',
		'name':'异步请求库'
	},{
		'url':'https://passer-by.com/imageCode/',
		'name':'imageCode脚本加密'
	},{
		'url':'https://passer-by.com/hiddenCode/',
		'name':'hiddenCode脚本加密'
	}];
	let url = location['hostname']+location['pathname'];
	document.write(`
		<div class="mod-projects">
			<div class="hd">
				<a href="https://passer-by.com/project.html" target="_blank">😉 更多开源项目</a>
			</div>
			<div class="bd">
				<ul>
					`+(function(){
						return list.map(function(item){
							return `<li><a href="${item['url']}" target="_blank">${item['name']}</a></li>`;
						}).join('');
					})()+`
				</ul>
			</div>
		</div>
		<style type="text/css">
			.mod-projects{max-width:1000px;margin:0 auto 20px;padding: 30px 0;text-align:center;font-size:15px;}
			.mod-projects a{text-decoration:none;color:#6e7781;}
			.mod-projects .hd{line-height:40px;font-size:20px;font-weight:bold;color:#3f4349;}
			.mod-projects .hd a{color:#3f4349;}
			.mod-projects ul{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;list-style: none;margin:0;padding:0 2px;}
			.mod-projects li a{display:block;line-height:40px;background: rgba(0,0,0,0.03);border-radius:5px;color:#6e7781;}
			.mod-projects li a:hover{background: #eef2f9}
			.mod-spread{max-width:960px;margin:0 auto 20px;padding: 30px 0;text-align:center;}
			.mod-spread .bd img{max-width:100%;height: auto;}
			@media screen and (max-width: 800px){
				.mod-projects ul{grid-template-columns:repeat(2,1fr);}
			}
		</style>
	`);
})();
