define(['app', 'lodash', 'directives/edit-link', 'directives/link-list','ng-ckeditor'], function(app, _) {
    'use strict';
    return ['$scope', 'locale', '$http', '$location', '$route', '$timeout','$document',
        function($scope, locale, $http, $location) {


            init();



            //=======================================================================
            //
            //=======================================================================
            function load() {

            }

            //=======================================================================
            //
            //=======================================================================
            function save() {
                var url = 'xxx';
                var params = {};

                if ($scope.document._id) {
                    params.id = $scope.document._id;
                    url = url + '/' + $scope.document._id;

                    return $http.put(url, $scope.document, {
                        'params': params
                    }).then(function() {
                        $scope.$emit('showInfo', 'Media successfully updated.');
                    }).catch(function(err) {
                        $scope.$emit('showError', 'ERROR: Profile was not updated.');
                        console.log(err);
                    });
                } else {
                    return $http.post(url, $scope.document, params).then(function(res) {
                        $scope.document._id = res.id;
                        $scope.$emit('showInfo', 'Media successfully updated.');
                    }).catch(function(err) {
                        $scope.$emit('showError', 'ERROR: Profile was not updated.');
                        console.log(err);
                    });
                } //create

            }
            $scope.save = save;


            //=======================================================================
            //
            //=======================================================================
            function showEdit() {

                if ((_.isBoolean($scope.editIndex) && $scope.editIndex) || _.isNumber($scope.editIndex))
                    return true;
                else
                    return false;
            }
            $scope.showEdit = showEdit;




            //=======================================================================
            //
            //=======================================================================
            function close() {
                    $location.url('/resources/multimedia');

            }
            $scope.close = close;


            //=======================================================================
            //
            //=======================================================================
            function init() {

                $scope.editIndex = false;
                load();
            }// init


        }
    ];
});