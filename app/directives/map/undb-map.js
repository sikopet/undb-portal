define(['text!./undb-map.html',
  'app',
  'jquery',
  'lodash',
  'text!./champs.js',
  './ammap3',

 "factories/km-utilities",

  "./filter-parties",
  "./filter-case-studies",
  "./filter-actors",
  "./filter-actions",
  "./filter-projects",
  "./filter-bio-champs",


], function(template, app, $, _,champsData) {
  'use strict';

  app.directive('undbMap', ['$http', 'realm', '$q', '$timeout', '$location', '$filter', function($http, realm, $q, $timeout, $location, $filter) {
    return {
      restrict: 'E',
      template: template,
      replace: true,
      scope: {},
      require: 'undbMap',
      link: function($scope, $element, $attr, reportingDisplay) { // jshint ignore:line
        $scope.activeFilter= 'actors';
        $scope.loaded = false;
        $scope.zoomToMap = [];
        $scope.showCountry = '';
        $scope.subQueries = {};
        $scope.queriesStrings = {};
        $scope.message='';
        $http.get("/api/v2013/countries", {
          cache: true
        }).then(function(o) {
          $scope.countries = $filter('orderBy')(o.data, 'title|lstring');
          return;
        }).then(function() {
          reportingDisplay.search();
        });


        $element.find("#customHome").on('click', function(event) {
          $scope.$broadcast('customHome', 'show');
        });
        $scope.message="The UNDB Network comprises all Actors contributing to the implementation of the 2011-2020 Strategic Plan for Biodiversity.";
        $scope.toggleCaption=1;
        $scope.filters={
          'parties':{active:false},
          'actors':{active:true},
          'caseStudies':{active:false},
          'bioChamps':{active:false},
          'projects':{active:false},
          'actions':{active:false},
        };
        $scope.champs=[
          {
        //    name: 'India',
            rank: 1,
        //    date: "2012-10-16",
        //    imgURL: "https://www.cbd.int/images/flags/64/flag-in-64.png",
        //    link: "/actions/country/in",
      //      countryCode: "IN",
      //      aichiTargets: "All",
            coordinates_s:{lat:21.000000,lng:78.000000},
      //      directions:"https://www.google.ca/maps/place/India/@19.9647772,70.6990663,5z/data=!4m2!3m1!1s0x30635ff06b92b791:0xd78c4fa1854213a6",
      //      pledge: "<b>US$&nbsp;50 Million</b>for India and developing countries pledged by <b>Dr. Manmohan Singh</b>, <b>Prime Minister of India</b>, at the inauguration of the High-Level Segment of <a href=\"https://www.cbd.int/cop11/\">COP&nbsp;11</a><a  href=\"https://www.cbd.int/doc/speech/2012/sp-2012-10-16-cop11-hls-in-pm-en.pdf\">View the Prime Minister's speech</a>"
          },
          {
           name: 'India',
            rank: 1,
           date: "2012-10-16",
           imgURL: "https://www.cbd.int/images/flags/64/flag-in-64.png",
           link: "/actions/country/in",
           countryCode: "IN",
           aichiTargets: "All",
            coordinates_s:{lat:21.000000,lng:78.000000},
           directions:"https://www.google.ca/maps/place/India/@19.9647772,70.6990663,5z/data=!4m2!3m1!1s0x30635ff06b92b791:0xd78c4fa1854213a6",
           pledge: "<b>US$&nbsp;50 Million</b>for India and developing countries pledged by <b>Dr. Manmohan Singh</b>, <b>Prime Minister of India</b>, at the inauguration of the High-Level Segment of <a href=\"https://www.cbd.int/cop11/\">COP&nbsp;11</a><a  href=\"https://www.cbd.int/doc/speech/2012/sp-2012-10-16-cop11-hls-in-pm-en.pdf\">View the Prime Minister's speech</a>"
          },
          {
            name: "FICCI",
            rank: 2,
            date: "2012-11-09",
            imgURL: "https://www.cbd.int/images/champions/ficci-64.jpg",
            link: "http://ficci.in",
            aichiTargets: "All",
            coordinates_s:{lat:29,lng:77},
            directions:"http://ficci.in/contact-us.asp",
            pledge: "<a href='http://www.ficci.com/'>FICCI</a> has Launched Campaign on Business to Pledge for Biodiversity. 21 companies have already join the Pledge and many more are expected to join. <a href='https://www.cbd.int/doc/champions/pledge-2012-10-22-ficci-en.pdf'>More</a>"
          }, {
            name: "Maldives",
            rank: 3,
            date: "2013-02-05",
            imgURL: "https://www.cbd.int/images/flags/64/flag-mv-64.png",
            link: "/actions/country/mv",
            aichiTargets: "4, 5, 6, 7, 11 and 15",
            coordinates_s:{lat:4.1771005,lng:73.5056351},
            directions:"https://www.google.ca/maps/place/Male,+Maldives/@4.1771005,73.5056351,16z/data=!3m1!4b1!4m2!3m1!1s0x3b3f7e5595f14b55:0x81b633ea397dba57",
            pledge: " The whole country of Maldives will be a <a href='https://www.cbd.int/doc/world/mv/mv-biosphere-reserve-en.pdf'>UNESCO Biosphere Reserve by 2017</a>  – where public support for conservation of the country's remarkable environment secures a vibrant green economy and good quality of life for ail Maldivians. <a href='/doc/champions/pledge-2013-02-05-mv-en.pdf' class='atc-link'>More</a>"
          }, {
            name: "Friends of Target 12",
            rank: 4,
            date: "2013-03-04 ",
            imgURL: "https://www.cbd.int/images/aichi/48/abt-12-48.png",
            link: "http://www.iucn.org/about/work/programmes/species/our_work/species_and_policy/friends_of_target_12/",
            aichiTargets: "12",
            coordinates_s:{lat:50,lng:-18},
            pledge: "19 partners, including Governments and International Organizations, launched the \"Friends of Target 12\" initiative to support CBD Parties and others to achieve Aichi Target 12 by providing practical guidance and raising awareness of initiatives and programmes that contribute to the implementation of the activities needed to stem the tide of species’ extinctions. "
          }, {
            name: "Caribbean Challenge Initiative (CCI)",
            rank: 5,
            date: "2013-05-18",
            imgURL: "https://www.cbd.int/cooperation/cci/images/cci-64.png",
            aichiTargets: "11 and 12 (also 5, 6, 7, and 10)",
            link:"http://www.caribbeanchallengeinitiative.org/",
            coordinates_s:{lat:12.0471534,lng:-61.7454654},
            directions:"https://www.google.ca/maps/place/Ministerial+Complex/@12.0471534,-61.7454654,17z/data=!4m6!1m3!3m2!1s0x8c38219c3ca4df17:0xa7f0c41080936281!2sMinisterial+Complex!3m1!1s0x8c38219c3ca4df17:0xa7f0c41080936281",
            pledge: "Nine participating countries and territories to the <a href='https://www.cbd.int/cooperation/cci/'>Caribbean Challenge Initiative</a> have committed to conserving at least 20% of their nearshore marine and coastal environments in national marine protected areas systems by 2020; and creating National Conservation Trust Funds, endowed by new sustainable finance mechanisms (such as tourism fees), dedicated to solely to funding park management. A recent Summit of political and business leaders (<a href='https://www.cbd.int/cooperation/cci/doc/cover-note-submit-summary-2013-07-02-en.pdf'>Cover note</a> and  <a href='https://www.cbd.int/cooperation/cci/doc/cci-outcomes-summary-2013-06-27-en.pdf'>Summary of CCI Summit</a>) assisted in galvanizing US $75 million in funding commitments to safeguard the marine and coastal environment along with commitments to take new marine conservation actions and to put in place more sustainable business practices. The <a href='http://www.cbd.int/island/glispa.shtml '>Global Island Partnership</a> has been recognized to play a crucial role in supporting regional challenges. 7 full CBD Parties (Bahamas, Dominican Republic, Grenada, Jamaica, St. Kitts & Nevis, St. Lucia, and St. Vincent and the Grenadines) plus the British Virgin Islands (UK overseas territory) and Puerto Rico (US territory) are currently participating in the CCI. <br> <br> More:  Leaders declarations ( <a href='https://www.cbd.int/cooperation/cci/doc/leaders-declaration-en.pdf'>English</a> | <a href='https://www.cbd.int/cooperation/cci/doc/leaders-declaration-es.pdf'>Spanish</a>);  <a href='https://www.cbd.int/cooperation/cci/doc/corporate-compact-2013-05-17-en.pdf'>Corporate Compact</a>;  <a href='https://www.cbd.int/cooperation/cci/doc/letter-grenada-en.pdf'>Letter from Grenada Government</a> "
          }, {
            name: "Bridging Agriculture and Conservation Initiative",
            rank: 6,
            date: "2013-08-01",
            imgURL: "https://www.cbd.int/images/champions/bioversity-international-64.png",
            link: "http://www.bioversityinternational.org/",
            aichiTargets: "All",
            coordinates_s:{lat:41.878617,lng:12.2350033},
            directions:"https://www.google.ca/maps/place/Viale+Tre+Denari,+467,+00054+Maccarese-Stazione+RM,+Italy/@41.878617,12.2350033,17z/data=!3m1!4b1!4m2!3m1!1s0x1325f8142c9250a3:0x7710156f660b26ca",
            pledge: "<a href='http://www.bioversityinternational.org/'>Bioversity International</a> is leading this multi-institutional initiative to alleviate poverty, conserve biodiversity, and promote food security within global agricultural systems. (<a href='https://www.cbd.int/doc/champions/champions-2013-bioversity-baci.pdf'>Background to preparatory meeting</a> and <a href='http://www.bioversityinternational.org/fileadmin/bioversityDocs/Announcements/Agriculture_Conservation_Final_Declaration_03.pdf'>declaration of global leaders</a>).  It addresses needs for more sustainable, socially equitable, resilient, nutritious and adaptable, as well as productive, food and farming systems. The initiative pledges to build, and leverage existing, science and sound economics to underpin critical advances and raise awareness. Since agriculture is the dominant use of land and water, and has a prominent role in sustainable development, the initiative promotes important solutions to help achieve multiple Aichi Biodiversity Targets. <p><a href='https://www.cbd.int/doc/champions/champions-2013-bioversity-letter.pdf' class='atc-link'>2013 - Letter from Bioversity International Director General</a><br><a href='https://www.cbd.int/doc/champions/champions-2013-bioversity-baci.pdf' class='atc-link'>2013 - The Bridging Agriculture and Conservation Initiative (BACI)</a><br><a href='https://www.cbd.int/doc/champions/champions-2014-bioversity-letter.pdf' class='atc-link'>2014 - Letter from Bioversity International Director General</a><br><a href='https://www.cbd.int/doc/champions/champions-2014-bioversity-baci.pdf' class='atc-link'>2014 - Brief update on the status of Bioversity's BACI pledge</a> "
          }, {
            name: "Gaborone Declaration initiative",
            rank: 7,
            date: "2013-09-03",
            imgURL: "https://www.cbd.int/images/champions/bc-medal-64.png",
            link:"http://www.gaboronedeclaration.com/",
            aichiTargets: " 1, 2, 3, 4, 5, 7, 9, 12, 14, 15, 17 and 19 ",
            coordinates_s:{lat:-24.6090728,lng:25.8604649},
            directions:"https://www.google.ca/maps/place/Gaborone,+Botswana/@-24.6090728,25.8604649,12z/data=!4m2!3m1!1s0x1ebb5b3c2ceea9bf:0x49a1769397ae11a1",
            pledge: "The Gaborone Declaration on Sustainability in Africa, which has been signed by 10 African States and 19 non-state institutions, is an important vehicle for implementation of sustainability in Africa. Botswana pledges its implementation of its commitments under the Gaborone Declaration on Sustainability in Africa, towards meeting the Aichi Biodiversity Targets. <a href='https://www.cbd.int/doc/champions/gaborone-declaration-botswana-en.pdf'>The Gaborone Declaration</a> and <a href='https://www.cbd.int//doc/champions/letter-from-botswana-en.pdf'>Letter from the Botswana Government</a>. "
          }, {
            name: "Natural Capital Declaration (NCD)",
            rank: 8,
            date: "2013-10-10",
            imgURL: "https://www.cbd.int/images/champions/ncd-64.jpg",
            link: "http://www.naturalcapitaldeclaration.org",
            aichiTargets: "2",
            coordinates_s:{lat:51.75248,lng:-1.268347},
            directions:"https://www.google.com/maps?ll=51.75248,-1.268347&z=16&t=m&hl=en-US&gl=GB&mapclient=embed&cid=1303267332516840483",
            pledge: "The <a href='http://www.naturalcapitaldeclaration.org/'>Natural Capital Declaration (NCD)</a> is a finance-led and CEO-endorsed initiative to integrate natural capital considerations into financial products and services, and to work towards their inclusion in financial accounting, disclosure and reporting. <a href='http://www.naturalcapitaldeclaration.org/resources/' class='atc-link'>More</a>"
          }, {
            name: "World Public Health Nutrition Association (WPHNA)",
            rank: 9,
            date: "2013-11-14",
            imgURL: "https://www.cbd.int/images/champions/wphna-64.jpg",
            link: "http://wphna.org/",
            aichiTargets: "1, 4, 12, 13,14, 18, 19",
            coordinates_s:{lat:51.5226761,lng:-0.1172697},
            directions:"https://www.google.com/maps?ll=51.522676,-0.115081&z=15&t=m&hl=en-US&gl=NO&mapclient=embed&q=Charles+Darwin+House,+12+Roger+St+London+WC1N+2JU+UK",
            pledge: "The <a href='http://wphna.org/'>WPHNA</a> will bring to the attention of its membership the relationship between nutrition and biodiversity, thereby advancing the CBD’s cross-cutting initiative on biodiversity for food and nutrition, the sustainable diets initiative, and contributing to the achievement of the Aichi Biodiversity Targets. <a href='https://www.cbd.int/doc/champions/pledge-form-2013-11-14-WPHNA-en.pdf' class='atc-link'>More</a>. "
          }, {
            name: "The India Business & Biodiversity Initiative (IBBI)",
            rank: 10,
            date: "2014-01-31",
            imgURL: "https://www.cbd.int/images/champions/cii-itc.jpg",
            link: "http://www.sustainabledevelopment.in/",
            aichiTargets: "1 to 16",
            coordinates_s:{lat:28.6245915,lng:77.2180992},
            directions: "https://www.google.ca/maps/place/CII-ITC+Centre+of+Excellence+for+Sustainable+Development/@28.6243935,77.218128,14.98z/data=!4m2!3m1!1s0x0:0x1a570d2cd28d701d",
            pledge: "The <a href='http://www.cii.in'>Confederation of Indian Industry (CII)</a> is hosting the India Business & Biodiversity Initiative (IBBI) that is a national platform for business and its stakeholders for dialogue, sharing and learning on biodiversity management. Being a business-led multi-stakeholder initiative, the aim of IBBI is to mainstream sustainable management of biological diversity into business.  <a href='https://www.cbd.int/doc/champions/pledge-2014-01-31-cii-en.pdf' class='atc-link'>More</a>"
          }
        ];
        $scope.urlStrings = {
        'parties': {
          'schema_s': [
            'parties'
          ]
        },
        'projects': {
          'schema_s': [
            'lwProject'
          ],
            "expired_b":['false'],
        },
        'actors': {
          'schema_s': ['undbPartner'],
          '_state_s':['public']
        },
        'caseStudies': {
          'schema_s': [
            'caseStudy'
          ]
        },
        'actions': {
          'schema_s': ['undbAction'],
          '_state_s':['public']
        },
        'bioChmaps': {
          'schema_s': [
            'bioChamps'
          ],
        },
      };


        //=======================================================================
        //
        //=======================================================================
        $scope.buildQuery = function() {
          // NOT version_s:* remove non-public records from resultset
          var q = 'NOT version_s:* ';//'NOT version_s:* AND realm_ss:' + realm.toLowerCase(); //+ ' AND schema_s:* '

          var subQueries = [];

          _.each($scope.subQueries, function(filter, filterName) {

            if(filterName=="parties")return q = 'parties';

            subQueries = _.compact([
              getFormatedSubQuery(filterName, 'schema_s'),
              getFormatedSubQuery(filterName, 'expired_b'),

            ]);
          });

          if (subQueries.length)
          q += " AND " + subQueries.join(" AND ");

          return q;
        }; //$scope.buildQuery

        //=======================================================================
        //
        //=======================================================================
        function getFormatedSubQuery(filter, name) {

          if (!filter) return '';
          var fil = $scope.subQueries[filter];

          if (!fil) return '';
          if (!fil[name]) return '';

          var subQ = '';
          subQ += name + ':' + fil[name].join(' OR ' + name + ":");
          subQ = '(' + subQ + ')';

          return subQ;
        } //function getFormatedSubQuery (name)

      }, //link

      //=======================================================================
      //
      //=======================================================================
      controller: ["$scope", function($scope) {
          var queryScheduled = null;
          var canceler = null;

          //=======================================================================
          //
          //=======================================================================
          function query($scope) {


            readQueryString();

            if (_.isEmpty($scope.subQueries)) return;


            if($scope.selectedSchema  === 'parties'){
              //$scope.selectedSchema = 'parties';
              filterActive('parties');
              $scope.documents=groupByCountry($scope.countries,1);
              updateQueryString();
              return;
            }
            if($scope.selectedSchema  === 'bioChamps'){
              filterActive('bioChamps');
              $scope.documents = _.clone($scope.champs);
              updateQueryString();
              return;
            }


            var queryParameters = {
              'q': $scope.buildQuery(),
            //  'sort': 'createdDate_dt desc, title_t asc',
              //'fl': 'reportType_s,documentID,identifier_s,id,title_t,description_t,url_ss,schema_EN_t,date_dt,government_EN_t,schema_s,number_d,aichiTarget_ss,reference_s,sender_s,meeting_ss,recipient_ss,symbol_s,eventCity_EN_t,eventCountry_EN_t,startDate_s,endDate_s,body_s,code_s,meeting_s,group_s,function_t,department_t,organization_t,summary_EN_t,reportType_EN_t,completion_EN_t,jurisdiction_EN_t,development_EN_t,_latest_s,nationalTarget_EN_t,progress_EN_t,year_i,text_EN_txt,nationalTarget_EN_t,government_s',
              'fl':'title_s,schema_EN_t,thumbnail_s,coordinates_s,url_ss,googleMaps_s,startDate_s,endDate_s,country_s,description_s,lat_d,lng_d,descriptionNative_s',
              'wt': 'json',
              'start': 0,
              'rows': 1000000,
            };

            if (canceler) {
              canceler.resolve(true);
            }

            canceler = $q.defer();
            updateQueryString();

            $http.get('/api/v2013/index/select', {
              params: queryParameters,
              timeout: canceler.promise,
              cache: true
            }).success(function(data) {
              canceler = null;

              $scope.count = data.response.numFound;
              $scope.count = data.response.docs.length;
              $scope.documents = data.response.docs;
            });
          } // query

          //=======================================================================
          //
          //=======================================================================
          function groupByCountry(list,countries) {
            var docsByCountry = {};
            $scope.euData = {};
            if (!$scope.countries) return '';
            if(countries){
              _.each($scope.countries, function(doc) {
                if (!docsByCountry[doc.code]) // if country object not created created
                {
                  docsByCountry[doc.code] = [];
                  docsByCountry[doc.code] = getCountryById(doc.code); //insert country data
                  docsByCountry[doc.code].docs = {}; // initializes the countries docs
                }
              });
            }//if not list
            if(!countries)
            _.each(list, function(doc) {
              if (!docsByCountry[doc.government_s]) // if country object not created created
              {
                docsByCountry[doc.government_s] = [];
                docsByCountry[doc.government_s] = getCountryById(doc.government_s); //insert country data
                docsByCountry[doc.government_s].docs = {}; // initializes the countries docs
              }

              if (!docsByCountry[doc.government_s].docs[doc.schema_s]) //order docs by schema
                docsByCountry[doc.government_s].docs[doc.schema_s] = [];

              if (doc.reportType_s && doc.reportType_s == 'B0EBAE91-9581-4BB2-9C02-52FCF9D82721') {
                if (!docsByCountry[doc.government_s].docs.nbsaps)
                  docsByCountry[doc.government_s].docs.nbsaps = [];
                docsByCountry[doc.government_s].docs.nbsaps.push(doc);
              } else
                docsByCountry[doc.government_s].docs[doc.schema_s].push(doc); // insert doc

              docsByCountry[doc.government_s].expanded = false;
              docsByCountry[doc.government_s].hidden = false;

              if (docsByCountry[doc.government_s].docs[doc.schema_s].length > 1 && doc.schema_s === 'nationalAssessment')
                docsByCountry[doc.government_s].docs[doc.schema_s].sort(
                  function(a, b) {
                    if (b.date_dt && a.date_dt) return new Date(b.date_dt) - new Date(a.date_dt);
                  }); // sort by date

              if (docsByCountry[doc.government_s].docs[doc.schema_s].length > 1 && doc.schema_s === 'nationalAssessment')
                docsByCountry[doc.government_s].docs[doc.schema_s].sort(function(a, b) {
                  if (b.progress_EN_t && a.progress_EN_t)
                    return progressToNum(b.progress_EN_t) - progressToNum(a.progress_EN_t);
                }); // sort sort by progress
              docsByCountry[doc.government_s].isEUR = false;
            });

            if (docsByCountry.EU)
              docsByCountry.EU.isEUR = true;

            setNumDocumentsInCountry();
            return docsByCountry;
          } //readQueryString

          //=======================================================================
          //
          //=======================================================================
          function getCountryById(id) {

            var index = _.findIndex($scope.countries, function(country) {

              return country.code.toUpperCase() === id.toUpperCase();
            });
            return $scope.countries[index];
          } //getCountryById

          //=======================================================================
          //
          //=======================================================================
          function setNumDocumentsInCountry() {
            var totalDocs = 0;
            _.each($scope.countries, function(country) {
              _.each(country.docs, function(schema) {
                totalDocs += schema.length;
              });
              country.numDocs = totalDocs;
              totalDocs = 0;
            });
          } //setNumDocumentsInCountry()

          //=======================================================================
          //getter/setter
          //=======================================================================
          function filterActive(activeFilter) {
              $scope.toggleCaption=true;
              _.each($scope.filters,function(filter){
                  filter.active=false;
              });
              if (activeFilter)
                $scope.filters[activeFilter].active = true;
          }

          //=======================================================================
          //
          //=======================================================================
          function readQueryString() {

            var filter = _([$location.search().filter]).flatten().compact().value()[0]; // takes query string into array

            if (!_.isEmpty(filter) && (_.isEmpty($scope.subQueries))) {
              $scope.subQueries = {};
              $scope.subQueries[filter[1]] = _.cloneDeep($scope.urlStrings[filter[1]]);
              $scope.selectedSchema = filter[1];
            }

          } //readQueryString

          //=======================================================================
          //
          //=======================================================================
          function updateQueryString() {

            _.each($scope.subQueries, function(filter, filterName) {
              _.each(filter, function(itemIdArr, schemaKey) {

                $location.replace();
                $location.search('filter', filterName);
                $scope.selectedSchema = filterName;
              });
            });

          } //updateQueryString

          //=======================================================================
          //
          //=======================================================================
          function search() {

            if (queryScheduled)
              $timeout.cancel($scope.queryScheduled);
            queryScheduled = $timeout(function() {
              query($scope);
            }, 100);
          } //search

          //=======================================================================
          //
          //=======================================================================
          function addSubQuery(filter, name, query, singleTon) {

            $scope.subQueries = {};
            $scope.selectedSchema = '';
            $location.replace();
            $location.search('filter', null);
            if (filter && name && !query && !singleTon) {
              $scope.subQueries = _.cloneDeep(filter);
              $scope.selectedSchema = name;
            }
          } //addSubQuery

          //=======================================================================
          //
          //=======================================================================
          function deleteSubQuery(name, scope) {
            var item = null;

            if (scope.item === undefined)
              item = scope;
            else {
              item = scope.item;
              item.selected = !item.selected;
            }
            var i = $scope.subQueries[name].indexOf(item.identifier);
            if (i !== -1)
              $scope.subQueries[name].splice(i, 1);
          } //deleteSubQuery

          //=======================================================================
          //
          //=======================================================================
          function deleteAllSubQuery(name) {

            $scope.subQueries = [];
            $scope.items = [];
          } //deleteSubQuery

          //=======================================================================
          //
          //=======================================================================
          function zoomToCountry(id) {
            $scope.zoomToMap = [];
            $scope.zoomToMap.push(id);
          } //buildQuery

          //=======================================================================
          //
          //=======================================================================
          function showCountryResultList(id) {
            $scope.showCountry = id;
          } //showCountryResultList


          this.filterActive=filterActive;
          this.showCountryResultList = showCountryResultList;
          this.zoomToCountry = zoomToCountry;
          this.deleteAllSubQuery = deleteAllSubQuery;
          this.deleteSubQuery = deleteSubQuery;
          this.search = search;
          this.addSubQuery = addSubQuery;
        }] //controlerr
    }; //return
  }]); //directive
}); //define
