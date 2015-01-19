<?php
	include("include/common.php");
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title><?php echo $title;?></title>
		<meta name="keywords" content="<?php echo $keywords;?>">
		<meta name="description" content="<?php echo $description;?>">
		<link href="public/style/index.css" rel="stylesheet" type="text/css" />
	</head>
	<body>
		<div class="wraper">
			<div class="side">
				<div class="logo">
					<h1>Passerby</h1>
				</div>
				<ul>
					<li<?php if($topic['type']=='all'):?> class="active"<?php endif;?>><a href="<?php echo $domain;?>">全部</a></li>
					<li<?php if($topic['type']=='rss'):?> class="active"<?php endif;?>><a href="<?php echo $domain;?>?topic=rss">订阅</a></li>
					<li<?php if($topic['type']=='collect'):?> class="active"<?php endif;?>><a href="<?php echo $domain;?>?topic=collect">收藏</a></li>
				</ul>
				<ul>
					<?php
						foreach($topics as $item){
							if($topic['type']==$item['type']){
								echo '<li class="active"><a href="',$domain,'?topic=',$item['type'],'">',$item['name'],'</a></li>';
							}else{
								echo '<li><a href="',$domain,'?topic=',$item['type'],'">',$item['name'],'</a></li>';
							}
						}
					?>
				</ul>
				<div class="copy">&copy; passer-by.com</div>
			</div>
			<div class="content">
				<div class="default">
			
				</div>
				<div class="page">
					<?php if(count($page)>0&&!$page['disable']):?>
						<?php if(isset($page['sandbox'])&&$page['sandbox']):?>
							<iframe id="iframe" src="<?php echo $page['url'];?>" width="100%" height="100%" seamless security="restricted" sandbox="allow-same-origin allow-forms allow-scripts allow-popups"></iframe>
						<?php else:?>
							<iframe id="iframe" src="<?php echo $page['url'];?>" width="100%" height="100%"></iframe>
						<?php endif;?>
					<?php else:?>
						<div class="error" id="error">
							<h1>ERROR!</h1>
							<p>漂流中发生搁浅，你可以尝试以下操作</p><br/>
							<p>1.点击访问页面：<a href="<?php echo $page['url'];?>" target="_blank"><?php echo $page['name'];?></a></p>
							<p>2. <a href="javascript:location.reload();" target="_blank">刷新</a> 当前页面</p>
						</div>
					<?php endif;?>
				</div>			
			</div>
		</div>
	</body>
</html>