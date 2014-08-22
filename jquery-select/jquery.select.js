/*
    自定义下拉框 v1.0
    BY:le
*/
(function($) {
    $.fn.select = function(parameter,getApi) {
        if(typeof parameter == 'function'){ //重载
			getApi = parameter; 
            parameter = {};
        }else{
            parameter = parameter || {};
            getApi = getApi||function(){};
        }
        var defaults = {
			selectCls:'select',
			boxCls:'box',
			innerCls:'inner',
			listCls:'list',
			activeCls:'active'
        };
		var options = $.extend({},defaults,options,parameter);
		var $window = $(window);
		var $document = $(document);
        return this.each(function() {
            //对象定义
			var _self = this;
            var $this = $(this);
			var $inner = $("<div class='"+options.innerCls+"'></div>");
			var $list = $("<ul class='"+options.listCls+"'></ul>");
			var $box = $("<div class='"+options.boxCls+"'></div>");
			var $select = $("<div class='"+options.selectCls+"'></div>");
			$inner.append($list);
			$select.append($box).append($inner);
			$this.hide().after($select);
			var $options = $this.find('option');
			$options.each(function(){
				var $this = $(this);
				$list.append("<li>"+$this.text()+"</li>");
			});
			var $items = $list.find('li');
			var _api = {};
			var _index = 0;
			//样式修改
			$select.css({
				'position':'relative'
			});
			$inner.css({
				'display':'none',
				'position':'absolute',
				'width':'100%'
			});
			//私有方法
        	//按键按下
        	var down = function(e){
        		e.isPropagationStopped();
        		switch(e.keyCode){
        			case 13:
						$this.val($options.eq(_index).val());
						_api.select();
						$inner.hide();
        			break;
        			case 38:
        				if(_index>0){
        					_index--;
        					$items.eq(_index).addClass(options.activeCls).siblings().removeClass(options.activeCls);
                            _api.select();
        				}
        				e.preventDefault();
        			break;
        			case 40:
        				if(_index<$items.length-1){
        					_index++;
        					$items.eq(_index).addClass(options.activeCls).siblings().removeClass(options.activeCls);
                           _api.select();
        				}
        				e.preventDefault();
        			break;
        		}
        	};
			//公有方法
			_api.select = function(value){
				if(value){
					$this.val(value);
					_index = $options.filter(':selected').index();
				}
				$box.text($options.eq(_index).text());
				$items.eq(_index).addClass(options.activeCls).siblings().removeClass(options.activeCls);
			}; 
			//事件绑定
			$box.click(function(){
				$inner.toggle();
				return false;
			});
			$items.on({
				'mouseenter':function(){
					$(this).addClass(options.activeCls).siblings().removeClass(options.activeCls);
				},
				'click':function(){
					_index = $(this).index();
					var $option = $options.eq(_index);
					var value = $option.val();
					var text = $option.text();
					$this.val(value);
					$box.text(text);
				}
			});
			$document.click(function(){
				$inner.hide();
			});
			$window.on({
				'keydown':down
			});
			//初始化
			_api.select($this.val());
			getApi(_api);
		});
    };
})(jQuery);