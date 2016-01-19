define(['lodash', 'guid', 'app', 'directives/file'], function(_, guid) { 'use strict';

    return ['$scope', '$http', '$q', 'locale', 'realm', function($scope, $http, $q, locale, realm) {

        var schemasWorkflowTypes = {
              "undbAction": {
                name: "publishReferenceRecord",
                version: undefined
              },
              "undbPartner": {
                name: "publishReferenceRecord",
                version: undefined
              }
        };

        $scope.save = save;
        $scope.upload = upload;
        $scope.googleMapsChange = updateGeoLocation;

        // Init
        $http.get('https://api.cbd.int/api/v2015/countries', { cache:true, params: { f : { code : 1, name : 1 } } }).then(function(res) {

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

            delete $scope.errors;
            $scope.loading = true;


            var uid = $route.current.params.uid;
            var resDraft, resDoc;

            if(uid) {
                resDraft = $http.get("https://api.cbd.int/api/v2013/documents/"+uid+"/versions/draft").then(res_Data).catch(nullOn404);
                resDoc   = $http.get("https://api.cbd.int/api/v2013/documents/"+uid                  ).then(res_Data).catch(nullOn404);
            }

            $q.all([resDraft, resDoc]).then(function(res) {

                var records = _.compact(res);

                if(!records.length && uid)
                    throw { code : "notFound" };

                return records[0];

            }).then(function(record){

                if(record) {

                    if(record.header.schema!='undbAction')
                        throw { code : "invalidRecordType" };

                    if(record.startDate) record.startDate = new Date(record.startDate); //Fix date
                    if(record.endDate)   record.endDate   = new Date(record.endDate); //Fix date

                    $scope.document = record;
                }
                else {
                    $scope.document = {
                        header : {
                            identifier : guid(),
                            schema : 'undbAction'
                        }
                    };
                }

            }).catch(res_Error).finally(function() {

                delete $scope.loading;

            });
        }

        //==============================
        //
        //
        //==============================
        function save() {

            delete $scope.errors;
            $scope.saving = true;

            delete $scope.errors;

            var doc = $scope.document;

            return $http.put('https://api.cbd.int/api/v2013/documents/validate', doc, { params : { schema : doc.header.schema }}).then(res_Data).then(function(report) {

                if(report.errors && report.errors.length)
                    throw report;

                return $http.put('https://api.cbd.int/api/v2013/documents/'+doc.header.identifier+'/versions/draft', doc, { params : { schema : doc.header.schema }}).then(res_Data);

            }).then(function(docInfo) {

                var draftInfo = res.data;
                var type = schemasWorkflowTypes[draftInfo.type];

                if (!type)
                  throw "No workflow type defined for this record type: " + draftInfo.type;

                var workflowData = {
                  "realm": realm,
                  "documentID": draftInfo.documentID,
                  "identifier": draftInfo.identifier,
                  "title": draftInfo.workingDocumentTitle,
                  "abstract": draftInfo.workingDocumentSummary,
                  "metadata": draftInfo.workingDocumentMetadata
                };
                var body = {
    				type    : type.name,
    				version : type.version,
    				data    : workflowData
    			};

    			return $http.post("https://api.cbd.int/api/v2013/workflows", body).then(
    				function(resp) {
    					return resp.data;
    				}
    			);

            }).catch(res_Error).finally(function() {
                delete $scope.saving;
            });
        }

        //==============================
        //
        //
        //==============================
        function upload(files) {

            delete $scope.errors;
            $scope.saving = true;

            $q.when(files[0]).then(function(file) {

                if(!/^image\//.test(file.type)) throw { code : "invalidImageType" };
                if(file.size>1024*500)          throw { code : "fileSize" };

                var uid  = $scope.document.header.identifier;
                var url  = 'https://api.cbd.int/api/v2013/documents/'+uid+'/attachments/'+encodeURIComponent(file.name);

                return $http.put(url, file, { headers : { "Content-Type": file.type } }).then(res_Data);

            }).then(function(attachInfo) {

                $scope.document.logo  = 'https://chm.cbd.int/api/v2013/documents/'+attachInfo.documentUID+'/attachments/'+encodeURIComponent(attachInfo.filename);

            }).catch(res_Error).finally(function() {

                delete $scope.saving;

            });
        }

        //==============================
        //
        //
        //==============================
        function nullOn404(res) {

            if(res.status==404)
                return null;
            throw res;
        }

        //==============================
        //
        //
        //==============================
        function res_Error(err) {

            err = err.data || err;

            $scope.errors = err.errors || [err];

            console.error($scope.errors);
        }

        //==============================
        //
        //
        //==============================
        function res_Data(res) {
            return res.data;
        }
    }];
});
