/*
    搜索提示 v1.0
    BY:le
*/
(function($) {
    $.fn.suggestion = function(parameter) {
        parameter = parameter || {};
        var defaults = {
        	url:'',						//请求的接口地址
        	suggestionCls:'suggestion',	//提示框的内容class
        	activeCls:'active',			//列表项选中class
        	FieldName:'word',				//当前input表单项在请求接口时的字段名
        	parameter:{},					//其他与接口有关参数
        	get:function(){},				//获得搜索建议:传入一个对象，target表示被建议列表对象,data表示请求到的数据
        	select:function(){}			//选中搜索建议列表项：传入一个对象，target表示当前选中列表项,input表示当前input表单项
        }
        var options = $.extend({}, defaults, parameter);
        var $document = $(document);
        return this.each(function() {
        	//对象定义
        	var $this = $(this);
        	var $form = $this.parents('form');
        	var $suggestion = $form.find('.'+options.suggestionCls);
        	if(!$suggestion.length){
        		$suggestion = $("<div class='"+options.suggestionCls+"'><ul></ul></div>").appendTo($form);
        	}
        	var $list = $suggestion.find('ul');
        	var _height = $this.outerHeight(true);
        	var _width = $this.outerWidth(true);
        	var _text = '';
        	var _hander = 0;
        	var _index = -1;
            var isShow = false;
            var hasData = false;
        	//节点样式
        	$form.css({
        		'position':'relative'
        	});
        	var _top = $this.position().top;
        	var _left = $this.position().left;
        	$this.prop({
        		'autocomplete':'off',
        		'disableautocomplete':true
        	});
        	$suggestion.css({
        		'position':'absolute',
        		'top':_top+_height+'px',
        		'left':_left+'px',
        		'display':'none',
        		'width':_width+'px'
        	});
        	//方法定义
        	//按键松开
        	var up = function(e){
        		e.isPropagationStopped();
        		e.preventDefault();
      		    switch(e.keyCode){
        			case 13:
        			case 38:
        			case 40:
        			break;
        			default:
      					show();
        		}
        	};
        	//按键按下
        	var down = function(e){
        		e.isPropagationStopped();
        		var $items = $suggestion.find('li');
        		var len = $items.length;
        		switch(e.keyCode){
        			case 13:
        				select();
        				if(isShow){
							hide();
							e.preventDefault();
        				}
        			break;
        			case 38:
        				if(_index){
        					_index--;
        					$items.eq(_index).addClass(options.activeCls).siblings().removeClass(options.activeCls);
        				}
        				e.preventDefault();
        			break;
        			case 40:
        				if(_index<len){
        					_index++;
        					$items.eq(_index).addClass(options.activeCls).siblings().removeClass(options.activeCls);
        				}
        				e.preventDefault();
        			break;
        			default:
      					hide();
        		}
        	};
        	//鼠标经过
        	var hover = function(e){
        		e.isPropagationStopped();
        		var $target = $(this);
        		_index = $target.index();
        		$target.addClass(options.activeCls).siblings().removeClass(options.activeCls);
        	};
        	//选中表单项
        	var select = function(){
        		var $target = $list.find('li.active');
        		var status = {
        			'target':$target,
        			'input':$this
        		}
        		options.select(status);
        	};
        	//显示表单项
        	var show = function(){
        		isShow = true;
        		_hander = setTimeout(function(){
					if(isShow){
						var value = $.trim($this.val());
						if(value != _text){ //缓存上次输入
							_index = -1;
							options.parameter[options.FieldName] = _text = value;
							$.get(options.url,options.parameter,function(data){
								var status = {
									'target':$list,
									'data':data
								};
                                hasData = options.get(status)!=false; //如果返回false则判断不含建议数据
								if(hasData){
                                    $suggestion.show();
                                }
							},'jsonp');					
						}else{
                            if(hasData){
                                $suggestion.show();
                            }
						}
					}
        		},'500');  
        	}
        	//隐藏表单项     	      	
        	var hide = function(){
				isShow = false;
        		clearTimeout(_hander);
        		$suggestion.hide(); 
        	};
        	//事件绑定
        	$this.on({
        		'keyup':up,
        		'keydown':down
        	});
        	$list.on('click','li',select).on('mouseenter','li',hover);
        	$document.on({
        		'click':hide
        	});
        });
    };
})(jQuery);