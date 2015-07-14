define(['app', 'authentication'], function(app) { 'use strict';

    app.controller('TemplateController', ['$scope', '$window', '$location', '$route', function($scope, $window, $location, $route) {


        $scope.$on("$routeChangeSuccess", function(){
            $scope.routeLoaded = true;

            // $scope.$root.pageTitle = { text: "" };
            $scope.$root.breadcrumbs = getPage($route.current.$$route.originalPath);
        });

        //============================================================
        //
        //
        //============================================================
        $scope.signIn = function () {
            $location.url('/signin');
        };

        //============================================================
        //
        //
        //============================================================
        $scope.signOut = function () {
            authentication.signOut();
        };

        //============================================================
        //
        //
        //============================================================
        $scope.actionSignup = function () {
            var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
            $window.location.href = 'https://accounts.cbd.int/signup?redirect_uri='+redirect_uri;
        };

        //============================================================
        //
        //
        //============================================================
        $scope.actionPassword = function () {
            var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
            $window.location.href = 'https://accounts.cbd.int/password?redirect_uri='+redirect_uri;
        };

        //============================================================
        //
        //
        //============================================================
        $scope.actionProfile = function () {
            var redirect_uri = $window.encodeURIComponent($location.protocol()+'://'+$location.host()+':'+$location.port()+'/');
            $window.location.href = 'https://accounts.cbd.int/profile?redirect_uri='+redirect_uri;
        };

        //============================================================
        //============================================================

        var siteMap = {
            '/': {                                            name: 'Home',
                pages: {
                    '/about': {                               name: 'About',
                        pages: {
                            '/about/approach':              { name: 'Approach' },
                            '/about/history':               { name: 'History' },
                            '/about/strategic-plan':        { name: 'Strategic Plan' }
                        }
                    },
                    '/events':                              { name: 'Events' },
                    '/training':                            { name: 'Training' },
                    '/resources': {                           name: 'Resources',
                        pages: {
                            '/about/brochures':             { name: 'Brochures' },
                            '/about/cbd-materials':         { name: 'SOI/CBD Materials' },
                            '/about/relevant-resources':    { name: 'Other Relevant Resources' },
                            '/about/background-materials':  { name: 'Background Materials' }
                        }
                    },
                    '/experiences':                         { name: 'Experiences' },
                    '/partners':                            { name: 'Partners' },
                    '/aligned-initiatives':                 { name: 'Aligned Initiatives' },
                    '/help': {                                name: 'Help',
                        pages: {
                            '/help/403':                    { name: '403' },
                            '/help/404':                    { name: '404' }
                        }
                    }
                }
            }
        };

        //============================================================
        //
        //
        //============================================================
        function getPage(url) {
            return getPageInternal(siteMap, url);
        }

        //============================================================
        //
        //
        //============================================================
        function getPageInternal(current, url) {

            var keys = Object.keys(current);

            for(var i=0; i<keys.length; ++i) {

                if(keys[i]==url)
                    return [ { url: keys[i], name: current[keys[i]].name } ];

                if(!current[keys[i]].pages)
                    continue;

                var res = getPageInternal(current[keys[i]].pages, url);

                if(res) {
                    res.unshift( { url: keys[i], name: current[keys[i]].name } );
                    return res;
                }
            }
        }

     }]);
});
