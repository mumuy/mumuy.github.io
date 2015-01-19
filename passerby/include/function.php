<?php
	//获取当前目录列表
	function getDir($dir){
		$list = array();
		if ($handle = opendir($dir)) {
			while (false !== ($fileName = readdir($handle))) {
				if ($fileName != "." && $fileName != "..") {
					$list[] = $fileName;
				}
			}
		}
		return $list;
	}
?>