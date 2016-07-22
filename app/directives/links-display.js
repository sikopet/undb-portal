define(['text!./links-display.html', 'app', ], function(template, app) {
    'use strict';

    app.directive('linksDisplay', ['$http', '$sce', function($http, $sce) {
        return {
            restrict: 'E',
            template: template,
            replace: false,
            scope: {
                doc: '=document',
            },

            controller: ["$scope", function($scope) {

                //=======================================================================
                //
                //=======================================================================
                function parseURL(url) {
                    var a =  document.createElement('a');
                    a.href = url;
                    return {
                        source: url,
                        protocol: a.protocol.replace(':',''),
                        host: a.hostname,
                        port: a.port,
                        query: a.search,
                        params: (function(){
                            var ret = {},
                                seg = a.search.replace('/^?/','').split('&'),
                                len = seg.length, i = 0, s;
                            for (;i<len;i++) {
                                if (!seg[i]) { continue; }
                                s = seg[i].split('=');
                                ret[s[0]] = s[1];
                            }
                            return ret;
                        })(),
                        file: a.pathname ,
                        hash: a.hash.replace('#',''),
                        path: a.pathname,
                        segments: a.pathname.split('/')
                    };
                }
                $scope.parseURL =parseURL;
            }],
        }; // return
    }]); //app.directive('searchFilterCountries

}); // define