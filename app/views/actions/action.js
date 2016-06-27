
define(['app','lodash'], function(app,_) { 'use strict';
	return ['$scope','locale','$http', '$location', '$route',
    function ($scope,locale, $http, $location,$route) {
		$scope.action ={};
		$scope.action.identifier     = $route.current.params.identifier;

		//=======================================================================
		//
		//=======================================================================

				var queryParameters = {
					'q': 'schema_s:undbAction  AND identifier_s:'+$scope.action.identifier, //AND _state_s:public removed for test
					'wt': 'json',
					'start': 0,
					'rows': 1000000,
				};
					$http.get('https://api.cbd.int/api/v2013/index/select', {
						params: queryParameters,
						cache: true
					}).success(function(data) {
						$scope.action = data.response.docs[0];
						console.log($scope.action);
					});


	 //=======================================================================
	 //
	 //=======================================================================
		 $scope.getCountryFlag = function(code) {
				 return 'https://www.cbd.int/images/flags/96/flag-'+code+'-96.png';

		 };

		//=======================================================================
		//
		//=======================================================================
		$scope.actionCountryProfile= function (code){
			$location.url('/actions/countries/'+code.toUpperCase());
		};

		//=======================================================================
		//
		//=======================================================================
		$scope.goTo= function (url,code){
			if(code)
					$location.url(url+code);
			else
					$location.url(url);
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
