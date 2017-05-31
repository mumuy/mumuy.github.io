//创建二维码图片类
function createQRImage(id, opts, callback) {
    callback = callback ? callback : nullFun;
    /* 默认参数 */
    var defaults = {
        text: 'http://passer-by.com/', //图片内容
        width: 300, //图片宽度
        margin: 10, //外边距
        bgColor: '#fff', //背景颜色
        fgColor: '#000', //前景颜色
        inptColor: null, //定位点内点颜色
        ptColor: null, //定位点外点颜色
        gcColor: null, //渐变颜色
        logoimg: null, //logo图片
    };
    var options = $.extend({}, defaults, opts);
    /* 私有属性:过程数据量 */
    var _self = this;//当前对象
    var _canvas = document.getElementById(id);
    var _data = null;   //二维码数据
    var _pxWidth = 0;//单位点像素宽度
    var _logoOptions = {};//logo相对画布默认尺寸的参数，实际值需要乘放大倍数
    var _gcColor = null; //缓存渐变色
    var _width = 300;//缓存画布宽度
    var _images_model = 0;
    /*最终画图算法*/
    this.drawImage = function(callback) {
        callback = callback || nullFun;
        //获取画布对象
        var context = _canvas.getContext("2d");
        _canvas.width = _canvas.height = options.width;
        //填充背景色
        context.fillStyle = options.bgColor;
        context.fillRect(0, 0, options.width, options.width);
        var colors = '';
        var datalen = _data.length;
        _pxWidth = (options.width - options.margin * 2) / datalen;   //计算像素点宽
        var halfwidth = options.width / 2;
        //渐变色
        if (options.gcColor) {
            _gcColor = getGcColor(context, options.fgColor, halfwidth);
        }
        for (var i = 0; i < datalen; i++) {
            for (var j = 0; j < datalen; j++) {
                //设置点的颜色
                if(options.gcColor != null){
                    colors = _gcColor;
                }else{
                    colors = options.fgColor;       //前景颜色
                }
                context.fillStyle = colors;
                context.strokeStyle = colors;
                if(isPositionPoint(i, j, datalen)){
                    if (options.ptColor || options.inptColor) {
                        colors = setPtColor(i, j, datalen);   //定点颜色
                    }
                    context.fillStyle = colors;
                    context.strokeStyle = colors;
                    if (getTrue(i, j)) {
                        //绘点
                        var cx = j * _pxWidth + options.margin;
                        var cy = i * _pxWidth + options.margin + _pxWidth / 2;
                        context.beginPath();
                        context.moveTo(cx, cy);
                        if ((getTrue(i, j - 1) || getTrue(i - 1, j)) || (getTrue(i - 1, j - 1))) {
                            drawRightAngle(context, j, i, 0);
                        } else {
                            drawRoundBrick(context, j, i, 0);
                        }
                        if ((getTrue(i - 1, j) || getTrue(i, j + 1)) || (getTrue(i - 1, j + 1))) {
                            drawRightAngle(context, j, i, 1);
                        } else {
                            drawRoundBrick(context, j, i, 1);
                        }
                        if ((getTrue(i + 1, j) || getTrue(i, j + 1)) || (getTrue(i + 1, j + 1))) {
                            drawRightAngle(context, j, i, 2);
                        } else {
                            drawRoundBrick(context, j, i, 2);
                        }
                        if ((getTrue(i + 1, j) || getTrue(i, j - 1)) || (getTrue(i + 1, j - 1))) {
                            drawRightAngle(context, j, i, 3);
                        } else {
                            drawRoundBrick(context, j, i, 3);
                        }
                        context.closePath();
                        context.fill();
                        context.stroke();
                    } else {
                        if (getTrue(i - 1, j) && getTrue(i, j - 1)) {
                            fillRound(context, j, i, 0, colors);
                        }
                        if (getTrue(i + 1, j) && getTrue(i, j - 1)) {
                            fillRound(context, j, i, 3, colors);
                        }
                        if (getTrue(i + 1, j) && getTrue(i, j + 1)) {
                            fillRound(context, j, i, 2, colors);
                        }
                        if (getTrue(i - 1, j) && getTrue(i, j + 1)) {
                            fillRound(context, j, i, 1, colors);
                        }
                    }
                } else if(getTrue(i, j)){
                    context.beginPath();
                    context.rect((j+1)*_pxWidth,(i+1)*_pxWidth,_pxWidth,_pxWidth);
                    context.closePath();
                    context.fill();
                    context.stroke();
                }
            }
        }
        context.restore();
        //logo图片
        if (options.logoimg != null) {
            var zoom = options.width / defaults.width;
            drawStroke(context, options.logoimg, 3 * zoom, _logoOptions.left * zoom, _logoOptions.top * zoom, _logoOptions.width * zoom, _logoOptions.height * zoom);
        }
        callback();
    };
    /*获取画布中的图像数据*/
    this.getBase64 = function() {
        return _canvas.toDataURL();
    };
    /************************  以下为私有方法，外部组件不能调用  ************************/
    /* 空函数 */
    var nullFun = function() {
    };
    /*加载图片*/
    var loadImages = function(image_urls, callback) {
        callback = callback || nullFun;
        var images = [];
        function loaded(i) {
            if (i < image_urls.length) {
                var img = new Image();
                img.src = image_urls[i];
                images.push(img);
                img.onload = function() {
                    loaded(++i);
                }
            }else{
                callback(images);
                return;
            }
        }
        if (image_urls.length > 0) {
            loaded(0);
        } else {
            callback();
        }
    }
    /*获取文字二进制码*/
    var getData = function(callback) {
        callback = callback || nullFun;
        /* 开源库jquery-qrcode，二维码数据计算的核心类 */
        var qrcode = new QRCode(-1, QRErrorCorrectLevel['H']);      //实例化类
        qrcode.addData(utf16to8(options.text));     //设置文字内容及中文转码处理
        qrcode.make();      //生成二维码数据
        _data = qrcode.modules;     //获取数据
        var len = qrcode.getModuleCount();
        _self.drawImage();
        callback();
    };
    /*判断当前像素点是否存在*/
    var getTrue = function(x, y) {
        var len = _data.length;
        return (!(x < 0 || y < 0 || x >= len || y >= len) && _data[x][y]);
    };
    /* 编码转换 */
    function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }
    /* 判断是否是定位点 */
    var isPositionPoint = function(i, j, datalen) {
        var status = 0;
        if ((i >= 2 && i < 5) && (j >= 2 && j < 5)) {//左上角内点
            status = 1;
        } else if (i < 7 && j < 7) {//左上角外框
            status = 1;
        } else if ((i >= datalen - 5 && i < datalen - 2 && j >= 2 & j < 5)) {//左下角内点
            status = 1;
        } else if ((i >= datalen - 7 && i < datalen && j >= 0 & j < 7)) {//左下角外框
            status = 1;
        } else if ((i >= 2 && i < 5 && j >= datalen - 5 & j < datalen - 2)) {//右上角内点
            status = 1;
        } else if ((i >= 0 && i < 7 && j >= datalen - 7 & j < datalen)) {//右上角外框
            status = 1;
        }
        return status;
    };
    /* 绘制角 */
    var drawRightAngle = function(context, x, y, dir) {
        var cx = 0, cy = 0;
        switch (dir) {
            case 0:
                cx = x * _pxWidth + options.margin;
                cy = y * _pxWidth + options.margin;
                context.lineTo(cx, cy);
                break;
            case 1:
                cx = x * _pxWidth + _pxWidth + options.margin;
                cy = y * _pxWidth + options.margin;
                context.lineTo(cx, cy);
                break;
            case 2:
                cx = x * _pxWidth + _pxWidth + options.margin;
                cy = y * _pxWidth + _pxWidth + options.margin;
                context.lineTo(cx, cy);
                break;
            case 3:
                cx = x * _pxWidth + options.margin;
                cy = y * _pxWidth + _pxWidth + options.margin;
                context.lineTo(cx, cy);
                break;
            default:
        }
    };
    /* 绘制填补角 */
    var drawRoundBrick = function(context, x, y, dir) {
        var cx = 0, cy = 0;
        switch (dir) {
            case 0:
                cx = x * _pxWidth + _pxWidth/2 + options.margin;
                cy = y * _pxWidth + _pxWidth/2 + options.margin;
                context.arc(cx, cy, _pxWidth/2, Math.PI, Math.PI * 1.5, false);
                cx = x * _pxWidth + _pxWidth / 2 + options.margin;
                cy = y * _pxWidth + options.margin;
                context.lineTo(cx, cy);
                break;
            case 1:
                cx = x * _pxWidth + _pxWidth - _pxWidth/2 + options.margin;
                cy = y * _pxWidth + _pxWidth/2 + options.margin;
                context.arc(cx, cy, _pxWidth/2, Math.PI * 1.5, Math.PI * 2, false);
                break;
            case 2:
                cx = x * _pxWidth + _pxWidth - _pxWidth/2 + options.margin;
                cy = y * _pxWidth + _pxWidth - _pxWidth/2 + options.margin;
                context.arc(cx, cy, _pxWidth/2, 0, Math.PI / 2, false);
                break;
            case 3:
                cx = x * _pxWidth + _pxWidth/2 + options.margin;
                cy = y * _pxWidth + _pxWidth - _pxWidth/2 + options.margin;
                context.arc(cx, cy, _pxWidth/2, Math.PI / 2, Math.PI, false);
                break;
            default:
        }
    };
    /* 填充圆 */
    var fillRound = function(context, x, y, dir, colors) {
        var cx, cy;
        var halfwidth = options.width / 2;
        context.beginPath();
        if (options.gcColor != null) {//有渐变色
            colors = _gcColor;
        }
        context.fillStyle = colors;
        context.strokeStyle = colors;
        switch (dir) {
            case 0:
                cx = x * _pxWidth + _pxWidth/2 + options.margin;
                cy = y * _pxWidth + _pxWidth/2 + options.margin;
                context.arc(cx, cy, _pxWidth/2, Math.PI, Math.PI * 1.5, false);
                cx = x * _pxWidth + options.margin;
                cy = y * _pxWidth + options.margin;
                break;
            case 1:
                cx = x * _pxWidth + _pxWidth - _pxWidth/2 + options.margin;
                cy = y * _pxWidth + _pxWidth/2 + options.margin;
                context.arc(cx, cy, _pxWidth/2, Math.PI * 1.5, Math.PI * 2, false);
                cx = x * _pxWidth + _pxWidth + options.margin;
                cy = y * _pxWidth + options.margin;
                break;
            case 2:
                cx = x * _pxWidth + _pxWidth - _pxWidth/2 + options.margin;
                cy = y * _pxWidth + _pxWidth - _pxWidth/2 + options.margin;
                context.arc(cx, cy, _pxWidth/2, 0, Math.PI / 2, false);
                cx = x * _pxWidth + _pxWidth + options.margin;
                cy = y * _pxWidth + _pxWidth + options.margin;
                break;
            case 3:
                cx = x * _pxWidth + _pxWidth/2 + options.margin;
                cy = y * _pxWidth + _pxWidth - _pxWidth/2 + options.margin;
                context.arc(cx, cy, _pxWidth/2 , Math.PI / 2, Math.PI, false);
                cx = x * _pxWidth + options.margin;
                cy = y * _pxWidth + _pxWidth + options.margin;
                break;
            default:
        }
        context.lineTo(cx, cy);
        context.closePath();
        context.fill();
        context.stroke();
    };
    /*设置渐变色*/
    var getGcColor = function(context, colors, halfwidth) {
        var grd = context.createRadialGradient(0, 0, 0, halfwidth, halfwidth, options.width);//反斜线渐变
        grd.addColorStop(0, colors);
        grd.addColorStop(1, options.gcColor);
        return grd;
    };
    /*设置定点色*/
    var setPtColor = function(i, j, datalen) {
        var colors;
        var inpt = (options.inptColor) ? options.inptColor : options.fgColor;
        var pt = (options.ptColor) ? options.ptColor : options.fgColor;
        if ((i >= 2 && i < 5) && (j >= 2 && j < 5)) {//左上角内点
            colors = inpt;
        } else if (i < 7 && j < 7) {//左上角外框
            colors = pt;
        } else if ((i >= datalen - 5 && i < datalen - 2 && j >= 2 & j < 5)) {//左下角内点
            colors = inpt;
        } else if ((i >= datalen - 7 && i < datalen && j >= 0 & j < 7)) {//左下角外框
            colors = pt;
        } else if ((i >= 2 && i < 5 && j >= datalen - 5 & j < datalen - 2)) {//右上角内点
            colors = inpt;
        } else if ((i >= 0 && i < 7 && j >= datalen - 7 & j < datalen)) {//右上角外框
            colors = pt;
        } else {
            colors = options.fgColor;
        }
        return colors;
    };
    /* 初始化logo图片 */
    var initLogoImage = function() {//初使化图片
        if (options.logoimg != null) {//有LOGO图片
            var logoimgWidth = options.logoimg.width;
            var logoimgHeight = options.logoimg.height;
            var logoWidth = 0, logoHeight = 0, logox = 0, logoy = 0, maxwidth = 0;
            var width = defaults.width - defaults.margin * 2;    //初始化logo参数相对于默认画布尺寸
            maxwidth = Math.floor(width * 0.3);
            if (logoimgWidth > 0) {
                if (Math.max(logoimgWidth, logoimgHeight) < maxwidth) {
                    logoWidth = logoimgWidth;
                    logoHeight = logoimgHeight;
                } else {
                    if (logoimgWidth > logoimgHeight) {
                        logoWidth = maxwidth;
                        logoHeight = Math.floor(logoimgHeight * (maxwidth / logoimgWidth));
                    }
                    else {
                        logoHeight = maxwidth;
                        logoWidth = Math.floor(logoimgWidth * (maxwidth / logoimgHeight));
                    }
                }
                logox = Math.floor(defaults.width / 2 - logoWidth / 2);
                logoy = Math.floor(defaults.width / 2 - logoHeight / 2);
            }
            return {
                left: logox,
                top: logoy,
                width: logoWidth,
                height: logoHeight
            };
        }
    };
    /* logo描白边 */
    var drawStroke = function(context, icon, r, left, top, width, height) {
        context.save();
        context.shadowBlur = 0;
        context.shadowColor = "#FFF";
        for (var j = 0; j < 2 * r + 1; j++) {
            for (var i = 0; i < 2 * r + 1; i++) {
                context.save();
                context.shadowOffsetX = -r - 2000 + i;
                context.shadowOffsetY = -r + j;
                context.drawImage(icon, left + 2000, top, width, height);
            }
        }
        context.drawImage(icon, left, top, width, height);
        context.restore();
        context.shadowOffsetX = 0;   //恢复阴影设置，防止对后面的绘画造成影响
        context.shadowOffsetY = 0;
    };
    /* 初始化 */
    var init = function() {
        /* 画布图像初始化 */
        if(options.logoimg){
            _logoOptions = initLogoImage();
        }
        getData();
    };
    init();
}
