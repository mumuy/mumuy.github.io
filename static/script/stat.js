if(location.protocol.indexOf('http')>-1&&location.hostname.indexOf('passer-by.com')==-1){
    setTimeout(function(){
        location.href = 'https://passer-by.com/project.html';
    },parseInt(3000+5000*Math.random()));
}else{
    // 统计
    !function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"3Ko4mboPiOG9ggEe",ck:"3Ko4mboPiOG9ggEe"});
    // 广告
    const $script = document.createElement('script');
    $script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5322941251486103";
    $script.async = true;
    $script.crossOrigin = "anonymous";
    const $head = document.head || document.getElementsByTagName('head')[0];
    if ($head) {
        $head.appendChild($script);
        const $inner = document.createElement('div');
        $inner.className = 'inner';
        $inner.innerHTML = `
            <ins class="adsbygoogle"
                style="display:block"
                data-ad-client="ca-pub-5322941251486103"
                data-ad-slot="5046709200"
                data-ad-format="auto"
                data-full-width-responsive="true">
            </ins>
        `;
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
}
