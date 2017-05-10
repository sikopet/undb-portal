define(['text!./filter-aichi.html', 'app', 'lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterAichi', [function() {
    return {
      restrict: 'E',
      template: template,
      replace: true,
      require: '^undbMap',
      scope: {
        title: '@title',
        active: '=active',
        message: '=message',
        link: '=link',
      },
      link: function($scope, $element, $attr,undbMap) {
          $scope.queries = {
            'parties': {
              'schema_s': ['parties'],
            }
          };

          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            $scope.message="aichi";
            $scope.link="/actions/country";

            undbMap.filterActive('aichi');

            undbMap.addSubQuery(_.cloneDeep($scope.queries), 'aichi');
            undbMap.search();
          }; // loadRecords

        } //link
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
