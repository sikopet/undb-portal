define(['app', 'lodash'], function(app, _) { 'use strict';

app.factory('workflows', ['$http', 'realm', function($http, realm) {

        var schemasWorkflowTypes = {
              "undbAction": {
                name: "publishReferenceRecord",
                version: undefined
              },
              "undbPartner": {
                name: "publishReferenceRecord",
                version: undefined
              },
              "undbParty": {
                name: "publishReferenceRecord",
                version: undefined
              },
              "organization": {
                name: "publishReferenceRecord",
                version: undefined
              } ,
              "event": {
                name: "publishReferenceRecord",
                version: undefined
              }
        };

        return {
            addWorkflow     : addWorkflow,
            updateActivity  : updateActivity,
            getWorkflow     : get,
            create: create,
            get: get,
            cancel: cancel,
            cancelActivity: cancelActivity,
            query: query
        };

        //===========================
        //
        //===========================
        function create(type, version, data) {

            var body = {
                type: type,
                version: version,
                data: data
            };

            return $http.post("/api/v2013/workflows", body).then(function(resp) {
                return resp.data;
            });
        }

        //===========================
        //
        //===========================
        function get(id) {
            return $http.get("/api/v2013/workflows/" + id).then(
                function(resp) {
                    return resp.data;
                });
        }

        //===========================
        //
        //===========================
        function updateActivity(id, activityName, data) {
            return $http.put("/api/v2013/workflows/" + id + "/activities/" + activityName, data).then(
                function(resp) {
                    return resp.data;
                });
        }
        //===========================
        //
        //===========================
        function cancel(id, data) {
            return $http.delete("/api/v2013/workflows/" + id, {
                params: data
            }).then(
                function(resp) {
                    return resp.data;
                });
        }

        //===========================
        //
        //===========================
        function query(query, count, length, skip, sort) {
            return $http.get("/api/v2013/workflows", {
                params: {
                    q: JSON.stringify(query),
                    l: length,
                    s: sort,
                    sk: skip,
                    c: count
                }
            }).then(function(resp) {
                return resp.data;
            });
        }

        function addWorkflow(draftInfo){

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

            return $http.post("/api/v2013/workflows", body).then(
                function(resp) {
                    return resp.data;
                }
            );
        }

        //===========================
        //
        //===========================
        function cancelActivity(id, activityName, data) {
            return $http.delete("/api/v2013/workflows/" + id + "/activities/" + activityName, data).then(
                function(resp) {
                    return resp.data;
                });
        }
    }]);
});
