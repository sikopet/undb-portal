define(['app','lodash'], function(app,_) { 'use strict';

	return ['$scope','locale','$http', '$location',
    function ($scope,locale, $http, $location) {

		//=======================================================================
		//
		//=======================================================================
		$scope.isLoading = true;
		$http.get('/api/v2015/countries', {
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
			$http.get("/api/v2013/index", {
					 params: {
							 'q': 'schema_s:undbActor OR schema_s:event ',
							 'fl':'identifier_s,country_s,government*',
							 'wt': 'json',
							 'start': 0,
							 'rows': 1000000,
							 'facet':true,
							 'facet.field':'country_s'
					 }
	 		}).then(function(resData){
					var country,index;
					$scope.countries=[];
					_.each(resData.data.response.docs,function(action){

								country = _.find(res.data,{code:action.country_s});
								if(country)
							 {
									if(!_.find($scope.countries,{code:action.country_s})){
										index=resData.data.facet_counts.facet_fields.country_s.indexOf(action.country_s)+1;
										country.facet=resData.data.facet_counts.facet_fields.country_s[index];
										$scope.countries.push(country);
									}
								}

					});
			}).then(function(){

				$http.get("/api/v2013/index", {
						 params: {
								 'q': 'schema_s:undbParty',
								 'fl':'government*',
								 'wt': 'json',
								 'start': 0,
								 'rows': 1000000
						 }
		 		}).then(function(res2){

					_.each(res2.data.response.docs,function(profile){

									var country = _.find(res.data,{code:profile.country_s});

									if(!_.find($scope.countries,{code:profile.country_s}) && country){
										country.facet=1;
										$scope.countries.push(country);
									}

					});

						$scope.isLoading = false;
				});

			});
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

    }];
});
