define(['app', '../../directives/map/zoom-map','angular', 'authentication'], function() { 'use strict';

	return ['$scope','locale','$http', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication',
    function ($scope,locale, $http, $rootScope, $route, $browser, $location, $window, authentication) {

		$scope.code      = $route.current.params.code;
		//=======================================================================
		//
		//=======================================================================
		$http.get('/api/v2013/countries/'+$scope.code.toUpperCase(), {
			cache: true,
		}).then(function(res) {

				$scope.country =  res.data;
				$scope.country.code = $scope.country.code.toLowerCase();
				$scope.country.name = $scope.country.name[locale];
				$scope.country.cssClass='flag-icon-'+$scope.country.code;
	

			$scope.country = res.data;
			console.log($scope.country);
		});

console.log('$location.search();',$scope.code);

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
