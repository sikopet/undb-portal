define(['app','lodash'], function(app,_) {
    'use strict';
    app.filter("uriToLink", function() {
      var
     //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
     replacePattern2 = /(^|[^\/\>])(\swww\.[\S]+(\b|$))($|[^\"])/gim,
     //Change email addresses to mailto:: links.
     replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})(^|[^\"])/gim;

     return function(text) {

        text = replaceAll(text,' https://',' ');
        text = replaceAll(text,' http://',' ');

         _.each(_.uniq(text.match(replacePattern2)), function(item) {
            item=item.substring(1);
            text = replaceAll(text,item.trim(),"<a href=\"http://"+item.trim()+"\" target=\"_blank\">"+item.trim()+"</a>");
         });


         _.each(_.uniq(text.match(replacePattern3)), function(item) {
            text = text.replace(item, '<a href="mailto:'+item+'">'+item+'</a>');
         });
         return text;
     };
    });
    function replaceAll(string,item,replacement) {

        return string.split(item).reduce(function(prev, curr, index) {
            if (index === 0) return curr;
            else return prev + replacement + curr;
        }, '');

    }
});