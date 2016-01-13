define(['app', 'lodash', 'text!views/index.html', 'views/index', 'providers/extended-route'], function(app, _, rootTemplate) { 'use strict';
    app.value('realm', 'UNDB')
    app.config(['extendedRouteProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/', { redirectTo: '/home' }).
            when('/home',                                     { template:    rootTemplate,                 name:'home',          resolveController: 'views/index',          resolveUser: false }).

            when('/about', { redirectTo: '/about/undb' }).
            when('/about/undb',                               { templateUrl: 'views/about/index.html',     label:'UNDB',               resolveController: true }).
            when('/about/goals',                              { templateUrl: 'views/about/goals.html',     label:'Goals',              resolveController: true }).
            when('/about/biodiversity',                       { templateUrl: 'views/about/biodiversity.html',     label:'Biodiversity',       resolveController: true }).
            when('/about/iyb2010',                            { templateUrl: 'views/about/iyb2010.html',     label:'IYB2010',            resolveController: true }).
            when('/about/sdgs',                               { templateUrl: 'views/about/sdgs.html',     label:'SDGs',               resolveController: true }).

            when('/actions', { redirectTo: '/actions/worldwide' }).
            when('/actions/worldwide',                               { templateUrl: 'views/actions/worldwide.html',     label:'Worldwide',             resolveController: true }).
            when('/actions/country',                                 { templateUrl: 'views/actions/country.html',     label:'By Country',             resolveController: true }).
            when('/actions/un',                                      { templateUrl: 'views/actions/un.html',     label:'By UN Organization',     resolveController: true }).
            when('/actions/calendar',                                { templateUrl: 'views/actions/calendar.html',     label:'Calendar',               resolveController: true }).
            when('/actions/participate',                             { templateUrl: 'views/actions/participate.html',     label:'Participate',            resolveController: true }).
            when('/actions/submit',                                  { templateUrl: 'views/me/records.html',     label:'Participate',            resolveController: true, resolveUser: true, resolve : { securized : securize() } }).

            when('/actors',                                         { templateUrl: 'views/actors/index.html',     label:'Actors',               resolveController: true }).
            when('/actors/abttf',                                   { templateUrl: 'views/actors/abttf.html',     label:'ABTTF',                    resolveController: true }).
            when('/actors/champions',                               { templateUrl: 'views/actors/champions.html',     label:'Biodiversity Champions',   resolveController: true }).
            when('/actors/blg',                                     { templateUrl: 'views/actors/blg.html',     label:'BLG',                      resolveController: true }).
            when('/actors/jlg',                                     { templateUrl: 'views/actors/jlg.html',     label:'JLG',                      resolveController: true }).
            when('/actors/partners',                                { templateUrl: 'views/actors/partners.html',     label:'UNDB Partners',            resolveController: true }).

            when('/resources',                                    { templateUrl: 'views/resources/index.html',     label:'Resources',               resolveController: true }).
            when('/resources/logo',                               { templateUrl: 'views/resources/logo.html',     label:'Logo',               resolveController: true }).
            when('/resources/materials',                          { templateUrl: 'views/resources/materials.html',     label:'Printed Materials',  resolveController: true }).
            when('/resources/multimedia',                         { templateUrl: 'views/resources/multimedia.html',     label:'Multimedia',         resolveController: true }).

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
