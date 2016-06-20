define(['app'], function() { 'use strict';

	return ['$scope','locale','$http', '$location',
    function ($scope,locale, $http, $location) {

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
		});

		//=======================================================================
		//
		//=======================================================================
		$scope.actionCountryProfile= function (code){
				$location.url('/actions/countries/'+code.toUpperCase());
		};

    }];
});
