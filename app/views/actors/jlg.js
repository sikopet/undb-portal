define(['app', 'angular','filters/hack'], function() {
    'use strict';
    return ['$scope', '$location','$http', function($scope, $location,$http) {

        loadPartners();

        //==============================
        //
        //==============================
        function loadPartners(){

          var qsParams =
          {
              "q"  : 'schema_s:undbPartner AND _state_s:public AND description_t:(jlgjlg*)',
              "fl" : "id,identifier_s, title_t, description_t,website_s,logo_s",
              "sort"  : "updatedDate_dt desc",
              "start" : 0,
              "row"   : 1000,
          };

          return $http.get('https://api.cbd.int/api/v2013/index', { params : qsParams }).then(function(res) {
              $scope.docs=res.data.response.docs;
          });
        }

        //==============================
        //
        //==============================
        $scope.goTo= function (url,code){
    			if(code)
    				$location.url(url + parseInt(code.replace('52000000cbd08', ''), 16));
          else
            $location.url(url);

    		};
    }];
});