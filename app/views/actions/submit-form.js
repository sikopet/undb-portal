define(['lodash', 'guid', 'app'], function(_, guid) { 'use strict';

    return ['$scope', '$http', '$q', 'locale', function($scope, $http, $q, locale) {

        $scope.save           = save;
        $scope.googleMapsChange = updateGeoLocation;

        // Init
        $http.get('/api/v2015/countries', { cache:true, params: { f : { code : 1, name : 1 } } }).then(function(res) {

            res.data.forEach(function(c) {
                c.code = c.code.toLowerCase();
                c.name = c.name[locale];
            });

            $scope.countries = res.data;
        });

        load();

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
        function load() {

            $scope.loading = true;

            var filter = "type eq 'undbPartner'";

            var resDrafts = $http.get("/api/v2013/documents", { params : { collection : 'mydraft', $filter : filter } });
            var resDocs   = $http.get("/api/v2013/documents", { params : { $filter : filter } });

            $q.all([resDrafts, resDocs]).then(function(res) {

                var records = _.flatten([res[0].data.Items, res[1].data.Items]);

                if(records.length)
                    return records[0];

            }).then(function(record){

                if(!record)
                    return;

                if(record.workingDocumentID) return $http.get('/api/v2013/documents/'+record.identifier+'/versions/draft');
                else                         return $http.get('/api/v2013/documents/'+record.identifier);

            }).then(function(res) {

                if(res) {
                    $scope.document = res.data;
                }
                else {
                    $scope.document = {
                        header : {
                            identifier : guid(),
                            schema : 'undbPartner'
                        }
                    };
                }

            }).catch(function(err) {

                err = (err||{}).data || err;

                console.error(err);

            }).finally(function(){

                delete $scope.loading;

            });
        }

        //==============================
        //
        //
        //==============================
        function save() {

            $scope.saving = true;

            delete $scope.errors;

            var doc = $scope.document;

            return $http.put('/api/v2013/documents/validate', doc, { params : { schema : doc.header.schema }}).then(function(res) {

                var report = res.data;

                if(report.errors && report.errors.length)
                    throw report;

                return $http.put('/api/v2013/documents/'+doc.header.identifier+'/versions/draft', doc, { params : { schema : doc.header.schema }});

            }).then(function(res) {

                console.log(res.data || res);

            }).catch(function(err) {

                err = err.data || err;

                $scope.errors = err.errors || [err];

                console.error(err);

            }).finally(function(){

                delete $scope.saving;

            });
        }
    }];
});
