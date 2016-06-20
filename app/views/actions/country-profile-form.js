
define(['app','lodash', 'directives/edit-link'], function(app,_) { 'use strict';
	return ['$scope','locale','$http', '$location', '$route',
    function ($scope,locale, $http, $location,$route) {

		$scope.code      = $route.current.params.code;
		$scope.tab = 'profile';
		init();

		//=======================================================================
		//
		//=======================================================================
		function load(){

						return $http.get('/api/v2013/countries/'+$scope.code.toUpperCase(), {
							cache: true,
						}).then(function(res) {
								delete(res.data._id);
								delete(res.data.__v);
								delete(res.data.treaties);

								$scope.document = res.data;
								$scope.document.name = $scope.document.name[locale];
								$scope.document.code = $scope.document.code.toLowerCase();

								$http.get('/api/v2016/undb-party-profiles/',{'params':{'code':$scope.document.code}}).then(function(res2){

										if(_.isArray(res2.data) && res2.data.length > 1)
											throw "Error: cannot have more then one profile with same code.";
										else if (_.isArray(res2.data) && res2.data.length === 1)
											$scope.document=extend($scope.document,res2.data[0]);

								});
						});
		}

		//=======================================================================
		//
		//=======================================================================
		function save (){
			console.log('parent being saved');
						var url = '/api/v2016/undb-party-profiles/';
						var params={};

						if ($scope.document._id) {
								params.id = $scope.document._id;
								url = url + '/' + $scope.document._id;

								return $http.put(url, $scope.document, {
										'params': params
								});
						} else {
							return $http.post(url, $scope.document, params).then(function(res){$scope.document._id=res.id;});
						} //create

		}
		$scope.save=save;


		//=======================================================================
		//
		//=======================================================================
		function init (){

				load().then(function(){
						if($scope.document && !$scope.document.publications)
								$scope.document.publications=[];

						if($scope.document && !$scope.document.images)
								$scope.document.images=[];

						if($scope.document && !$scope.document.videos)
								$scope.document.videos=[];

						if($scope.document && !$scope.document.links)
								$scope.document.links=[];
				});


		}

		//=======================================================================
		//
		//=======================================================================
		function extend (obj,objExt) {
			for (var i in objExt) {
				 if (objExt.hasOwnProperty(i)) {
						obj[i] = objExt[i];
				 }
			}
			return obj;
	 }
}];
});
