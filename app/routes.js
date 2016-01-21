define(['app', 'lodash', 'text!views/index.html', 'views/index', 'providers/extended-route', 'authentication'], function(app, _, rootTemplate) { 'use strict';

    app.config(['extendedRouteProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/',                             { template:    rootTemplate,  label:'Home',  resolveController: 'views/index', reloadOnSearch : false }).
            when('/home', { redirectTo: '/' }).

            when('/about',                        { redirectTo: '/about/undb' }).
            when('/about/undb',                   { templateUrl: 'views/about/index.html',         label:'UNDB',          }).
            when('/about/goals',                  { templateUrl: 'views/about/goals.html',         label:'Goals',         }).
            when('/about/biodiversity',           { templateUrl: 'views/about/biodiversity.html',  label:'Biodiversity',  resolveController: true }).
            when('/about/iyb2010',                { templateUrl: 'views/about/iyb2010.html',       label:'IYB2010',       }).
            when('/about/sdgs',                   { templateUrl: 'views/about/sdgs.html',          label:'SDGs',          }).

            when('/actions',                      { redirectTo:  '/actions/worldwide' }).
            when('/actions/worldwide',            { templateUrl: 'views/actions/worldwide.html',        label:'Worldwide',            resolveController: true , reloadOnSearch : false}).
            when('/actions/country',              { templateUrl: 'views/actions/country.html',          label:'By Country',           resolveController: true }).
            when('/actions/countries/:code',      { templateUrl: 'views/actions/country-profile.html',  label :'Profile',             resolveController: true }).
           // when('/actions/un',                 { templateUrl: 'views/actions/un.html',               label:'By UN Organization',   resolveController: true }).
            when('/actions/calendar',             { templateUrl: 'views/actions/calendar.html',         label:'Calendar'              }).
            when('/actions/participate',          { templateUrl: 'views/actions/participate.html',      label:'Participate'           }).
            when('/actions/submit',               { templateUrl: 'views/actions/submit.html',           label:'Participate',          resolveController: true, resolve : { user : securize(['User']) } }).
            when('/actions/submit-form/:uid?',    { templateUrl: 'views/actions/submit-form.html',      label:'Form',                 resolveController: true, resolve : { user : securize(['User']) } }).
            when('/actions/submit-form-done',     { templateUrl: 'views/actions/submit-form-done.html', label:'Thanks',                                        resolve : { user : securize(['User']) } }).

            when('/actors',                      { templateUrl: 'views/actors/index.html',       label:'Actors'                   }).
            when('/actors/abttf',                { templateUrl: 'views/actors/abttf.html',       label:'ABTTF'                    }).
            when('/actors/champions',            { templateUrl: 'views/actors/champions.html',   label:'Biodiversity Champions'   }).
            when('/actors/blg',                  { templateUrl: 'views/actors/blg.html',         label:'BLG'                      }).
            when('/actors/jlg',                  { templateUrl: 'views/actors/jlg.html',         label:'JLG'                      }).
            when('/actors/partners',             { templateUrl: 'views/actors/partners.html',    label:'UNDB Partners',           resolveController: true, resolve : { user : currentUser() } }).
            when('/actors/partners/register',    { templateUrl: 'views/actors/submit-form.html', label:'Become a UNDB Partner',   resolveController: true, resolve : { user : securize(['User']) } }).
            when('/actors/partners/edit/:uid',   { templateUrl: 'views/actors/submit-form.html', label:'Become a UNDB Partner',   resolveController: true, resolve : { user : securize(['User']) } }).

            when('/resources',                   { templateUrl: 'views/resources/index.html',      label:'Resources'         }).
            when('/resources/logo',              { templateUrl: 'views/resources/logo.html',       label:'Logo'              }).
            when('/resources/materials',         { templateUrl: 'views/resources/materials.html',  label:'Printed Materials' }).
            when('/resources/multimedia',        { templateUrl: 'views/resources/multimedia.html', label:'Multimedia'        }).

            when('/help/404',                    { templateUrl: 'views/404.html',  label : 'Not found' }).
            when('/help/403',                    { templateUrl: 'views/403.html',  label : 'Forbidden' }).
            otherwise({ redirectTo: '/help/404' });
    }]);

    //============================================================
    //
    //
    //============================================================
    function currentUser() {

        return ['authentication', function (authentication) {

            return authentication.getUser();
        }];
    }

    //============================================================
    //
    //
    //============================================================
    function securize(roles) {

        return ['$location', '$window', '$q', 'authentication', function ($location, $window, $q, authentication) {

            return authentication.getUser().then(function (user) {

                if (!user.isAuthenticated) {

                    var returnUrl = $window.encodeURIComponent($window.location.href);
                    $window.location.href = 'https://accounts.cbd.int/signin?returnUrl=' + returnUrl; // force sign in
                    return $q(function () {});
                }
                else if (roles && !_.isEmpty(roles) && _.isEmpty(_.intersection(roles, user.roles))) {

                    $location.url('/help/403'); // not authorized
                }

                return user;
            });
        }];
    }

});
