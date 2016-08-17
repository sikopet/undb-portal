define(['text!./actor.html', 'app','filters/trunc','filters/hack','factories/km-utilities','filters/uri-to-link' ], function(template, app) {
    'use strict';

    app.directive('actor', ['$sce','$location',function($sce,$location) {
        return {
            restrict: 'E',
            template: template,
            replace: false,
            scope: {
                doc: '=document',
            },

            controller: ["$scope", function($scope) {

              //=======================================================================
              //
              //=======================================================================
              $scope.extractId = function(id){
                  return parseInt(id.replace('52000000cbd08', ''), 16);
              };

                //=======================================================================
            		//
            		//=======================================================================
            		$scope.goTo= function (url,code){
                  if(code)
            			   $location.url(url+$scope.extractId(code));
                  else
                    $location.url(url);
            		};
                //=======================================================================
                // ('nl2br')
                //=======================================================================
                function trusted(val) {
                    return $sce.trustAsHtml(val);

                }
                $scope.trusted =trusted;
            }],
        }; // return
    }]); //app.directive('searchFilterCountries

}); // define