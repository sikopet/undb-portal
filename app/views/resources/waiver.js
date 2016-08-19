define(['app'], function() {
    'use strict';
    return ['$scope', '$location', function($scope, $location) {


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


    }];
});
