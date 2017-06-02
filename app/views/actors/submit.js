define(['lodash', 'text!./del-dial.html','app', 'ngDialog','authentication',     'filters/moment','utilities/km-utilities', 'utilities/km-storage', 'filters/moment', 'utilities/solr', 'filters/navigation'], function(_,delDial) { 'use strict';

    return ['$scope', '$route', '$http', '$location', '$q', 'solr', 'user', 'IStorage', 'realm','ngDialog',
     function($scope, $route, $http, $location, $q, solr, user, storage, realm,ngDialog) {

        $scope.pageSize = 15;

        $scope.schema      = _.camelCase('undbPartner'/*$route.current.params.schema*/);
        $scope.facets      = undefined;
        $scope.records     = null;
        $scope.status      = "";
        $scope.currentPage = 0;
        $scope.pages       = [];
        $scope.onPage      = loadPage;
        $scope.onText      = _.debounce(function(){ loadPage(0, true); }, 500);
        $scope.onDelete    = del;
        $scope.onEdit      = edit;
        $scope.onReloadList = reloadList;
        $scope.onWorkflow  = viewWorkflow;
        $scope.qs = $location.search();

        $scope.onAdd       = function() {
            edit({ schema_s : $scope.schema });
        };


        $scope.formatWID   = function (workflowID) {
    		return workflowID ? workflowID.replace(/(?:.*)(.{3})(.{4})$/g, "W$1-$2").toUpperCase() : "";
    	};

       reloadList();

        $scope.$on("RefreshList", function(ev) {
           reloadList();
        });

       function reloadList(){
            refreshPager();
            loadPage(0);
            refreshFacetCounts();
        }

        //======================================================
        //
        //
        //======================================================
        function loadPage(pageIndex, refreshFacets) {

            pageIndex = pageIndex || 0;

            if(pageIndex <0)
                return;

            if(pageIndex>0 && pageIndex >= $scope.pages.length)
                return;

            delete $scope.error;

            $scope.loading = true;

            // Execute query

            var qsParams =
            {
                "q"  : buildQuery(),
                "fl" : "id,identifier_s, schema_*, title_*, summary_*, description_*, created*, updated*, reportType_*_t, url_ss, _revision_i, _state_s, _latest_s, _workflow_s",
                "sort"  : "updatedDate_dt desc",
                "start" : pageIndex*Number($scope.pageSize),
                "rows"   : Number($scope.pageSize),
            };

            var qRecords = $http.get('/api/v2013/index', { params : qsParams }).then(function(res) {

                if($route.current.params.auto && !res.data.response.numFound) {
                    $location.replace();
                    $location.url('actions/submit-form');
                    return;
                }

                if($route.current.params.auto) {
                    $location.replace();
                    $location.search('auto', undefined);
                }

                $scope.recordCount = res.data.response.numFound;
                $scope.records     = _.map(res.data.response.docs, function(v){
                    return _.defaults(v, {
                        schemaName     : solr.lstring(v, "schema_*_t",     "schema_EN_t",     "schema_s"),
                        title          : solr.lstring(v, "title_*_t",      "title_EN_t",      "title_t"),
                        summary        : solr.lstring(v, "summary_*_t",    "description_*_t", "summary_EN_t", "description_EN_t", "summary_t", "description_t"),
                        reportTypeName : solr.lstring(v, "reportType_*_t", "reportType_EN_t"),
                        url            : toLocalUrl(v.url_ss),
                    });
                });

                refreshPager(pageIndex);

            });

            var qFacets;

            if(!$scope.facets || refreshFacets)
            {
                qFacets = refreshFacetCounts();
            }

            return $q.all([qRecords, qFacets]).catch(function(res){

                $scope.records     = [];
                $scope.recordCount = -1;
                $scope.error       = res.data || res;

                console.error($scope.error);

            }).finally(function(){
                delete $scope.loading;
            });
        }


        //======================================================
        //
        //
        //======================================================
        function refreshFacetCounts() {

            var qFacets;

            // Execute facets query
            var qsFacetParams =
            {
                "q"  : buildQuery({ status : undefined, latest : undefined }),
                "row"   : 0,
                "facet" : true,
                "facet.field" : "_state_s",
            };

            qFacets = $http.get('/api/v2013/index', { params : qsFacetParams }).then(function(res) {

                var documentState = _(res.data.facet_counts.facet_fields._state_s).chunk(2).zipObject().value();

                $scope.facets = _.defaults(documentState, {
                    public   : 0,
                    draft    : 0,
                    workflow : 0,
                    total    : res.data.response.numFound
                });
            });
            return $q.all(qFacets).catch(function(res){

                $scope.error       = res.data || res;
                console.error($scope.error);

            }).finally(function(){
                delete $scope.loading;
            });
        }

        //======================================================
        //
        //
        //======================================================
        function toLocalUrl(urls) {

            return urls;
        }

        //============================================================
        //
        //============================================================
        function delDialog() {

            var dialog = ngDialog.open({
                template: delDial,
                className: 'ngdialog-theme-default',
                closeByDocument: false,
                plain: true,
                scope: $scope
            });
            $scope.ignoreDirtyCheck = true;
            return dialog.closePromise;
        };

        //======================================================
        //
        //
        //======================================================
        function buildQuery(options) {

            options = _.assign({
                schema    : $scope.schema,
                status    : $scope.status,
                latest    : true,
                freetext  : $scope.freetext
            }, options || {});

            var query  = [];

            // Add Schema

            query.push("schema_s:" + solr.escape(options.schema));
            query.push(["realm_ss:" + realm.toLowerCase(), "(*:* NOT realm_ss:*)"]);

            // Apply ownership/contributor

            // query.push(_.union(["_contributor_is:"+user.userID],
            //            _.map(user.userGroups, function(v){
            //                 return "_ownership_s:"+solr.escape(v);
            //             }))
            // );

            // Status

            if(options.status) {
                query.push("_state_s:" + solr.escape(options.status));
            }
            else if(options.latest!==undefined){
                query.push("_latest_s:" + (options.latest ? "true" : "false"));
            }

            // freetext

            if(options.freetext)
              {
                  var escapedWords = null;
                  options.freetext = options.freetext.trim();

                  //process quoted search
                  if( (options.freetext[0]==='"' && options.freetext[options.freetext.length-1]==='"') || (options.freetext[0]==="'" && options.freetext[options.freetext.length-1]==="'") )
                  {
                         options.freetext = options.freetext.substr(1); //remove first quote
                         options.freetext = options.freetext.slice(0, -1);//remove lastquote

                        escapedWords = _(_.words(options.freetext)).map(function(w){
                            return solr.escape(w);
                        }).value();
                        query.push([
                            'title_t:("'       +escapedWords.join(' ')+ '")',
                            'description_t:("' +escapedWords.join(' ')+ '")',
                            'text_EN_txt:("'   +escapedWords.join(' ')+ '")',
                            'title_EN_t:("'    +escapedWords.join(' ')+ '")',
                            'summary_EN_t:("'  +escapedWords.join(' ')+ '")',
                        ]);
                  } else{
                      escapedWords = _(_.words(options.freetext)).map(function(w){
                          return solr.escape(w)+'*';
                      }).value();
                      query.push([
                          'title_t:('       +escapedWords.join(' AND ')+ ')',
                          'description_t:(' +escapedWords.join(' AND ')+ ')',
                          'text_EN_txt:('   +escapedWords.join(' AND ')+ ')',
                          'title_EN_t:('    +escapedWords.join(' AND ')+ ')',
                          'summary_EN_t:('  +escapedWords.join(' AND ')+ ')',
                      ]);
                  }
              }

            // AND / OR everything

            return solr.andOr(query);
        }

        //======================================================
        //
        //
        //======================================================
        function refreshPager(currentPage)
        {
            currentPage = currentPage || 0;

            var pageCount = Math.ceil(Math.max($scope.recordCount||0, 0) / Number($scope.pageSize));
            var pages     = [];

            for (var i = 0; i < pageCount; i++) {
                pages.push({ index : i, text : i+1 });
            }

            $scope.currentPage = currentPage;
            $scope.pages       = pages;

        }
        //=======================================================================
        //
        //=======================================================================
        $scope.extractId = function(id){
            return parseInt(id.replace('52000000cbd08', ''), 16);
        };

          //=======================================================================
          //
          //=======================================================================
          $scope.goTo= function (url,code){

            if(code)
               $location.url(url+$scope.extractId(code));
            else
              $location.url(url);
          };
        //======================================================
        //
        //
        //======================================================
        function edit(record)
        {
            var url = '/actors/register/';

            if(record && record.identifier_s)
                url += record.identifier_s;

            $location.url(url);
        }


        //======================================================
        //
        //
        //======================================================
        function del(record, ev)
        {
            var repo = null;
            var identifier = record.identifier_s;

            $q.when(record).then(function(r) {

                    if(r._state_s == "public")  repo = storage.documents;
               else if(r._state_s == "draft")   repo = storage.drafts;
               else                             throw new Alert("Cannot delete request");

               return repo.exists(identifier);

           }).then(function(exist) {

                if(!exist)
                    throw new Alert("Record not found.");

                delDialog().then(function(ret) {
                    if (ret.value === 'delete') {
                        //do toast
                        return repo.delete(identifier).then(function(){
                          reloadList();
                          $scope.$emit('showInfo', 'Action successfully deleted.');
                        });
                    }
                });



            }).catch(function(e){

                if(e instanceof Noop)
                    return;

                if(e instanceof Alert) {
                    alert(e.message);
                    return;
                }

                $scope.error = e;
            });

            function Alert(msg) { this.message = msg; }
            function Noop()     { }
        }

        //======================================================
        //
        //
        //======================================================
        function viewWorkflow(record)
        {
            window.location.href = "https://chm.cbd.int/management/requests/" + record._workflow_s.replace(/^workflow-/i, "") + "/publishRecord";
        }
    }];
});
