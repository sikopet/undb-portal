define(['text!./undb-map.html',
  'app',
  'jquery',
  'lodash',
  './ammap3',
  "factories/km-utilities",
  "./filter-parties",
  "./filter-actors",
  "./filter-actions",
  "./filter-bio-champs",
], function(template, app, $, _) {
  'use strict';

  app.directive('undbMap', ['$http', 'realm', '$q', '$timeout', '$location', '$filter', function($http, realm, $q, $timeout, $location, $filter) {
    return {
      restrict: 'E',
      template: template,
      replace: true,
      scope: {},
      require: 'undbMap',
      link: function($scope, $element, $attr, reportingDisplay) { // jshint ignore:line
        $scope.activeFilter = 'actors';
        $scope.loaded = false;
        $scope.zoomToMap = [];
        $scope.showCountry = '';
        $scope.subQueries = {};
        $scope.queriesStrings = {};
        $scope.message = '';
        $scope.toggleCaption = 1;

        $http.get("https://api.cbd.int/api/v2015/countries", {
          cache: true
        }).then(function(o) {
          $scope.countries = $filter('orderBy')(o.data, 'title|lstring');
          return;
        });


        $element.find("#customHome").on('click', function() {
          $scope.$broadcast('customHome', 'show');
        });

        $scope.message = "The UNDB Network comprises all Actors contributing to the implementation of the 2011-2020 Strategic Plan for Biodiversity.";
        $scope.toggleCaption = 1;
        $scope.filters = {
          'parties': {
            active: false
          },
          'actors': {
            active: true
          },
          'caseStudies': {
            active: false
          },
          'bioChamps': {
            active: false
          },
          'projects': {
            active: false
          },
          'actions': {
            active: false
          },
        };

        $scope.actions = [{}, {
          "lat_d": 200.5597832,
          "lng_d": -200.9917114
        }, {
          "title_s": "Big Project",
          logo_s: "http://files.sharenator.com/28110.jpg",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 45.5597832,
          "lng_d": -73.9917114
        }, {
          logo_s: "https://media.giphy.com/media/26tP7vexsaMrS4UpO/giphy.gif",
          "title_s": "Big Event",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 45.5597832,
          "lng_d": 25.9917114,
        }, {
          logo_s: "https://media.giphy.com/media/26tP7vexsaMrS4UpO/giphy.gif",
          "title_s": "Huge Big Ginormous Action",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 15.5597832,
          "lng_d": 13.9917114,
        }, {
          logo_s: "https://media.giphy.com/media/26tP7vexsaMrS4UpO/giphy.gif",
          "title_s": "Bigger Action",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 25.5597832,
          "lng_d": -33.9917114
        }, {
          logo_s: "https://media.giphy.com/media/26tP7vexsaMrS4UpO/giphy.gif",
          "title_s": "Big Action",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 55.5597832,
          "lng_d": -23.9917114
        }, ];
        $scope.actors = [{}, {
          "lat_d": 200.5597832,
          "lng_d": -200.9917114
        }, {
          "title_s": "Big Org",
          logo_s: "https://media.giphy.com/media/26tP7vexsaMrS4UpO/giphy.gif",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 45.5597832,
          "lng_d": -73.9917114
        }, {
          logo_s: "https://media.giphy.com/media/26tP7vexsaMrS4UpO/giphy.gif",
          "title_s": "Big Org",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 45.5597832,
          "lng_d": 25.9917114,
        }, {
          logo_s: "https://media.giphy.com/media/26tP7vexsaMrS4UpO/giphy.gif",
          "title_s": "Big Org",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 15.5597832,
          "lng_d": 13.9917114,
        }, {
          logo_s: "https://media.giphy.com/media/26tP7vexsaMrS4UpO/giphy.gif",
          "title_s": "Big Org",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 25.5597832,
          "lng_d": -33.9917114
        }, {
          logo_s: "https://media.giphy.com/media/26tP7vexsaMrS4UpO/giphy.gif",
          "title_s": "Big Org",
          "country_s": "ca",
          "address_s": "413 St.Jacques, Montreal, Canada",
          "phone_s": "123 123 1234",
          "description_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "descriptionNative_s": "Senator Patrick Brazeau is Recovering in hospital Following after- surgery found gravement He Was Injured In His home last night , selon Officials at a hospital in Gatineau , Que.\n\nPolice and paramedics called Expired Were to Brazeau 's home in Mayo , Que. , Northeast of Ottawa , just after- 10 pm ET on Monday, sources Told CBC News .",
          "notes_s": "test",
          "email_s": "randy.houlahan@cbd.int",
          "googleMaps_s": "https://www.google.fr/maps/place/Montr%C3%A9al,+QC,+Canada/@45.5597832,-73.9917114,10z/data=!4m2!3m1!1s0x4cc91a541c64b70d:0x654e3138211fefef",
          "facebook_s": "http://facebook.com/ddd_Ddd",
          "twitter_s": "http://twitter.com/_ddd_dddd",
          "youtube_s": "http://youtube.com/_ddd_dddd",
          "website_s": "http://youtube.com/_ddd_dddd",
          "startDate_s": '2016-01-205 05:00',
          "endDate_s": '2016-01-21 23:00',
          "lat_d": 55.5597832,
          "lng_d": -23.9917114
        }, ];
        $scope.champs = [{
          rank: 1,
          coordinates_s: {
            lat: 21.000000,
            lng: 78.000000
          },
        }, {
          name: 'India',
          rank: 1,
          date: "2012-10-16",
          imgURL: "https://www.cbd.int/images/flags/64/flag-in-64.png",
          link: "/actions/country/in",
          countryCode: "IN",
          aichiTargets: "All",
          coordinates_s: {
            lat: 21.000000,
            lng: 78.000000
          },
          directions: "https://www.google.ca/maps/place/India/@19.9647772,70.6990663,5z/data=!4m2!3m1!1s0x30635ff06b92b791:0xd78c4fa1854213a6",
          pledge: "<b>US$&nbsp;50 Million</b>for India and developing countries pledged by <b>Dr. Manmohan Singh</b>, <b>Prime Minister of India</b>, at the inauguration of the High-Level Segment of <a href=\"https://www.cbd.int/cop11/\">COP&nbsp;11</a><a  href=\"https://www.cbd.int/doc/speech/2012/sp-2012-10-16-cop11-hls-in-pm-en.pdf\">View the Prime Minister's speech</a>"
        }, {
          name: "FICCI",
          rank: 2,
          date: "2012-11-09",
          imgURL: "https://www.cbd.int/images/champions/ficci-64.jpg",
          link: "http://ficci.in",
          aichiTargets: "All",
          coordinates_s: {
            lat: 29,
            lng: 77
          },
          directions: "http://ficci.in/contact-us.asp",
          pledge: "<a href='http://www.ficci.com/'>FICCI</a> has Launched Campaign on Business to Pledge for Biodiversity. 21 companies have already join the Pledge and many more are expected to join. <a href='https://www.cbd.int/doc/champions/pledge-2012-10-22-ficci-en.pdf'>More</a>"
        }, {
          name: "Maldives",
          rank: 3,
          date: "2013-02-05",
          imgURL: "https://www.cbd.int/images/flags/64/flag-mv-64.png",
          link: "/actions/country/mv",
          aichiTargets: "4, 5, 6, 7, 11 and 15",
          coordinates_s: {
            lat: 4.1771005,
            lng: 73.5056351
          },
          directions: "https://www.google.ca/maps/place/Male,+Maldives/@4.1771005,73.5056351,16z/data=!3m1!4b1!4m2!3m1!1s0x3b3f7e5595f14b55:0x81b633ea397dba57",
          pledge: " The whole country of Maldives will be a <a href='https://www.cbd.int/doc/world/mv/mv-biosphere-reserve-en.pdf'>UNESCO Biosphere Reserve by 2017</a>  – where public support for conservation of the country's remarkable environment secures a vibrant green economy and good quality of life for ail Maldivians. <a href='/doc/champions/pledge-2013-02-05-mv-en.pdf' class='atc-link'>More</a>"
        }, {
          name: "Friends of Target 12",
          rank: 4,
          date: "2013-03-04 ",
          imgURL: "https://www.cbd.int/images/aichi/48/abt-12-48.png",
          link: "http://www.iucn.org/about/work/programmes/species/our_work/species_and_policy/friends_of_target_12/",
          aichiTargets: "12",
          coordinates_s: {
            lat: 50,
            lng: -18
          },
          pledge: "19 partners, including Governments and International Organizations, launched the \"Friends of Target 12\" initiative to support CBD Parties and others to achieve Aichi Target 12 by providing practical guidance and raising awareness of initiatives and programmes that contribute to the implementation of the activities needed to stem the tide of species’ extinctions. "
        }, {
          name: "Caribbean Challenge Initiative (CCI)",
          rank: 5,
          date: "2013-05-18",
          imgURL: "https://www.cbd.int/cooperation/cci/images/cci-64.png",
          aichiTargets: "11 and 12 (also 5, 6, 7, and 10)",
          link: "http://www.caribbeanchallengeinitiative.org/",
          coordinates_s: {
            lat: 12.0471534,
            lng: -61.7454654
          },
          directions: "https://www.google.ca/maps/place/Ministerial+Complex/@12.0471534,-61.7454654,17z/data=!4m6!1m3!3m2!1s0x8c38219c3ca4df17:0xa7f0c41080936281!2sMinisterial+Complex!3m1!1s0x8c38219c3ca4df17:0xa7f0c41080936281",
          pledge: "Nine participating countries and territories to the <a href='https://www.cbd.int/cooperation/cci/'>Caribbean Challenge Initiative</a> have committed to conserving at least 20% of their nearshore marine and coastal environments in national marine protected areas systems by 2020; and creating National Conservation Trust Funds, endowed by new sustainable finance mechanisms (such as tourism fees), dedicated to solely to funding park management. A recent Summit of political and business leaders (<a href='https://www.cbd.int/cooperation/cci/doc/cover-note-submit-summary-2013-07-02-en.pdf'>Cover note</a> and  <a href='https://www.cbd.int/cooperation/cci/doc/cci-outcomes-summary-2013-06-27-en.pdf'>Summary of CCI Summit</a>) assisted in galvanizing US $75 million in funding commitments to safeguard the marine and coastal environment along with commitments to take new marine conservation actions and to put in place more sustainable business practices. The <a href='http://www.cbd.int/island/glispa.shtml '>Global Island Partnership</a> has been recognized to play a crucial role in supporting regional challenges. 7 full CBD Parties (Bahamas, Dominican Republic, Grenada, Jamaica, St. Kitts & Nevis, St. Lucia, and St. Vincent and the Grenadines) plus the British Virgin Islands (UK overseas territory) and Puerto Rico (US territory) are currently participating in the CCI. <br> <br> More:  Leaders declarations ( <a href='https://www.cbd.int/cooperation/cci/doc/leaders-declaration-en.pdf'>English</a> | <a href='https://www.cbd.int/cooperation/cci/doc/leaders-declaration-es.pdf'>Spanish</a>);  <a href='https://www.cbd.int/cooperation/cci/doc/corporate-compact-2013-05-17-en.pdf'>Corporate Compact</a>;  <a href='https://www.cbd.int/cooperation/cci/doc/letter-grenada-en.pdf'>Letter from Grenada Government</a> "
        }, {
          name: "Bridging Agriculture and Conservation Initiative",
          rank: 6,
          date: "2013-08-01",
          imgURL: "https://www.cbd.int/images/champions/bioversity-international-64.png",
          link: "http://www.bioversityinternational.org/",
          aichiTargets: "All",
          coordinates_s: {
            lat: 41.878617,
            lng: 12.2350033
          },
          directions: "https://www.google.ca/maps/place/Viale+Tre+Denari,+467,+00054+Maccarese-Stazione+RM,+Italy/@41.878617,12.2350033,17z/data=!3m1!4b1!4m2!3m1!1s0x1325f8142c9250a3:0x7710156f660b26ca",
          pledge: "<a href='http://www.bioversityinternational.org/'>Bioversity International</a> is leading this multi-institutional initiative to alleviate poverty, conserve biodiversity, and promote food security within global agricultural systems. (<a href='https://www.cbd.int/doc/champions/champions-2013-bioversity-baci.pdf'>Background to preparatory meeting</a> and <a href='http://www.bioversityinternational.org/fileadmin/bioversityDocs/Announcements/Agriculture_Conservation_Final_Declaration_03.pdf'>declaration of global leaders</a>).  It addresses needs for more sustainable, socially equitable, resilient, nutritious and adaptable, as well as productive, food and farming systems. The initiative pledges to build, and leverage existing, science and sound economics to underpin critical advances and raise awareness. Since agriculture is the dominant use of land and water, and has a prominent role in sustainable development, the initiative promotes important solutions to help achieve multiple Aichi Biodiversity Targets. <p><a href='https://www.cbd.int/doc/champions/champions-2013-bioversity-letter.pdf' class='atc-link'>2013 - Letter from Bioversity International Director General</a><br><a href='https://www.cbd.int/doc/champions/champions-2013-bioversity-baci.pdf' class='atc-link'>2013 - The Bridging Agriculture and Conservation Initiative (BACI)</a><br><a href='https://www.cbd.int/doc/champions/champions-2014-bioversity-letter.pdf' class='atc-link'>2014 - Letter from Bioversity International Director General</a><br><a href='https://www.cbd.int/doc/champions/champions-2014-bioversity-baci.pdf' class='atc-link'>2014 - Brief update on the status of Bioversity's BACI pledge</a> "
        }, {
          name: "Gaborone Declaration initiative",
          rank: 7,
          date: "2013-09-03",
          imgURL: "https://www.cbd.int/images/champions/bc-medal-64.png",
          link: "http://www.gaboronedeclaration.com/",
          aichiTargets: " 1, 2, 3, 4, 5, 7, 9, 12, 14, 15, 17 and 19 ",
          coordinates_s: {
            lat: -24.6090728,
            lng: 25.8604649
          },
          directions: "https://www.google.ca/maps/place/Gaborone,+Botswana/@-24.6090728,25.8604649,12z/data=!4m2!3m1!1s0x1ebb5b3c2ceea9bf:0x49a1769397ae11a1",
          pledge: "The Gaborone Declaration on Sustainability in Africa, which has been signed by 10 African States and 19 non-state institutions, is an important vehicle for implementation of sustainability in Africa. Botswana pledges its implementation of its commitments under the Gaborone Declaration on Sustainability in Africa, towards meeting the Aichi Biodiversity Targets. <a href='https://www.cbd.int/doc/champions/gaborone-declaration-botswana-en.pdf'>The Gaborone Declaration</a> and <a href='https://www.cbd.int//doc/champions/letter-from-botswana-en.pdf'>Letter from the Botswana Government</a>. "
        }, {
          name: "Natural Capital Declaration (NCD)",
          rank: 8,
          date: "2013-10-10",
          imgURL: "https://www.cbd.int/images/champions/ncd-64.jpg",
          link: "http://www.naturalcapitaldeclaration.org",
          aichiTargets: "2",
          coordinates_s: {
            lat: 51.75248,
            lng: -1.268347
          },
          directions: "https://www.google.com/maps?ll=51.75248,-1.268347&z=16&t=m&hl=en-US&gl=GB&mapclient=embed&cid=1303267332516840483",
          pledge: "The <a href='http://www.naturalcapitaldeclaration.org/'>Natural Capital Declaration (NCD)</a> is a finance-led and CEO-endorsed initiative to integrate natural capital considerations into financial products and services, and to work towards their inclusion in financial accounting, disclosure and reporting. <a href='http://www.naturalcapitaldeclaration.org/resources/' class='atc-link'>More</a>"
        }, {
          name: "World Public Health Nutrition Association (WPHNA)",
          rank: 9,
          date: "2013-11-14",
          imgURL: "https://www.cbd.int/images/champions/wphna-64.jpg",
          link: "http://wphna.org/",
          aichiTargets: "1, 4, 12, 13,14, 18, 19",
          coordinates_s: {
            lat: 51.5226761,
            lng: -0.1172697
          },
          directions: "https://www.google.com/maps?ll=51.522676,-0.115081&z=15&t=m&hl=en-US&gl=NO&mapclient=embed&q=Charles+Darwin+House,+12+Roger+St+London+WC1N+2JU+UK",
          pledge: "The <a href='http://wphna.org/'>WPHNA</a> will bring to the attention of its membership the relationship between nutrition and biodiversity, thereby advancing the CBD’s cross-cutting initiative on biodiversity for food and nutrition, the sustainable diets initiative, and contributing to the achievement of the Aichi Biodiversity Targets. <a href='https://www.cbd.int/doc/champions/pledge-form-2013-11-14-WPHNA-en.pdf' class='atc-link'>More</a>. "
        }, {
          name: "The India Business & Biodiversity Initiative (IBBI)",
          rank: 10,
          date: "2014-01-31",
          imgURL: "https://www.cbd.int/images/champions/cii-itc.jpg",
          link: "http://www.sustainabledevelopment.in/",
          aichiTargets: "1 to 16",
          coordinates_s: {
            lat: 28.6245915,
            lng: 77.2180992
          },
          directions: "https://www.google.ca/maps/place/CII-ITC+Centre+of+Excellence+for+Sustainable+Development/@28.6243935,77.218128,14.98z/data=!4m2!3m1!1s0x0:0x1a570d2cd28d701d",
          pledge: "The <a href='http://www.cii.in'>Confederation of Indian Industry (CII)</a> is hosting the India Business & Biodiversity Initiative (IBBI) that is a national platform for business and its stakeholders for dialogue, sharing and learning on biodiversity management. Being a business-led multi-stakeholder initiative, the aim of IBBI is to mainstream sustainable management of biological diversity into business.  <a href='https://www.cbd.int/doc/champions/pledge-2014-01-31-cii-en.pdf' class='atc-link'>More</a>"
        }];
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
            "expired_b": ['false'],
          },
          'actors': {
            'schema_s': ['undbPartner'],
            '_state_s': ['public']
          },
          'caseStudies': {
            'schema_s': [
              'caseStudy'
            ]
          },
          'actions': {
            'schema_s': ['undbAction'],
            '_state_s': ['public']
          },
          'bioChmaps': {
            'schema_s': [
              'bioChamps'
            ],
          },
        };


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


            if ($scope.selectedSchema === 'parties') {
              //$scope.selectedSchema = 'parties';
              filterActive('parties');
              $scope.documents = groupByCountry($scope.countries, 1);
              updateQueryString();
              return;
            }
            if ($scope.selectedSchema === 'bioChamps') {
              filterActive('bioChamps');
              $scope.documents = _.clone($scope.champs);
              addSubQuery(_.cloneDeep($scope.urlStrings.actors), 'bioChamps');
              return;
            }
            if ($scope.selectedSchema === 'actors') {
              filterActive('actors');
              $scope.documents = _.clone($scope.actors);
              addSubQuery(_.cloneDeep($scope.urlStrings.actors), 'actors');
              return;
            }
            if ($scope.selectedSchema === 'actions') {
              filterActive('actions');
              $scope.documents = _.clone($scope.actions);
              addSubQuery(_.cloneDeep($scope.urlStrings.actors), 'actions');
              return;
            }


          } // query

          //=======================================================================
          //
          //=======================================================================
          function groupByCountry(list, countries) {
            var docsByCountry = {};
            $scope.euData = {};
            if (!$scope.countries) return '';
            if (countries) {
              _.each($scope.countries, function(doc) {
                if (!docsByCountry[doc.code]) // if country object not created created
                {
                  docsByCountry[doc.code] = [];
                  docsByCountry[doc.code] = getCountryById(doc.code); //insert country data
                  docsByCountry[doc.code].docs = {}; // initializes the countries docs
                }
              });
            } //if not list

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
            $scope.toggleCaption = true;
            _.each($scope.filters, function(filter) {
              filter.active = false;
            });
            if (activeFilter)
              $scope.filters[activeFilter].active = true;
            $(document).find(".mapPopup").show();
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


          this.filterActive = filterActive;
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