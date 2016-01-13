define(['text!./filter-parties.html', 'app', 'lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterParties', [function() {
    return {
      restrict: 'E',
      template: template,
      replace: true,
      require: '^undbMap',
      scope: {
        title: '@title',
      },
      link: function($scope, $element, $attr, undbMap) {
          $scope.queries = {
            'parnters': {
              'schema_s': ['partners'],
            }
          };

          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            undbMap.addSubQuery(_.cloneDeep($scope.queries), 'partners');
            undbMap.search();
          }; // loadRecords

        } //link
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
