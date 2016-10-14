define(['text!./filter-coalitions.html', 'app','lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterCoalitions', [function() {
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
            'bioChamps': {
              'schema_s': ['bioChamps'],
            }
          };


          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            $scope.message='“Coalitions for Enhanced Implementation” are pledges of action by countries and partners. The pledges will be announced during the high-level segment of the UN Biodiversity Meeting in Cancun, Mexico, on 3 December 2016.';
            undbMap.filterActive('coalitions');

            undbMap.addSubQuery(_.cloneDeep($scope.queries), 'coalitions');

            undbMap.search();
          }; // loadRecords

        } //link
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
