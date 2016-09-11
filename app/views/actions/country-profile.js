define(['app', 'lodash', 'directives/map/zoom-map', 'directives/link-list', 'directives/activities-list','angular-sanitize','filters/trunc','directives/links-display','filters/hack', 'directives/actors-list'], function(app, _) {
    'use strict';
    return ['$scope', 'locale', '$http', '$location', '$route', 'authentication','$sce',
        function($scope, locale, $http, $location, $route, authentication,$sce) {
            $scope.code = $route.current.params.code;
            //=======================================================================
            //
            //=======================================================================
            authentication.getUser().then(function(user) {
                $scope.user = user;

            }).then(init);

            //=======================================================================
            //
            //=======================================================================
            function trustHtml(src) {
                return $sce.trustAsHtml(src);
            }
            $scope.trustHtml = trustHtml;


            //=======================================================================
            //
            //=======================================================================
            function init() {

                loadCountry().then(loadProfile).then(loadPartners);
            } // init


            //=======================================================================
            //
            //=======================================================================
            function loadCountry() {
                return $http.get('https://api.cbd.int/api/v2013/countries/' + $scope.code.toUpperCase(), {
                    cache: true,
                }).then(function(res) {

                    $scope.country = res.data;
                    $scope.country.code = res.data.code.toLowerCase();
                    $scope.country.name = res.data.name[locale];
                    $scope.country.cssClass = 'flag-icon-' + $scope.country.code;
                });
            } // init


            //=======================================================================
            //
            //=======================================================================
            function loadPartners() {
                var queryParameters = {
                    'q': 'schema_s:undbPartner AND _state_s:public AND country_s:' + $scope.country.code,
                    'wt': 'json',
                    'start': 0,
                    'rows': 1000000,
                };
                return $http.get('https://api.cbd.int/api/v2013/index/select', {
                    params: queryParameters,
                    cache: true
                }).success(function(data) {
                    $scope.partners = data.response.docs;
                });
            } // loadPartners


            //=======================================================================
            //
            //=======================================================================
            function loadProfile() {

                return $http.get('https://api.cbd.int/api/v2016/undb-party-profiles/', {
                    'params': {
                        q: {
                            'code': $scope.country.code
                        }
                    }
                }).then(function(res2) {
                    if (_.isArray(res2.data) && res2.data.length > 1)
                        throw "Error: cannot have more then one profile with same code.";
                    else if (_.isArray(res2.data) && res2.data.length === 1)
                        $scope.country = extend($scope.country, res2.data[0]);
                });
            } // loadProfile


            //=======================================================================
            //
            //=======================================================================
            function extend(obj, objExt) {
                for (var i in objExt) {
                    if (objExt.hasOwnProperty(i)) {
                        obj[i] = objExt[i];
                    }
                }
                return obj;
            } // extend


            //=======================================================================
            //
            //=======================================================================
            $scope.getCountryFlag = function(code) {
                return 'https://www.cbd.int/images/flags/96/flag-' + code + '-96.png';

            };


            //=======================================================================
            //
            //=======================================================================
            $scope.actionCountryProfile = function(code) {
                $location.url('/actions/countries/' + code.toUpperCase());
            };


            //=======================================================================
            //
            //=======================================================================
            $scope.goTo = function(url, code) {

                if (code)
                    $location.url(url + code);
                else
                    $location.url(url);
            };


            //=======================================================================
            //
            //=======================================================================
            $scope.countryCode = function(code) {
                if (code.toLowerCase() === 'eu') return 'eur';
                else return code;
            };


            //=======================================================================
            //
            //=======================================================================
            $scope.isAdmin = function() {
                if($scope.user)
                  return _.intersection($scope.user.roles, ['Administrator', 'undb-administrator', 'UNDBPublishingAuthority']).length > 0;
                else
                  return false;
            };


            //=======================================================================
            //
            //=======================================================================
            $scope.extractId = function(id){
                return parseInt(id.replace('52000000cbd08', ''), 16);
            };

        }
    ];
});