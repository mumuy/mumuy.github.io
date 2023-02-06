(function(){
	var list = [{
		'url':'https://passer-by.com/relationship/',
		'name':'亲戚关系计算器'
	},{
		'url':'https://jquerywidget.com/',
		'name':'jQuery插件库'
	},{
		'url':'https://passer-by.com/pacman/',
		'name':'吃豆人游戏'
	},{
		'url':'https://passer-by.com/data_location/',
		'name':'行政区划数据'
	},{
		'url':'https://passer-by.com/calendar/',
		'name':'万年历'
	},{
		'url':'https://passer-by.com/datex/',
		'name':'时间格式化'
	},{
		'url':'https://passer-by.com/browser/',
		'name':'浏览器判断'
	},{
		'url':'https://passer-by.com/imageCode/',
		'name':'imageCode脚本加密'
	},{
		'url':'https://passer-by.com/hiddenCode/',
		'name':'hiddenCode脚本加密'
	}];
	var url = location['hostname']+location['pathname'];
	document.write(`
		<div class="mod-projects">
			<div class="hd">
				<a href="https://passer-by.com/project/" target="_blank">😉 更多开源项目</a>
			</div>
			<div class="bd">
				<ul>
					`+(function(){
						return list.filter(function(item){
							return item['url'].indexOf(url)==-1;
						}).map(function(item){
							return `<li><a href="${item['url']}" target="_blank">${item['name']}</a></li>`;
						}).join('');
					})()+`
				</ul>
			</div>
		</div>
		<style type="text/css">
			.mod-projects{max-width:960px;margin:0 auto;padding: 30px 0 45px;text-align:center;}
			.mod-projects a{text-decoration:none;color:#333;}
			.mod-projects .hd{line-height:40px;font-size:18px;font-weight:bold;}
			.mod-projects ul{overflow:hidden;}
			.mod-projects li{float:left;width:25%;}
			.mod-projects li a{display:block;margin: 0 1px 2px;line-height:36px;background: #f8f8f8;}
			.mod-projects li a:hover{background: #e9f4ff}
			@media screen and (max-width: 800px){
				.mod-projects li{width:50%;}
			}
		</style>
	`);
})();
