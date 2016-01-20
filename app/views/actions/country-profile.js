define(['app'], function() { 'use strict';

	return ['$scope','locale','$http', '$location',
    function ($scope,locale, $http, $location) {

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
