define(['text!./filter-actions.html', 'app', 'lodash', 'moment'], function(template, app, _, moment) {
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
            link: function($scope, $element, $attr, undbMap) {
                    $scope.queries = {
                        'actions': {
                            'schema_s': ['undbAction'],
                            '_state_s': ['public']
                        }
                    };

                    //=======================================================================
                    //
                    //=======================================================================
                    $scope.loadRecords = function() {
                        if ($scope.searchYear) {
                            var startD = moment('01-01-' + $scope.searchYear, "DD-MM-YYYY").toISOString();
                            var endD = moment('31-12-' + $scope.searchYear, "DD-MM-YYYY").toISOString();
                            var q = ['[' + startD + ' TO ' + endD + ']'];
                            $scope.queries.actions.startDate_dt = q;
                        } else {
                            undbMap.deleteSubQuery('actions');
                            if ($scope.queries.actions.startDate_dt)
                                delete($scope.queries.actions.startDate_dt);
                        }
                        $scope.message = "All around the world people are taking action to safeguard biodiversity. See how you can participate!";
                        undbMap.filterActive('actions');
                        undbMap.addSubQuery(_.cloneDeep($scope.queries), 'actions');
                        undbMap.search();
                    }; // loadRecords

                } //link
        }; // return
    }]); //app.directive('sfilterNbsap
}); // define