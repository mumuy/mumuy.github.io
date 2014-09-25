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
			type:'outer',           //outer进度计算以进度条宽为准，inner进度计算需扣除条滑块宽
			slide: function(){},	//当前值变化时触发的事件，传入对象:event为事件,value为当前值
			change: function(){}    //当前值变化后触发的事件，传入对象:event为事件,value为当前值
        };
		var options = $.extend({},defaults,options,parameter);
		var $document = $(document);
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
			var _handle_width = $handle.width();
			var _offset = 0;
			if(options.type=='outer'){
				var _length = $this.width()/(options.max - options.min);
			}else{
				var _length = ($this.width()-_handle_width)/(options.max - options.min);
			}
			var _cursor_position = $this.offset().left;
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
				options.slide({event:{},value:value});
			};
			/*私有方法*/
			var touchStart = function(e) {
                isMouseDown = true;
                _offset = $this.offset().left;
				_cursor_position =e.changedTouches[0].pageX-_offset-$handle.position().left;
            };
			var touchMove = function(e){
				stopBubble(e);
				stopDefault(e);
				if(isMouseDown){
					var move = e.changedTouches[0].pageX - _offset;
					_value = Math.floor(move/(_length*options.step))*options.step+options.min;
					if(_cursor_position>0&&_cursor_position<_handle_width){
						_value -=Math.floor(_cursor_position/(_length*options.step))*options.step
					}
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
					_offset = $this.offset().left;
					_cursor_position = e.pageX-_offset-$handle.position().left;
					setSelectable($body,false);
				},
				mouseup:function(e){
					if(isMouseDown){
						isMouseDown = false;
						setSelectable($body,true);
						var move = e.pageX - _offset;
						_value = Math.floor(move/(_length*options.step))*options.step+options.min;
						if(_cursor_position>0&&_cursor_position<_handle_width){
							_value -=Math.floor(_cursor_position/(_length*options.step))*options.step
						}
						_api.setValue();
						options.slide({event:e,value:_value});
						options.change({event:e,value:_value});					
					}
				}
			});
			$document.on({
				mousemove:function(e){
					if(isMouseDown){
						var move = e.pageX - _offset;
						_value = Math.floor(move/(_length*options.step))*options.step+options.min;
						if(_cursor_position>0&&_cursor_position<_handle_width){
							_value -=Math.floor(_cursor_position/(_length*options.step))*options.step
						}
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
		//工具函数
		function stopBubble(e){
			if (e && e.stopPropagation) {
				e.stopPropagation();
			}else if (window.event) {
				window.event.cancelBubble = true;
			}
		}
		function stopDefault(e) { 
			if ( e && e.preventDefault ){
				e.preventDefault();
			}else{
				 window.event.returnValue = false; 
			}
			return false; 
		}
		function setSelectable(obj, enabled) { 
			if(enabled) { 
				obj.removeAttr("unselectable").removeAttr("onselectstart").css("user-select", ""); 
			} else { 
				obj.attr("unselectable", "on").attr("onselectstart", "return false;").css("user-select", "none"); 
			} 
		} 
    };
})(jQuery);