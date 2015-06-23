define(['app', 'lodash', 'text!views/index.html', 'views/index', 'providers/extended-route'], function(app, _, rootTemplate) { 'use strict';

    app.config(['extendedRouteProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/',                                         { template:    rootTemplate,                       resolveController: 'views/index',          resolveUser: false }).
            
            when('/about',                                    { templateUrl: 'views/about/index.html',           resolveController: false }).
            when('/about/approach',                           { templateUrl: 'views/about/approach.html',        resolveController: false }).
            when('/about/history',                            { templateUrl: 'views/about/history.html',         resolveController: false }).
            when('/about/strategic-plan',                     { templateUrl: 'views/about/strategic-plan.html',  resolveController: false }).
            
            when('/events',                                   { templateUrl: 'views/events/index.html',          resolveController: false }).
        
            when('/training',                                 { templateUrl: 'views/training/index.html',        resolveController: false }).
            
            when('/resources',                                { templateUrl: 'views/resources/index.html',              resolveController: false }).
            when('/resources/brochures',                      { templateUrl: 'views/resources/brochures.html',          resolveController: false }).
            when('/resources/cbd-materials',                  { templateUrl: 'views/resources/cbd-materials.html',      resolveController: false }).
            when('/resources/partner-materials',              { templateUrl: 'views/resources/partner-materials.html',  resolveController: false }).

            when('/experiences',                              { templateUrl: 'views/experiences/index.html',         resolveController: false }).
            when('/partners',                                 { templateUrl: 'views/partners/index.html',            resolveController: false }).
            when('/aligned-initiatives',                      { templateUrl: 'views/aligned-initiatives/index.html', resolveController: false }).

            when('/database/countries',                       { templateUrl: 'views/database/countries.html',    resolveController: true }).
            when('/database/countries/:code',                 { templateUrl: 'views/database/country.html',      resolveController: true }).
            when('/database/record',                          { templateUrl: 'views/database/record.html',       resolveController: true, resolveUser: true  }).

            when('/management',                               { templateUrl: 'views/management/index.html',      resolveController: true, resolveUser: true, resolve : { securized : securize() } }).

            when('/signin',                                   { templateUrl: 'views/users/signin.html',          resolveController: true, resolveUser: true }).

            when('/help/404',                                 { templateUrl: 'views/404.html',  label : 'Not found',  controller: [function(){}], resolveUser: true }).
            when('/help/403',                                 { templateUrl: 'views/403.html',  label : 'Forbidden',  controller: [function(){}], resolveUser: true }).
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
