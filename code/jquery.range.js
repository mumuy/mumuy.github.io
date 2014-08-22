/*
    输入范围 v1.0
    BY:le
*/
(function($) {
    $.fn.range = function(parameter,getApi) {
        if(typeof parameter == 'function'){ //重载
			getApi = parameter;
            parameter = {}; 
        }else{
            parameter = parameter || {};
            getApi = getApi||function(){};
        }
        var defaults = {
			valueCls: 'value',		//当前有效值范围显示class
			handleCls: 'handle',	//拖动滑块class
			min: 0,					//变化范围的最小值
			max: 100,				//变化范围的最大值
			value: 1,				//默认显示的值
			step: 1,				//每次移动的步长
			slide: function(){},	//当前值变化时触发的事件，传入对象:event为事件,value为当前值
			change: function(){}    //当前值变化后触发的事件，传入对象:event为事件,value为当前值
        };
		var options = $.extend({},defaults,options,parameter);
		var $window = $(window);
		var $body = $("body");
        return this.each(function() {
            //对象定义
			var _self = this;
            var $this = $(this);
			var $value = $("<div class='"+options.valueCls+"'></div>").appendTo($this);
			var $handle = $("<div class='"+options.handleCls+"'></div>").appendTo($this);
			//全局变量
			var _api = {};
			var _value = options.value;
			var _length = $this.width()/(options.max - options.min);
			var _handle_width = $handle.width();
			var _cursor_position = $value.offset().left;
			var isMouseDown = false;
			//样式初始化
			$this.css({
				'position':'relative'
			});
			$value.css({
				'height':'100%'
			});
			$handle.css({
				'position':'absolute'
			});
			/****** 共有方法 ******/
			//移动到指定值
			_api.setValue = function(value){
				_value = value||_value;
				_value = Math.min(_value,options.max);
				_value = Math.max(_value,options.min);
				$this.val(_value);
				$value.css({
					'width':(_value-options.min)*_length
				});
				$handle.css({
					'left':(_value-options.min)*_length
				});
			};
			/*私有方法*/
			var touchStart = function(e) {
                isMouseDown = true;
				
            };
			var touchMove = function(e){
				if(isMouseDown){
					_value = Math.floor((e.changedTouches[0].pageX - _cursor_position)/(_length*options.step))*options.step+options.min;
					_api.setValue();
					options.slide({event:e,value:_value});
				}  
			};
			var touchEnd = function(e){
				if(isMouseDown){
					isMouseDown = false;
					setSelectable($body,true);						
					options.change({event:e,value:_value});
				}
			}
			//事件绑定
			if(_self.addEventListener){
                _self.addEventListener("touchstart", touchStart);
                _self.addEventListener("touchmove", touchMove);
                _self.addEventListener("touchend", touchEnd);
            }
			$this.on({
				mousedown:function(e){
					isMouseDown = true;
					setSelectable($body,false);
				},
				mouseup:function(e){
					if(isMouseDown){
						isMouseDown = false;
						setSelectable($body,true);
						_value = Math.floor((e.pageX - _cursor_position)/(_length*options.step))*options.step+options.min;
						_api.setValue();
						options.change({event:e,value:_value});					
					}
				}
			});
			$window.on({
				mousemove:function(e){
					if(isMouseDown){
						_value = Math.floor((e.pageX - _cursor_position)/(_length*options.step))*options.step+options.min;
						_api.setValue();
						options.slide({event:e,value:_value});
					}  
				},
				mouseup:function(e){
					if(isMouseDown){
						isMouseDown = false;
						setSelectable($body,true);						
						options.change({event:e,value:_value});
					}
				}
			});
			//初始化
			_api.setValue(_value);
			getApi(_api);
        });
		function setSelectable(obj, enabled) { 
			if(enabled) { 
				obj.removeAttr("unselectable").removeAttr("onselectstart").css("user-select", ""); 
			} else { 
				obj.attr("unselectable", "on").attr("onselectstart", "return false;").css("user-select", "none"); 
			} 
		} 
    };
})(jQuery);