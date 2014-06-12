/*
    轮播 v1.11
    BY:le
*/
(function($) {
    $.fn.slider = function(parameter,getApi) {
        if(typeof parameter == 'function'){ //重载
            getApi = parameter;
            parameter = {};
        }else{
            parameter = parameter || {};
            getApi = getApi||function(){};
        }
        var defaults = {
            /* 节点绑定 */
            contentCls: "content",      //轮播内容列表的class
            navCls: "nav",              //轮播导航列表的class
            prevBtnCls: "prev",         //向前一步的class
            nextBtnCls: "next",         //向后一步的class
            /* 动画相关 */
            activeTriggerCls: "active", //导航选中时的class
            disableBtnCls: "disable",   //按键不可用时的class
            hoverCls: "hover",          //当鼠标移至相应区域时获得的class
            steps: 1,                   //移动帧数
            view: 0,                    //可见区域帧数
            direction: "x",             //轮播的方向
            inEndEffect: "switch",      //"switch"表示来回切换,"cycle"表示循环,"none"表示无效果
            hasTriggers: true,          //是否含有导航触发点
            triggerCondition:"*",       //触发点的条件(有时需排除一些节点)
            triggerType: "mouse",       //导航触发事件:"mouse"表鼠标移入时触发,"click"表示鼠标点击时触发
            activeIndex: 0,             //默认选中帧的索引
            pointerType: "click",       //左右箭头的触发事件
            auto: false,                //是否自动播放
            animate: true,              //是否使用动画滑动
            delay: 3000,                //自动播放时停顿的时间间隔
            duration: 500,              //轮播的动画时长
            easing:"easeIn",            //切换时的动画效果
            keyboardAble:false,         //是否允许键盘按键控制
            touchable: true,            //是否允许触碰
            sensitivity: 0.4,           //触摸屏的敏感度,滑动当前帧的百分比移动该帧，该值越小越敏感
            scrollable:false,           //是否允许滚动滚动轴时换屏
            /* 对外事件接口 */
            beforeEvent: function() {    //移动前执行,返回flase时不移动;传入一个对象,包含：index事件发生前索引,count帧长度,destination方向(prev向前,next向后,数字为相应的索引);
            },
            afterEvent: function() {     //移动后执行;传入一个对象,包含：index事件发生前索引,count帧长度,destination方向(prev向前,next向后,数字为相应的索引);
            }
        };
        var options = $.extend({}, defaults, parameter);
        var $window = $(window);    //窗口对象
        return this.each(function() {
            //对象定义
            var $this = $(this);
            var $list1 = $this.find("." + options.contentCls);
            var $item = $list1.children();
            var $prev = $this.find("." + options.prevBtnCls);
            var $next = $this.find("." + options.nextBtnCls);
            var $nav_list = $();
            //全局变量
            var _self = this;
            var _api = {}; //对外的函数接口
            var _distance = options.direction=="x"?$item.outerWidth(true):$item.outerHeight(true);  //一帧的移动距离
            var _size = $item.length;   //帧数
            var _index = options.activeIndex<0?_size + options.activeIndex:options.activeIndex; //当前选中帧
            var _inner = _size * _distance; //组件的内尺寸
            var _outer = options.direction=='x'?$this.width():$this.height(); //组件的外尺寸
            var _view = options.view || parseInt(_outer / _distance)||1;   //可视的帧数
            var _start = {};    //触碰的起点坐标
            var _position = {}; //当前触碰点坐标
            var _startTime = 0;
            var _hander = null; //自动播放的函数句柄
            var _param = options.direction=='x'?'left':'top';   //移动控制参数,方向为x控制left,方向为y控制top
            var _t = 0; //全局的时间戳
            //样式初始化
            var $outer = $list1.css('position','absolute').parent();
            if($outer.css('position')!='absolute'){
                $outer.css('position','relative');
            }
            if(_param=="left"){
                 $list1.css('width',_inner);
            }
            //节点添加
            if (options.hasTriggers) {  //是否存在导航
                if (!$this.find("."+options.navCls).length) {   //使用children找不到
                    var list_str = "";
                    for (var i = 1; i <= _size ; i++) {
                        list_str += "<li>" + i + "</li>";
                    }
                    $this.append("<ul class='" + options.navCls + "'>" + list_str + "</ul>")
                }
                options.triggerType += options.triggerType === "mouse" ? "enter" : "";  //使用mouseenter防止事件冒泡
                $nav_list = $this.find("." + options.navCls + " > "+options.triggerCondition).bind(options.triggerType, function(e) {
                    var index = $nav_list.index(this);
                    var status = {
                        index: _index,
                        count: _size,
                        destination: index,
                        event:e
                    };
                    if(options.beforeEvent(status) !== false){
                        if (options.inEndEffect === "cycle") {
                            _index = index;
                        } else {
                            _index = index > _size - _view ? _size - _view : index;
                        }
                        slide(options.animate);                        
                    }
                });
            }
            if (options.inEndEffect === "cycle") {
                var $list2 = $list1.clone().insertAfter($list1);
            }
            var $lists = $this.find("." + options.contentCls);
            /****** 共有方法 ******/
            //上一帧
            _api.prev = function(e) {
                var status = {
                    index: _index,
                    count: _size,
                    destination: "prev",
                    event:e
                };
                if (options.beforeEvent(status) !== false) {
                    switch (options.inEndEffect) {
                        case "switch":
                            if (_index) {
                                _index -= _index > options.steps ? options.steps : _index;
                            } else {
                                _index = _size - _view;
                            }
                            break;
                        case "cycle":
                            if ($list1.is(':animated') || $list2.is(':animated')) { //如正在动画中则不进行下一步
                                return false;
                            }
                            if (_index - options.steps < 0) {
                                $list2.css(_param,- (_size+_index) * _distance + 'px');
                                $list1 = [$list2, $list2 = $list1][0]; //两列表身份互换
                                _index += _size - options.steps;
                            } else {
                                _index -= options.steps;
                            }
                            break;
                        default:
                            if (_index) {
                                _index -= _index > options.steps ? options.steps : _index;
                            }
                    }
                    slide(options.animate);
                }
            };
            //下一帧
           _api.next = function(e){
                var status = {
                    index: _index,
                    count: _size,
                    destination: "next",
                    event:e
                };
                if (options.beforeEvent(status) !== false) {
                    switch (options.inEndEffect) {
                        case "switch":
                            var lastindex = _size - _index - _view;
                            if (lastindex) {
                                _index += lastindex > options.steps ? options.steps : lastindex;
                            } else {
                                _index = 0;
                            }
                            break;
                        case "cycle":
                            if ($lists.is(':animated')) { //如正在动画中则不进行下一步
                                return false;
                            }
                            _index += options.steps; //索引值计算
                            break;
                        default:
                            var lastindex = _size - _index - _view;
                            if (lastindex) {
                                _index += lastindex > options.steps ? options.steps : lastindex;
                            }
                    }
                    slide(options.animate);    
                }
            };
            //开始播放
            _api.start = function(){
                _api.stop();
                _hander = setInterval(_api.next, options.delay);
            };
            //停止播放
            _api.stop = function(){
                if (_hander) {
                    clearInterval(_hander);
                }
            };
            //设置当前帧
            _api.setIndex = function(index,isAnimate){
                _index = index%_size;
                slide(isAnimate);
            };  
            //设置移动帧数
            _api.setSteps = function(steps){
                options.steps = steps;
            };
            //设置可视帧数
            _api.setView = function(view){
                _view = options.view = view;
            };
            //设置动画停顿时间间隔
            _api.setDelay = function(delay){
                options.delay = delay;
            };
            //设置动画时长
            _api.setDuration = function(duration){
                options.duration = duration;
            };          
            //获取当前帧
            _api.getIndex = function(index){
                return _index;
            };
            /****** 私有方法 ******/
            //移动
            function slide(isAnimate,s_duration) {
                if(_inner>_outer){ //只有在内层超过外层时移动
                    var duration = isAnimate !=false ? (s_duration||options.duration):0; //判断滑块是否需要移动动画
                    var params = {};
                    switch(options.inEndEffect){
                        case "switch":
                            _index %= _size;
                            $nav_list.removeClass(options.activeTriggerCls).eq(_index).addClass(options.activeTriggerCls);   //导航选中
                            params = _param=="left"?{'left': -_index * _distance}:{'top': -_index * _distance};
                            $list1.stop().animate(params,{easing:options.easing, duration: duration, complete:function() {
                                var status = {
                                    index: _index,
                                    count: _size
                                };
                                options.afterEvent(status);
                            }});
                        break;
                        case "none":
                            _index = Math.min(_index,_size-_view);
                            $nav_list.removeClass(options.activeTriggerCls).eq(_index).addClass(options.activeTriggerCls);   //导航选中
                            $prev.toggleClass(options.disableBtnCls,_index==0);
                            $next.toggleClass(options.disableBtnCls,_index==_size-_view);                           
                            params = _param=="left"?{'left': -_index * _distance}:{'top': -_index * _distance};
                            $list1.stop().animate(params,{easing:options.easing, duration: duration, complete:function() {
                                var status = {
                                    index: _index,
                                    count: _size
                                };          
                                options.afterEvent(status);
                            }});
                        break;
                        case "cycle":
                            $nav_list.removeClass(options.activeTriggerCls).eq(_index % _size).addClass(options.activeTriggerCls);   //导航选中
                            params = _param=="left"?{'left': -_index * _distance}:{'top': -_index * _distance};
                            $list1.stop().animate(params,{easing:options.easing, duration: duration, complete:function() {
                                var status = {
                                    index: _index%_size,
                                    count: _size
                                };          
                                options.afterEvent(status);
                            }});
                            params = _param=="left"?{'left':(_size - _index) * _distance}:{'top':(_size - _index) * _distance};
                            $list2.stop().animate(params,{easing:options.easing, duration: duration, complete:function(){
                                if (_index >= _size) {
                                    _index %= _size;
                                    $list1.css(_param, (_size - _index) * _distance+ 'px');
                                    $list1 = [$list2, $list2 = $list1][0]; //两列表身份互换
                                }
                            }});
                        break;
                    }
                }
            };
            //窗口变化
            function window_resize(){
                _distance = options.direction=="x"?$item.outerWidth(true):$item.outerHeight(true);
                _inner = _size * _distance;
                _outer = options.direction=='x'?$this.width():$this.height();
                if(_param=="left"){
                    $lists.css('width',_inner);
                }
                slide(false);
            }
            //滚动轴
            function scroll(e){
                 e = e||window.event;
                stopBubble(e);
                stopDefault(e);
                var t = +new Date();
                if(t-_t>options.duration){ //防止滚动太快动画没完成
                    _t = t;
                    var delta = -e.wheelDelta/120||e.detail/3;
                    delta>0?_api.next(e):_api.prev(e);                      
                }               
            }           
            //触摸开始
            function touchStart(e) {
                _startTime = new Date();
                stopBubble(e);
                _api.stop();
                _start = {
                    pageX: e.changedTouches[0].pageX,
                    pageY: e.changedTouches[0].pageY
                };
                _position.change1 = _param=="left"?$list1.position().left:$list1.position().top;
                if (options.inEndEffect == "cycle") {   
                    _position.change2 = _param=="left"?$list2.position().left:$list2.position().top;
                }
            }
            //触碰移动
            function touchMove(e) {
                stopBubble(e);
                var current = {
                    pageX: e.changedTouches[0].pageX,
                    pageY: e.changedTouches[0].pageY
                };
                var move = options.direction=="x"?current.pageX - _start.pageX:current.pageY - _start.pageY;//移动距离触发点的距离
                var steps = Math.ceil(Math.abs(move / _distance));  //移动中跳过的帧数
                if (options.direction=="x"&&Math.abs(current.pageY - _start.pageY) < Math.abs(move)||options.direction=="y") {  //chrome移动版下，默认事件与自定义事件的冲突
                    stopDefault(e);
                    if (options.inEndEffect == "cycle") {
                        if (move > 0) {  //手指向右滑
                            if (_index - steps < 0) {   //是否置换
                                _position.change2 = -(_index + _size) * _distance;
                                $list2.css(_param, _position.change2 + 'px');
                                $list1 = [$list2, $list2 = $list1][0]; //两列表身份互换
                                _position.change1 = [_position.change2, _position.change2 = _position.change1][0];
                                _index += _size;
                            }
                        } else {    //手指向左滑
                            if (_index + steps > _size) {
                                _position.change1 = (2*_size - _index) * _distance;
                                $list1.css(_param, _position.change1 + 'px');
                                $list1 = [$list2, $list2 = $list1][0]; //两列表身份互换
                                _position.change1 = [_position.change2, _position.change2 = _position.change1][0];
                                _index -= _size;
                            }
                        }
                        $list1.css(_param, _position.change1 + move);
                        $list2.css(_param, _position.change2 + move);
                    } else {
                        if (_index === 0 && move > 0 || _index === _size - _view && move < 0) {  //到达尽头时移动受阻
                            move *= 0.25;
                        }
                        $list1.css(_param, _position.change1 + move);
                    }
                }
            }
            //触碰结束
            function touchEnd(e) {
                var endTime = new Date();
                if (options.auto) {
                    _api.start();
                }
                var current = {
                    pageX: e.changedTouches[0].pageX,
                    pageY: e.changedTouches[0].pageY
                };
                var move = options.direction=="x"?current.pageX - _start.pageX:current.pageY - _start.pageY;
                var times = Math.abs(move / _distance);
                var steps = times - Math.floor(times) > options.sensitivity ? Math.ceil(times) : Math.floor(times);
                if (steps) {                                        //如果判定移动了一定距离
                    if (options.inEndEffect == "cycle") {
                        if (move > 0) {
                            _index -= steps;
                        } else {
                            _index += steps;
                        }
                    } else {
                        if (move > 0) {
                            if (_index) {
                                _index -= _index > steps ? steps : _index;
                            }
                        } else {
                            var lastindex = _size - _index - _view;
                            if (lastindex) {
                                _index += lastindex > steps ? steps : lastindex;
                            }
                        }
                    }
                }else{
                    if(endTime-_startTime<250&&Math.abs(move)>10){  //当用户滑动的距离不够，但时间足够短，判定为切换一帧;绝对值判断为了区分click和touchMove事件
                        if (move > 0) {
                            if (_index) {
                                _index -= _index > 1 ? 1 : _index;
                            }
                        } else {
                            var lastindex = _size - _index - _view;
                            if (lastindex) {
                                _index += lastindex > 1 ? 1 : lastindex;
                            }
                        }
                    }
                }
                slide(true,300);
            }
            //键盘处理
            function keyboard(e){
                switch (e.which) {
                    case 37:
                        _api.prev(e);
                        break;
                    case 39:
                        _api.next(e);
                        break;
                }
            }
            //初始化  
            //执行默认行为
            slide(false);   //默认选中状态
            if (options.auto) {
                _api.start();
                $this.hover(_api.stop, _api.start);
            }
            $this.hover(function(){
                 $this.toggleClass(options.hoverCls);
            });
            //事件绑定
            if(options.pointerType === "click"){
                $prev.bind("click",_api.prev).hover(function() {
                    $(this).toggleClass(options.hoverCls);
                });
                $next.bind("click",_api.next).hover(function() {
                    $(this).toggleClass(options.hoverCls);
                });         
            }else{
                var _h = null;
                $prev.on({
                    'mouseenter':function(){
                        _index = 0;
                        slide();
                    },
                    'mouseleave':function(){
                        _index = Math.floor(-$list1.position().left/_distance);
                        slide(true,options.duration/2);
                    }
                });
                $next.on({
                    'mouseenter':function(){
                        _index = _size - _view;
                        slide();
                    },
                    'mouseleave':function(){
                        _index = Math.ceil(-$list1.position().left/_distance);
                        slide(true,options.duration/2);
                    }
                });
            }
            if(_self.addEventListener&&options.touchable){
                _self.addEventListener("touchstart", touchStart);
                _self.addEventListener("touchmove", touchMove);
                _self.addEventListener("touchend", touchEnd);
            }
            $window.resize(window_resize); //当窗体大小改变时，重新计算相关参数
            if(options.keyboardAble){
                $window.keydown(keyboard);
            }
            if(options.scrollable){
                if(document.addEventListener){
                    _self.addEventListener('DOMMouseScroll',scroll,false);
                }
                _self.onmousewheel = scroll;                
            }
            getApi(_api);
        });
    };
    //jquery 动画扩展
    $.extend( $.easing,
    {
        def: 'easeIn',
        swing: function (x, t, b, c, d) {
            return $.easing[$.easing.def](x, t, b, c, d);
        },
        easeIn: function (x, t, b, c, d) {
            return c*(t/=d)*t + b;
        },
        easeOut: function (x, t, b, c, d) {
            return -c *(t/=d)*(t-2) + b;
        },
        expoin: function (x, t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        expoout: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        expoinout: function (x, t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        elasin: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        },
        elasout: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
        },
        elasinout: function (x, t, b, c, d) {
            var s=1.70158;var p=0;var a=c;
            if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
            if (a < Math.abs(c)) { a=c; var s=p/4; }
            else var s = p/(2*Math.PI) * Math.asin (c/a);
            if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
        },
        backin: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*(t/=d)*t*((s+1)*t - s) + b;
        },
        backout: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        },
        backinout: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158; 
            if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
        },
        bouncein: function (x, t, b, c, d) {
            return c - $.easing.bounceout(x, d-t, 0, c, d) + b;
        },
        bounceout: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
        bounceinout: function (x, t, b, c, d) {
            if (t < d/2) return $.easing.bouncein (x, t*2, 0, c, d) * .5 + b;
            return $.easing.bounceout(x, t*2-d, 0, c, d) * .5 + c*.5 + b;
        }
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
})(jQuery);
