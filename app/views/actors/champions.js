define(['directives/map/champs'], function(champs) {
    'use strict';
    return ['$scope', '$location','$http','$sce', function($scope, $location,$http,$sce) {

        $scope.docs=champs;
        //==============================
        //
        //==============================
        $scope.goTo= function (url,code){
    			if(code)
    				$location.url(url + parseInt(code.replace('52000000cbd08', ''), 16));
          else
            $location.url(url);

    		};

        //=======================================================================
        //
        //=======================================================================
        function trustHtml(src) {
            return $sce.trustAsHtml(src);
        }
        $scope.trustHtml = trustHtml;
    }];
});