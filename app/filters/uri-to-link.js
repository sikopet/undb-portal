define(['app','lodash'], function(app,_) {
    'use strict';
    app.filter("uriToLink", function() {
      var  //URLs starting with http://, https://, or ftp://
     replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
     //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
     replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
     //Change email addresses to mailto:: links.
     replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;

     return function(text) {
         _.each(_.uniq(text.match(replacePattern1)), function(item) {
           text = replaceAll(text,item,"<a href=\"http://"+item+"\" target=\"_blank\">"+item+"</a>");
         });

         _.each(_.uniq(text.match(replacePattern2)), function(item) {
            text = replaceAll(text,item,"<a href=\"http://"+item+"\" target=\"_blank\">"+item+"</a>");
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