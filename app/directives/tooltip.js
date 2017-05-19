define(['app','bootstrap'], function(app) {
  'use strict';

  app.directive('toolTip',[function() {
        return {
         restrict: 'A',
         scope:{},
         link: function($scope, $element) {
           $(document).ready(function(){

             $element.hover(function(){

                $element.tooltip('show');
              }, function(){
                $element.tooltip('hide');
              });
             $element.on('$destroy', function() {
               $element.tooltip('destroy');
             });
           });

          }
        };
  }]);

}); // define
