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
              }
        };

        return {
            addWorkflow : addWorkflow
        };

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

            return $http.post("https://api.cbd.int/api/v2013/workflows", body).then(
                function(resp) {
                    return resp.data;
                }
            );

        }

    }]);
});
