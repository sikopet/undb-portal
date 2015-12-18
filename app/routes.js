define(['app', 'lodash', 'text!views/index.html', 'views/index', 'providers/extended-route'], function(app, _, rootTemplate) { 'use strict';

    app.config(['extendedRouteProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/', { redirectTo: '/home' }).
            when('/home',                                     { template:    rootTemplate,                 name:'home',          resolveController: 'views/index',          resolveUser: false }).

            when('/about', { redirectTo: '/about/undb' }).
            when('/about/undb',                               { templateUrl: 'views/about/index.html',     label:'UNDB',               resolveController: true }).
            when('/about/goals',                              { templateUrl: 'views/about/index.html',     label:'Goals',              resolveController: true }).
            when('/about/biodiversity',                       { templateUrl: 'views/about/index.html',     label:'Biodiversity',       resolveController: true }).
            when('/about/iyb2010',                            { templateUrl: 'views/about/index.html',     label:'IYB2010',            resolveController: true }).
            when('/about/sdgs',                               { templateUrl: 'views/about/index.html',     label:'SDGs',               resolveController: true }).

            when('/actions', { redirectTo: '/actions/worldwide' }).
            when('/actions/worldwide',                               { templateUrl: 'views/actions/index.html',     label:'Worldwide',             resolveController: true }).
            when('/actions/country',                                 { templateUrl: 'views/actions/index.html',     label:'By Country',             resolveController: true }).
            when('/actions/un',                                      { templateUrl: 'views/actions/index.html',     label:'By UN Organization',     resolveController: true }).
            when('/actions/calender',                                { templateUrl: 'views/actions/index.html',     label:'Calender',               resolveController: true }).
            when('/actions/participate',                             { templateUrl: 'views/actions/index.html',     label:'Participate',            resolveController: true }).

            when('/actors', { redirectTo: '/actors/abttf' }).
            when('/actors/abttf',                                   { templateUrl: 'views/actors/index.html',     label:'ABTTF',                    resolveController: true }).
            when('/actors/champions',                               { templateUrl: 'views/actors/index.html',     label:'Biodiversity Champions',   resolveController: true }).
            when('/actors/blg',                                     { templateUrl: 'views/actors/index.html',     label:'BLG',                      resolveController: true }).
            when('/actors/jlg',                                     { templateUrl: 'views/actors/index.html',     label:'JLG',                      resolveController: true }).
            when('/actors/partners',                                { templateUrl: 'views/actors/index.html',     label:'UNDB Partners',            resolveController: true }).

            when('/resources', { redirectTo: '/resources/logo' }).
            when('/resources/logo',                               { templateUrl: 'views/resources/index.html',     label:'Logo',               resolveController: true }).
            when('/resources/materials',                          { templateUrl: 'views/resources/index.html',     label:'Printed Materials',  resolveController: true }).
            when('/resources/multimedia',                         { templateUrl: 'views/resources/index.html',     label:'Multimedia',         resolveController: true }).

            when('/help/404',                                 { templateUrl: 'views/404.html',  label : 'Not found',  controller: [function(){}], resolveUser: false }).
            when('/help/403',                                 { templateUrl: 'views/403.html',  label : 'Forbidden',  controller: [function(){}], resolveUser: false }).
            otherwise({ redirectTo: '/help/404' });
    }]);

    //============================================================
    //
    //
    //============================================================
    function securize(roles)
    {
        return ["$location", "authentication", function ($location, authentication) {

            return authentication.getUser().then(function (user) {

                if (!user.isAuthenticated) {

                    console.log("securize: force sign in");

                    if (!$location.search().returnUrl)
                        $location.search({ returnUrl: $location.url() });

                    $location.path('/signin');

                }
                else if (roles && !_.isEmpty(roles) && _.isEmpty(_.intersection(roles, user.roles))) {

                    console.log("securize: not authorized");

                    $location.search({ path: $location.url() });
                    $location.path('/help/403');
                }

                return user;
            });
        }];
    }

});
