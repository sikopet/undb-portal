define([ 'filters/trunc','directives/map/zoom-map','directives/links-display','filters/trunc','filters/hack','factories/km-utilities','filters/uri-to-link' ], function() {
    'use strict';
    return ['$scope', 'locale', '$http', '$location', '$route', '$sce',
        function($scope, locale, $http, $location, $route, $sce) {
            $scope.partner = {};
            $scope.partner.identifier = $route.current.params.uid;

            //=======================================================================
            //
            //=======================================================================
            var hex = Number($scope.partner.identifier).toString(16);
            var id = "52000000cbd0800000000000".substr(0, 24 - hex.length) + hex;
            var queryParameters = {
                'q': 'schema_s:undbPartner  AND id:' + id, //AND _state_s:public removed for test
                'wt': 'json',
                'start': 0,
                'rows': 1000000,
            };
            $http.get('https://api.cbd.int/api/v2013/index/select', {
                params: queryParameters,
                cache: true
            }).success(function(data) {
                $scope.partner = data.response.docs[0];

                $http.get('https://api.cbd.int/api/v2013/documents/'+$scope.partner.identifier_s, {
                    cache: true
                }).success(function(d) {

                  Object.assign($scope.partner,d);
                });;
            });
            //=======================================================================
            // ('nl2br')
            //=======================================================================
            function trusted(val) {
                return $sce.trustAsHtml(val);

            }
            $scope.trusted=trusted;
            //=======================================================================
            //
            //=======================================================================
            function trustSrc() {
							var src ='https://www.google.com/maps/embed/v1/place?key=AIzaSyCyD6f0w00dLyl1iU39Pd9MpVVMOtfEuNI';
                return $sce.trustAsResourceUrl(src+'&&q='+$scope.action.lat_d+','+$scope.action.lng_d);
            }
            $scope.trustSrc = trustSrc;

						//=======================================================================
            //
            //=======================================================================
            function isGooleMap() {
								if(!$scope.action.logo_s && ($scope.action.address_s || ($scope.action.lat_d && $scope.action.lng_d)))
									return true;
									else
										return false;

            }
            $scope.isGooleMap = isGooleMap;

						//=======================================================================
            //
            //=======================================================================
            function isZoomMap() {
								if(!$scope.action.logo_s && !$scope.action.address_s && !$scope.action.lat_d && !$scope.action.lng_d)
										return true;
								else
										return false;
            }
            $scope.isZoomMap = isZoomMap;

            //=======================================================================
            //
            //=======================================================================
            $scope.getCountryFlag = function(code) {
                if (code.toLowerCase() === 'eu')
                    return 'https://www.cbd.int/images/flags/48/flag-' + 'eur' + '-48.png';
                else
                    return 'https://www.cbd.int/images/flags/48/flag-' + code + '-48.png';


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

        }
    ];
});
