define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope','locale','$http', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication',
    function ($scope,locale, $http, $rootScope, $route, $browser, $location, $window, authentication) {

		//=======================================================================
		//
		//=======================================================================
		$http.get('/api/v2013/countries/CA', {
			cache: true,

		}).then(function(res) {

				$scope.country =  res.data;
				$scope.country.code = $scope.country.code.toLowerCase();
				$scope.country.name = $scope.country.name[locale];
				$scope.country.cssClass='flag-icon-'+$scope.country.code;

			$scope.country = res.data;
			console.log($scope.country);
		});

		//=======================================================================
		//
		//=======================================================================
		$scope.actionCountryProfile= function (code){
						$window.location.href = '/actions/country/'+code.toUpperCase();
		};

		//=======================================================================
		//
		//=======================================================================
		$scope.actionRegister = function () {
			$window.location.href = '/actions/submit';
		};

    }];
});
