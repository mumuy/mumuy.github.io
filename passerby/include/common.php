<?php
	include("include/config.php");		//加载配置
	include("include/function.php");	//函数

	srand ((float)microtime()*1000000); 
	$dir = 'data';
	$files = getDir($dir);
	$list = array();
	$topic = array(		//频道
		'type'=>'all'
	);
	$data = array();	//频道数据
	foreach ($topics as $item) {
		if(in_array($item['type'].'.php',$files)){
			$list[] = $item['type'].'.php';
			if(isset($_GET['topic'])&&$_GET['topic']==$item['type']){
				$topic = $item;
			}
		}
	}
	if($topic['type']=='all'){
		$file = $list[array_rand($list)];	//随机频道
		$title = '路人甲 - 随机网址导航';
		$keywords = '上网导航,随机导航,网址导航,随机浏览,上网冲浪,任意门';
		$description = '路人甲,最有新意的随机导航网,发现你的兴趣,打发你的时间';
	}else{
		$file = $topic['type'].'.php';
		$title = '路人甲 - 随机网址导航 '.$topic['name'].'网址推荐';
		$keywords = '随机导航,'.$topic['name'].'网站,'.$topic['name'].'网址导航,'.$topic['name'].'网址推荐,'.$topic['name'].'网址大全';
		if($topic['desc']){
			$description = $topic['desc'];
		}else{
			$description = '最新最全的'.$topic['name'].'网站推荐,尽在passerby（路人甲导航网）,好网站随时掌握';
		}
	}
	include ($dir.'/'.$file);  									//加载频道数据
	$page = count($data)>0?$data[array_rand($data)]:array();	//随机页
	//预读页面头部，判断状态
	$page['disable'] = false;	
	$header = get_headers($page['url'],1);
	if(isset($header['X-Frame-Options'])&&($header['X-Frame-Options']=='DENY'||$header['X-Frame-Options']=='SAMEORIGIN')){
		$page['disable'] = true;
	}
?>