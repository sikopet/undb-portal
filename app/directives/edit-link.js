define(['text!./edit-link.html', 'app', 'lodash', 'directives/file',
], function(template, app, _) {
  'use strict';

  app.directive('editLink', ['$http','authentication', function($http,authentication) {
    return {
      restrict: 'E',
      template: template,
      replace: false,
      scope: {
        doc: '=document',
        documents: '=links',
        save: '&save',
      },
      link: function($scope, $element, $attr) {

          if($attr.name)
            $scope.name=$attr.name;


          if($attr.schema)
            $scope.schema=$attr.schema;


          if(!$scope.documents)$scope.documents=[];

        //  $scope.user=authentication.getUser();
      }, //link

      controller: ["$scope", function($scope) {

        //=======================================================================
    		//
    		//=======================================================================
          function saveLink () {

              $scope.documents.push($scope.document);
              $scope.save();

          }// saveLink
          $scope.saveLink=saveLink ;

          //=======================================================================
          //
          //=======================================================================
          function upload(files){


                _.each(files,function(file){
                    authentication.getUser().then(function (res){
                        $scope.user=res;
                        uploadDocAtt($scope.schema,$scope.doc.code,file);
                    });
                });

          }
          $scope.upload=upload;

          //=======================================================================
          //
          //=======================================================================
          function uploadDocAtt(schema,_id,file){
                if(!schema)throw "Error: no schema set to upload attachment";
                if(!_id)throw "Error: no docId set to upload attachment";
                var postData = {
                  filename: file.name,
                  //amazon messes with camel case and returns objects with hyphen in property name in accessible in JS
                  // hence no camalized and no hyphanized meta names
                  metadata:{
                      createdby:$scope.user.userID,
                      createdon:Date.now(),
                      schema:schema,
                      docid:_id,
                      filename:file.name,
                  }
                };
                return $http.post('/api/v2015/temporary-files', postData).then(function(res) {
                // Create a temp file location to upload to
                  return res.data;
                }).then(function(target) {
                    // upload file to temp area
                    return $http.put(target.url, file, {
                      headers: {
                        'Content-Type': target.contentType
                      }
                    }).then(function() {
                      // move temp file form temp to its proper home schema/is/filename

                      return $http.get("/api/v2016/mongo-document-attachment/"+target.uid, { });
                    });
                });

          } // uploadDocAtt

      }],
    }; // return
  }]); //app.directive('searchFilterCountries
}); // define
