if(location.protocol.indexOf('http')>-1&&location.hostname.indexOf('passer-by.com')==-1){
    setTimeout(function(){
        location.href = 'https://passer-by.com/project.html';
    },parseInt(3000+5000*Math.random()));
}else{
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?f9a2ca3a78be611722ecd5a78a0646c2";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
}
