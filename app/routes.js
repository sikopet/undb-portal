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

            when('/events',                                   { templateUrl: 'views/events/index.html',          resolveController: true }).

            when('/training',                                 { templateUrl: 'views/training/index.html',        resolveController: true }).

            when('/resources',                                { templateUrl: 'views/resources/index.html',                resolveController: false }).
            when('/resources/brochures',                      { templateUrl: 'views/resources/brochures.html',            resolveController: true  }).
            when('/resources/cbd-materials',                  { templateUrl: 'views/resources/cbd-materials.html',        resolveController: true  }).
            when('/resources/relevant-resources',             { templateUrl: 'views/resources/relevant-resources.html',   resolveController: true  }).
            when('/resources/background-materials',           { templateUrl: 'views/resources/background-materials.html', resolveController: false }).

            when('/experiences',                              { templateUrl: 'views/experiences/index.html',         resolveController: false }).
            when('/partners',                                 { templateUrl: 'views/partners/index.html',            resolveController: false }).
            when('/aligned-initiatives',                      { templateUrl: 'views/aligned-initiatives/index.html', resolveController: false }).

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
