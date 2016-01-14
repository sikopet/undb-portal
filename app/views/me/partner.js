define(['lodash', 'guid', 'app'], function(_, guid) { 'use strict';

    return ['$scope', '$http', 'locale', function($scope, $http, locale) {

        $scope.submit           = submit;
        $scope.googleMapsChange = updateGeoLocation;

        $http.get('https://api.cbd.int/api/v2015/countries', { cache:true, params: { f : { code : 1, name : 1 } } }).then(function(res) {

            res.data.forEach(function(c) {
                c.code = c.code.toLowerCase();
                c.name = c.name[locale];
            });

            $scope.countries = res.data;
        });

        //==============================
        //
        //
        //==============================
        function updateGeoLocation(url) {

            var matches = /@(-?\d+\.\d+),(-?\d+\.\d+)/g.exec(url || "");

            if(matches) {
                $scope.document.geoLocation = {
                    lat : parseFloat(matches[1]),
                    lng : parseFloat(matches[2])
                 };
            }
            else {
                delete $scope.document.geoLocation;
            }
        }

        //==============================
        //
        //
        //==============================
        function submit(doc) {

            if(!doc.header) {
                doc.header = {
                    identifier : guid(),
                    schema : 'undbPartner'
                };
            }

            alert("TODO:"+doc);
        }

    }];
});
