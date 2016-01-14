define(['text!./filter-case-studies.html', 'app', 'lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterCaseStudies', [function() {
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
      link: function($scope, $element, $attr,undbMap){
          $scope.queries = {
            'parnters': {
              'schema_s': ['partners'],
            }
          };

          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            $scope.message="Case studies are narrative examples of great success stories. Find inspiration for your own Actions!";
            // $('.sideSelectionRow').click(function(){
            //   // $('.sideSelectionRowActive').addClass('sideSelectionRow');
            //   // $('.sideSelectionRowActive').removeClass('sideSelectionRowActive');
            //
            //   $(this).removeClass('sideSelectionRowActive');
            //
            //   // var text = $(this).data('text');
            //   // $('.mapPopup').children('p').html(text)
            //   // $('.mapPopup').show();
            // });
            undbMap.filterActive('caseStudies');
          //  undbMap.addSubQuery(_.cloneDeep($scope.queries), 'partners');
          //  undbMap.search();
          }; // loadRecords

        } //link
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
