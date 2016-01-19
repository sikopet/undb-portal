define(['text!./filter-actions.html', 'app', 'lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterActions', [function() {
    return {
      restrict: 'E',
      template: template,
      replace: true,
      require: '^undbMap',
      scope: {
        title: '@title',
        active: '=active',
        message: '=message'
      },
      link: function($scope, $element, $attr,undbMap) {
          $scope.queries = {
            'actions': {
              'schema_s': ['undbAction'],
              '_state_s':'public'
            }
          };


          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            $scope.message="All around the world people are taking action to safeguard biodiversity. See how you can participate!";
            undbMap.filterActive('actions');

          //  undbMap.addSubQuery(_.cloneDeep($scope.queries), 'partners');
          //  undbMap.search();



          undbMap.addSubQuery(_.cloneDeep($scope.queries), 'actions');

          undbMap.search();
          }; // loadRecords

        } //link
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
