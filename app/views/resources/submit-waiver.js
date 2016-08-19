define(['lodash', 'guid','text!./email.txt', 'app', 'directives/file', 'utilities/workflows', 'utilities/km-storage','directives/google-address','directives/on-focus-helper'], function(_, guid,email) { 'use strict';

    return ['$scope', '$http', '$q', 'locale', 'realm', 'workflows', 'user', '$route', '$anchorScroll', '$location', 'IStorage','$window',
    function($scope,   $http,   $q,   locale,   realm,   workflows,   user,   $route,   $anchorScroll,   $location, storage,$window) {
console.log(user);
$scope.highlightLink='submit';
        $scope.loading = true;
        $scope.save = save;
        //$scope.upload = upload;

        $scope.disabled = function() {
            return $scope.loading ||
                   $scope.saving ||
                  (($scope.documentInfo||{}).workingDocumentLock && !$scope.editWorkflow);
        };

        $scope.patterns = {
            phone    : /^\+\d+(\d|\s|ext|[\.,\-#*()]|)+$/i,
        };

        $scope.$watch('errors', function(errors) {
            if(errors && errors.length)
                $anchorScroll('form');
        });

        //============================================================
        //
        //============================================================
        function initProfile() {




                return $http.get('https://api.cbd.int/api/v2013/users/' + user.userID).then(function onsuccess(response) {
                    if (!$scope.document) $scope.document= {};
                    $scope.document.email = _.clone(response.data.Email);
                    var c = _.find($scope.countries,{code:response.data.Country});
                    $scope.document.address = _.clone(response.data.Address)+', '+_.clone(response.data.City)+', '+c.name;
                    $scope.document.countryObj=c;
                    $scope.document.country = _.clone(response.data.Country);
                    $scope.document.personalTitle = _.clone(response.data.Title);
                    $scope.document.state = _.clone(response.data.State);
                    $scope.document.zip = _.clone(response.data.Zip);
                    $scope.document.phone = _.clone(response.data.Phone);
                    $scope.document.firstName = _.clone(response.data.FirstName);
                    $scope.document.lastName = _.clone(response.data.LastName);
                    $scope.document.title = _.clone(response.data.Designation);
                    $scope.document.orgName = _.clone(response.data.Organization);
                    $scope.document.dept = _.clone(response.data.Department);
                }).catch(res_Error);

        } // initProfile()

        //==============================
        //
        //
        //==============================
        $http.get('https://api.cbd.int/api/v2015/countries', { cache:true, params: { f : { code : 1, name : 1 } } }).then(function(res) {

            res.data.forEach(function(c) {
                c.code = c.code.toLowerCase();
                c.name = c.name[locale];
            });

            $scope.countries = res.data;
            load();
        });


        //==============================
        //
        //
        //==============================
        function load() {

            delete $scope.errors;
            $scope.loading = true;
            initProfile();
            $scope.loading = false;
        }
        //==============================
        //
        //
        //==============================
        function parseMail() {
          _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

          var compiled = _.template(email);
          return encodeURI(compiled($scope.document));
        }
        //==============================
        //
        //
        //==============================
        function save() {

            delete $scope.errors;

            if(!$scope.document.agreed) {
                $scope.errors = $scope.errors || [];
                $scope.errors.push({code : "conditions" });
            }

            if($scope.form.$invalid) {
                $scope.errors = $scope.errors || [];
                $scope.errors.push({code : "invalidForm" });
            }

            if($scope.errors)
                return;

            $window.open("mailto:UNBiodiversity@cbd.int"+ document.email + "?subject=Liability%20Waiver%20Request&body="+parseMail()+"","_self");
                return;


        }

        //==============================
        //
        //
        //==============================
        // function upload(files) {
        //
        //     if(!files[0])
        //         return;
        //
        //     delete $scope.errors;
        //     $scope.saving = true;
        //
        //     $q.when(files[0]).then(function(file) {
        //
        //         if(!/^image\//.test(file.type)) throw { code : "invalidImageType" };
        //         if(file.size>1024*500)          throw { code : "fileSize" };
        //
        //         var uid  = $scope.document.header.identifier;
        //         var url  = 'https://api.cbd.int/api/v2013/documents/'+uid+'/attachments/'+encodeURIComponent(file.name);
        //
        //         return $http.put(url, file, { headers : { "Content-Type": file.type } }).then(res_Data);
        //
        //     }).then(function(attachInfo) {
        //
        //         $scope.document.logo  = 'https://chm.cbd.int/api/v2013/documents/'+attachInfo.documentUID+'/attachments/'+encodeURIComponent(attachInfo.filename);
        //
        //     }).catch(res_Error).finally(function() {
        //
        //         delete $scope.saving;
        //
        //     });
        // }


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
            $scope.$emit('showError', 'ERROR: Actor was not saved.');
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
