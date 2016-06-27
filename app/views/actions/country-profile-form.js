
define(['app','lodash','rangy-core','directives/edit-link', 'directives/link-list'], function(app,_,rangy) { 'use strict';
	return ['$scope','locale','$http', '$location', '$route','$timeout',
    function ($scope,locale, $http, $location,$route,$timeout) {

		$scope.code      = $route.current.params.code;
		$scope.tab = 'profile';
		init();

		$scope.patterns = {
				facebook : /^http[s]?:\/\/(www.)?facebook.com\/.+/i,
				twitter  : /^http[s]?:\/\/twitter.com\/.+/i,
				youtube  : /^http[s]?:\/\/(www.)?youtube.com\/\w+\/.+/i,
				phone    : /^\+\d+(\d|\s|ext|[\.,\-#*()]|)+$/i
		};

		//=======================================================================
 	 //
 	 //=======================================================================
 		 $scope.getCountryFlag = function(code) {
 				 return 'https://www.cbd.int/images/flags/96/flag-'+code+'-96.png';

 		 };

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
								}).then(function(){
										$scope.$emit('showInfo', 'Profile successfully updated.');
								}).catch(function(err){
									$scope.$emit('showError', 'ERROR: Profile was not updated.');
									console.log(err);
								});
						} else {
							return $http.post(url, $scope.document, params).then(function(res){
								$scope.document._id=res.id;
								$scope.$emit('showInfo', 'Profile successfully updated.');
							}).catch(function(err){
								$scope.$emit('showError', 'ERROR: Profile was not updated.');
								console.log(err);
							});
						} //create

		}
		$scope.save=save;

		//=======================================================================
		//
		//=======================================================================
		function showEdit (){

			 if((_.isBoolean($scope.editIndex) && $scope.editIndex) || _.isNumber($scope.editIndex))
			 return true;
			 else
			  return false;
		}
		$scope.showEdit=showEdit;

		//=======================================================================
		//
		//=======================================================================
		function close(time){
				if(!time)
					$location.url('/actions/countries/'+$scope.document.code);
				else
					$timeout(function(){ if(!confirm('Would you like to continue editing the profile?'))$location.url('/actions/countries/'+$scope.document.code);},time*1000);
		}
		$scope.close=close;

		//=======================================================================
		//
		//=======================================================================
		function init (){
			 rangy.init();
			 window.rangy=rangy;

				$scope.editIndex=false;
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
