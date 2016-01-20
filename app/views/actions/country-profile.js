
define(['app', '../../directives/map/zoom-map'], function() { 'use strict';
	return ['$scope','locale','$http', '$location', '$route',
    function ($scope,locale, $http, $location,$route) {

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
			$location.url('/actions/countries/'+code.toUpperCase());
		};

		//=======================================================================
		//
		//=======================================================================
		$scope.actionRegister = function () {
			$location.url('/actions/submit');
		};

    }];
});
