if(location.protocol.indexOf('http')>-1&&location.hostname.indexOf('passer-by.com')==-1){
    setTimeout(function(){
        location.href = 'https://passer-by.com/project.html';
    },parseInt(3000+5000*Math.random()));
}else{
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "pn2m8urb4c");
}
