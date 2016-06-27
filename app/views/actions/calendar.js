
define(['app','lodash','directives/activities-list'], function(app,_) { 'use strict';
	return ['$scope','$location', '$http', '$route','locale',
    function ($scope,$location,$http,$route,locale) {

		//$scope.code      = $route.current.params.code;

		$http.get('https://api.cbd.int/api/v2015/countries', { cache:true, params: { f : { code : 1, name : 1 } } }).then(function(res) {

				res.data.forEach(function(c) {
						c.code = c.code.toLowerCase();
						c.name = c.name[locale];
				});
				$scope.countries = res.data;
		});

		//=======================================================================
		//
		//=======================================================================
		$scope.clearSearch = function() {
				$scope.search='';
				$scope.searchYear='';
				$scope.searchMonth='';
				$scope.searchCountry='';
		};

		//=======================================================================
		//
		//=======================================================================
		$scope.goTo= function (url,code){
			$location.url(url+code);
		};

		//=======================================================================
		//
		//=======================================================================
		$scope.countryCode= function (code){
			if(code.toLowerCase()==='eu') return 'eur';
			else return code;
		};

    }];
});
