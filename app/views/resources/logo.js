define(['app'], function() {
    'use strict';
    return ['$scope', '$location','$anchorScroll', function($scope, $location,$anchorScroll) {


        //==============================
        //
        //==============================
        function goTo(url,code){
    			if(code)
    				$location.url(url + parseInt(code.replace('52000000cbd08', ''), 16));
          else
            $location.url(url);

    		}
        $scope.goTo=goTo;

        //==============================
        //
        //==============================
        function scrollTo (id) {
           $location.hash(id);
           $anchorScroll();
        }
        $scope.scrollTo=scrollTo;
    }];
});
