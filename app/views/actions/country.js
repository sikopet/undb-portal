define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope','locale','$http', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication',
    function ($scope,locale, $http, $rootScope, $route, $browser, $location, $window, authentication) {

		//=======================================================================
		//
		//=======================================================================
		$http.get('https://api.cbd.int/api/v2015/countries', {
			cache: true,
			params: {
				f: {
					code: 1,
					name: 1
				}
			}
		}).then(function(res) {

			res.data.forEach(function(c) {
				c.code = c.code.toLowerCase();
				c.name = c.name[locale];
				c.cssClass='flag-icon-'+c.code;
			});
			$scope.countries = res.data;
			console.log($scope.countries);
		});

		//=======================================================================
		//
		//=======================================================================
		$scope.actionCountryProfile= function (code){
						$window.location.href = '/actions/submit/'+code.toUpperCase();
		};

		//=======================================================================
		//
		//=======================================================================
		$scope.actionRegister = function () {
			$window.location.href = '/actions/submit';
		};

    }];
});
