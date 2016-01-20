define(['text!./ammap3.html', 'app', 'lodash', 'text!./pin-popup-projects.html', 'text!./pin-popup-title-projects.html', 'text!./pin-popup-bio-champs.html', 'text!./pin-popup-title-bio-champs.html', 'text!./pin-popup-actions.html', 'text!./pin-popup-title-actions.html',
    'ammap',
    'ammap/plugins/export/libs/FileSaver.js/FileSaver.min',
    'ammap/plugins/export/libs/jszip/jszip.min',
    'shim!./worldEUHigh[ammap]',
    'shim!ammap/themes/light[ammap]',
    'shim!ammap/plugins/export/export.min[ammap]',
    'shim!ammap/plugins/export/libs/fabric.js/fabric.min[ammap]',
    'shim!ammap/plugins/export/libs/pdfmake/pdfmake.min[ammap]',
    'shim!ammap/plugins/export/libs/pdfmake/vfs_fonts[ammap]',
    'shim!ammap/plugins/export/libs/xlsx/xlsx.min[ammap]',
    'css!ammap/plugins/export/export.css',
    'css!./mappin.css',
], function(template, app, _, popoverTemplateProjects, popoverTitleProjects, popoverTemplateBioChamps, popoverTitleBioChamps, popoverTemplateActions, popoverTitleActions) {
  'use strict';

  app.directive('ammap3', ['$timeout', 'locale', '$http', function($timeout, locale, $http) {
    return {
      restrict: 'EAC',
      template: template,
      replace: true,
      require: ['^ammap3'],
      scope: {
        items: '=ngModel',
        schema: '=schema',
        debug: '=debug',
        //      pins: '=pins'
      },
      link: function($scope, $element, $attr, requiredDirectives) {


        var ammap3 = requiredDirectives[0];

        $scope.leggends = {

          parties: [{
            id: 5,
            title: 'CBD',
            visible: true,
            color: '#ADD7F6'
          }, {
            id: 4,
            title: 'CBD & CPB',
            visible: true,
            color: '#87BFFF'
          }, {
            id: 3,
            title: 'CBD & CPB & ABS',
            visible: true,
            color: '#3F8EFC'
          }, {
            id: 2,
            title: 'CBD & ABS',
            visible: true,
            color: '#2667FF'
          }, {
            id: 0,
            title: 'Not a Party',
            visible: true,
            color: '#dddddd'
          }, ],
          nationalReport: [

            {
              id: 0,
              title: 'Not Reported',
              visible: true,
              color: '#dddddd'
            }, {
              id: 1,
              title: 'Reported',
              visible: true,
              color: '#428bca'
            },

          ],
          default: [{
            id: 0,
            title: 'Not Reported',
            visible: true,
            color: '#dddddd'
          }, {
            id: 1,
            title: 'Reported',
            visible: true,
            color: '#428bca'
          }, ],
        };
        //generates new map with new data

        $scope.$watch('items', function() {

          $scope.map.dataProvider.images = _.clone($scope.images);
          ammap3.generateMap($scope.schema);
        });

        initMap();

        ammap3.writeMap();

        $http.get('/api/v2015/countries', {
          cache: true,
        }).then(function(res) {

          res.data.forEach(function(c) {
            c.name = c.name[locale];
          });
          $scope.countries = res.data;
        });




          $scope.map.addListener("click", function(event) {
            ammap3.closePopovers();
            var info = event.chart.getDevInfo();
            $timeout(function() {
              $("#mapdiv").find("#pin").popover('hide');
              if ($scope.debug)
                  console.log({
                    "latitude": info.latitude,
                    "longitude": info.longitude,
                    "all": info,
                  });
            });
          });


        $scope.images = [{
          "label": "EU",
          "latitude": -5.02,
          "longitude": -167.66
        }];
        //=======================================================================
        //
        //=======================================================================
        function initMap() {
          $scope.mapData = {
            "type": "map",
            "theme": "light",
            "responsive": {
              "enabled": true
            },

            "dataProvider": {
              "map": "worldEUHigh",
              "getAreasFromMap": true,

            },

            "areasSettings": {
              "autoZoom": true,
              "selectedColor": "#000000",
              "rollOverColor": "#423f3f",
              "selectable": true,
              "color": "#428bca",
            },
            "smallMap": {

              "rectangleColor": '#069554',
              "backgroundAlpha": 0.5,
              "mapColor": '#069554',

            },
            "zoomControl": {
              "left": 28,
            },
            "export": {
              "libs": {
                "autoLoad": false
              },
              "enabled": true,
              "position": "bottom-right"
            },


          }; //
          $scope.mapData.images = _.clone($scope.images);
        } //$scope.initMap
        //not working


      }, //link
      //////controller
      controller: ["$scope", function($scope) {

        function closePopovers(pin) {
          // get map object
          var map = $scope.map;

          // go through all of the images
          for (var x in map.dataProvider.images) {
            if (x !== $(pin).data('i'))
              $($scope.map.dataProvider.images[x].externalElement).children('#pin').popover('hide');
          }

        }
        // this function will take current images on the map and create HTML elements for them
        function updateCustomMarkers() {

          // get map object
          if ($scope.schema == 'parties') return;
          var map = $scope.map;
          var tempImage = new Image();
          // go through all of the images
          for (var x in map.dataProvider.images) {
            // get MapImage object
            tempImage = new Image();
            if (map.dataProvider.images[x].logo_s)
              tempImage.src = map.dataProvider.images[x].logo_s;
            if (map.dataProvider.images[x].imgURL)
              tempImage.src = map.dataProvider.images[x].imgURL;
            var image = map.dataProvider.images[x];

            if (map.dataProvider.images[x].label && map.dataProvider.images[x].label === 'EU') continue;
            // check if it has corresponding HTML element
            if ('undefined' == typeof image.externalElement) {
              image.externalElement = generateMarker(x);
            }

            if ('undefined' !== typeof image.externalElement) {
              // reposition the element accoridng to coordinates
              image.externalElement.style.top = map.latitudeToY(image.latitude) + 'px';
              image.externalElement.style.left = map.longitudeToX(image.longitude) + 'px';
            }


          }
          $scope.map.addListener("positionChanged", updateCustomMarkers);
          $scope.map.addListener("clickMapObject", function(event) {



            var id = event.mapObject.id;
            if (event.mapObject.id === 'GL') {
              $scope.map.clickMapObject(getMapObject('DK'));
              id = 'DK';
            }
          });
        }

        // this function creates and returns a new marker element
        function generateMarker(imageIndex) {

          if ($scope.schema === 'actions')
            return makeMarker(imageIndex, 'pin-cbd', 'pulse-cbd', 'app/img/cbd-leaf-green.svg');
          if ($scope.schema === 'actors')
            return makeMarker(imageIndex, 'pin-actor', 'pulse-actor', 'app/img/ic_nature_people_black_24px.svg');
          if ($scope.schema === 'bioChamps')
            return makeMarker(imageIndex, 'pin-actor', 'pulse-actor', 'app/img/ic_verified_user_black_24px.svg');
          if ($scope.schema === 'caseStudies')
            return makeMarker(imageIndex, 'pin-actor', 'pulse-actor', 'app/img/ic_school_black_24px.svg');
          if ($scope.schema === 'projects')
            return makeMarker(imageIndex, 'pin-actor', 'pulse-actor', 'app/img/ic_art_track_black_24px.svg');
        }
        // this function creates and returns a new marker element
        function makeMarker(imageIndex, pinClass, pulseClass, imagePath) {

          var holder = document.createElement('div');
          holder.className = 'map-marker';
          holder.style.position = 'absolute';


          //create pin
          var pin = document.createElement('div');

          pin.id = 'pin';
          pin.className = 'pin ' + pinClass;
          $(pin).data('i', imageIndex);
          $(pin).data('toggle', 'popover');

          $(pin).popover(generatePopover(imageIndex));
          pin.addEventListener('click', function(event) {
            $(document).find(".mapPopup").hide();
            if ($(pin).data('bs.popover').tip().hasClass('in')) {

              if ($scope.map.dataProvider.images[imageIndex].latitude > 25)
                $scope.map.dataProvider.images[imageIndex].zoomLatitude = $scope.map.dataProvider.images[imageIndex].latitude + 10;

              if ($scope.map.dataProvider.images[imageIndex].latitude <= 25)
                $scope.map.dataProvider.images[imageIndex].zoomLatitude = $scope.map.dataProvider.images[imageIndex].latitude + 20;

              $scope.map.dataProvider.images[imageIndex].zoomLongitude = $scope.map.dataProvider.images[imageIndex].longitude;
              $scope.map.clickMapObject($scope.map.dataProvider.images[imageIndex]);
            }

          }, false);
          holder.appendChild(pin);

          // // create pulse
          var pulse = document.createElement('div');
          pulse.className = pulseClass;
          holder.appendChild(pulse);

          // create pulse
          var img = document.createElement('img');
          img.setAttribute('src', imagePath);
          img.setAttribute('height', '23.21px');
          img.setAttribute('width', '25.06px');
          img.className = 'leaf-image';
          pin.appendChild(img);

          // append the marker to the map container
          $scope.map.dataProvider.images[imageIndex].chart.chartDiv.appendChild(holder);

          return holder;
        }
        //=======================================================================
        //
        //=======================================================================
        function generatePopover(imageIndex) {
          var image = $scope.map.dataProvider.images[imageIndex];
          var popoverTitleParsed = '';
          var popoverTemplateParsed = '';


          switch ($scope.schema) {
            case 'projects':
              popoverTitleParsed = _.clone(popoverTitleProjects);
              popoverTemplateParsed = _.clone(popoverTemplateProjects);
              popoverTitleParsed = popoverTitleParsed.replace('{{schema}}', image.schema);
              popoverTemplateParsed = popoverTemplateParsed.replace('{{projectImage}}', image.thumbnail_s);
              popoverTemplateParsed = popoverTemplateParsed.replace('{{projectTitle}}', image.title);
              if (image.url_ss)
                popoverTemplateParsed = popoverTemplateParsed.replace('{{recordURL}}', image.url_ss);
              return {
                html: true,
                trigger: 'click',
                placement: 'top',
                title: popoverTitleParsed,
                template: popoverTemplateParsed
              };
            case 'bioChamps':
              popoverTitleParsed = _.clone(popoverTitleBioChamps);
              popoverTemplateParsed = _.clone(popoverTemplateBioChamps);

              popoverTitleParsed = popoverTitleParsed.replace('{{rank}}', image.rank ? image.rank : ' ');
              popoverTitleParsed = popoverTitleParsed.replace('{{date}}', image.date ? image.date : ' ');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{image}}', image.imgURL ? image.imgURL : '#');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{link}}', image.link ? image.link : '#');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{title}}', image.title ? image.title : ' ');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{directions}}', image.directions ? image.directions : ' ');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{pledge}}', image.pledge ? image.pledge : ' ');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{aichiTargets}}', image.aichiTargets ? image.aichiTargets : ' ');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{directions}}', image.directions ? image.directions : '#');
              return {
                html: true,
                trigger: 'click',
                placement: 'top',
                title: popoverTitleParsed,
                template: popoverTemplateParsed
              };
            case 'actions':
              popoverTitleParsed = _.clone(popoverTitleActions);
              popoverTemplateParsed = _.clone(popoverTemplateActions);

              popoverTitleParsed = popoverTitleParsed.replace('{{title}}', image.title ? image.title : ' ');
              if (image.startDate_s) image.startDate_s = '<b>Start Date:</b> ' + image.startDate_s + '<br>';
              popoverTitleParsed = popoverTitleParsed.replace('{{startDate_s}}', image.startDate_s ? image.startDate_s : ' ');
              if (image.endDate_s) image.endDate_s = '<b>End Date:</b> ' + image.endDate_s;
              popoverTitleParsed = popoverTitleParsed.replace('{{endDate_s}}', image.endDate_s ? image.endDate_s : ' ');


              popoverTemplateParsed = popoverTemplateParsed.replace('{{countryCode}}', image.countryCode ? image.countryCode : ' ');
              if (image.countryCode) image.countryName = _.findWhere($scope.countries, {
                code: image.countryCode.toUpperCase()
              }).name;
              popoverTemplateParsed = popoverTemplateParsed.replace('{{countryName}}', image.countryName ? image.countryName : ' ');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{description_s}}', image.description_s ? image.description_s : ' ');
              if (image.descriptionNative_s) image.descriptionNative_s = image.descriptionNative_s + '<br>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{descriptionNative_s}}', image.descriptionNative_s ? image.descriptionNative_s : ' ');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{logo_s}}', image.logo_s ? image.logo_s : '/app/img/ic_recent_actors_black_48px.svg');
              if (image.facebook_s) image.facebook_s = '<a href="' + image.facebook_s + '" target="_blank"><i class="fa fa-facebook-square fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{facebook_s}}', image.facebook_s ? image.facebook_s : ' ');
              if (image.twitter_s) image.twitter_s = '<a href="' + image.twitter_s + '" target="_blank"><i class="fa fa-twitter-square fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{twitter_s}}', image.twitter_s ? image.twitter_s : ' ');
              if (image.youtube_s) image.youtube_s = '<a href="' + image.youtube_s + '" target="_blank"><i class="fa fa-youtube-square fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{youtube_s}}', image.youtube_s ? image.youtube_s : ' ');
              if (image.website_s) image.website_s = '<a href="' + image.website_s + '" target="_blank"><i class="fa fa-external-link-square fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{website_s}}', image.website_s ? image.website_s : ' ');
              if (image.email_s) image.email_s = '<b>Email:</b> <a mailto="' + image.email_s + '">' + image.email_s + '</a><br>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{email_s}}', image.email_s ? image.email_s : ' ');
              if (image.address_s && image.directions)
                image.address_s = '<b>Address:</b> <a href="' + image.directions + '" target="_blank">' + image.address_s + '</a><br>';
              else if (image.address_s)
                image.address_s = '<b>Address:</b> ' + image.address_s + '<br>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{address_s}}', image.address_s ? image.address_s : ' ');
              if (image.phone_s) image.phone_s = '<b>Phone:</b>' + image.phone_s + '<br>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{phone_s}}', image.phone_s ? image.phone_s : ' ');
              if (image.directions) image.directions = '<a href="' + image.directions + '" target="_blank"><i class="fa fa-map-signs fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{directions_s}}', image.directions ? image.directions : ' ');
              return {
                html: true,
                trigger: 'click',
                placement: 'top',
                title: popoverTitleParsed,
                template: popoverTemplateParsed
              };

            case 'actors':
              popoverTitleParsed = _.clone(popoverTitleActions);
              popoverTemplateParsed = _.clone(popoverTemplateActions);

              popoverTitleParsed = popoverTitleParsed.replace('{{title}}', image.title ? image.title : ' ');
              if (image.startDate_s) image.startDate_s = 'Start Date: ' + image.startDate_s;
              popoverTitleParsed = popoverTitleParsed.replace('{{startDate_s}}', image.startDate_s ? image.startDate_s : ' ');
              if (image.endDate_s) image.endDate_s = 'End Date: ' + image.endDate_s;
              popoverTitleParsed = popoverTitleParsed.replace('{{endDate_s}}', image.endDate_s ? image.endDate_s : ' ');

              popoverTemplateParsed = popoverTemplateParsed.replace('{{countryCode}}', image.countryCode ? image.countryCode : ' ');

              if (image.countryCode) image.countryName = _.findWhere($scope.countries, {
                code: image.countryCode.toUpperCase()
              }).name;
              popoverTemplateParsed = popoverTemplateParsed.replace('{{countryName}}', image.countryName ? image.countryName : ' ');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{description_s}}', image.description_s ? image.description_s : ' ');
              if (image.descriptionNative_s) image.descriptionNative_s = image.descriptionNative_s + '<br>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{descriptionNative_s}}', image.descriptionNative_s ? image.descriptionNative_s : ' ');
              popoverTemplateParsed = popoverTemplateParsed.replace('{{logo_s}}', image.logo_s ? image.logo_s : '/app/img/ic_recent_actors_black_48px.svg');
              if (image.facebook_s) image.facebook_s = '<a href="' + image.facebook_s + '" target="_blank"><i class="fa fa-facebook-square fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{facebook_s}}', image.facebook_s ? image.facebook_s : ' ');
              if (image.twitter_s) image.twitter_s = '<a href="' + image.twitter_s + '" target="_blank"><i class="fa fa-twitter-square fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{twitter_s}}', image.twitter_s ? image.twitter_s : ' ');
              if (image.youtube_s) image.youtube_s = '<a href="' + image.youtube_s + '" target="_blank"><i class="fa fa-youtube-square fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{youtube_s}}', image.youtube_s ? image.youtube_s : ' ');
              if (image.website_s) image.website_s = '<a href="' + image.website_s + '" target="_blank"><i class="fa fa-external-link-square fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{website_s}}', image.website_s ? image.website_s : ' ');
              if (image.email_s) image.email_s = '<b>Email:</b> <a mailto="' + image.email_s + '">' + image.email_s + '</a><br>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{email_s}}', image.email_s ? image.email_s : ' ');
              if (image.address_s && image.directions)
                image.address_s = '<b>Address:</b> <a href="' + image.directions + '" target="_blank">' + image.address_s + '</a><br>';
              else if (image.address_s)
                image.address_s = '<b>Address:</b> ' + image.address_s + '<br>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{address_s}}', image.address_s ? image.address_s : ' ');
              if (image.phone_s) image.phone_s = '<b>Phone:</b>' + image.phone_s + '<br>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{phone_s}}', image.phone_s ? image.phone_s : ' ');
              if (image.directions) image.directions = '<a href="' + image.directions + '" target="_blank"><i class="fa fa-map-signs fa-2x"></i></a>';
              popoverTemplateParsed = popoverTemplateParsed.replace('{{directions_s}}', image.directions ? image.directions : ' ');
              return {
                html: true,
                trigger: 'click',
                placement: 'top',
                title: popoverTitleParsed,
                template: popoverTemplateParsed
              };

          } // switch
        } //$scope.legendHide


        //=======================================================================
        //
        //=======================================================================
        function generateMap(schema) {


          if (!schema) return;
          if (schema === 'parties')
            progressColorMap(partiesMap);
          else
            pinMap(defaultPinMap);
        } //$scope.legendHide

        //=======================================================================
        //
        //=======================================================================
        function restLegend(legend) {

          _.each(legend, function(legendItem) {
            legendItem.visible = true;
          });
        } //$scope.legendHide

        //=======================================================================
        //
        //=======================================================================
        $scope.legendHide = function(legendItem) {
          var area2 = {};


          _.each($scope.map.dataProvider.areas, function(area) {

            if (legendItem.color === area.originalColor && area.mouseEnabled === true && 'GL' !== area.id) {
              area.colorReal = '#FFFFFF';
              area.mouseEnabled = false;

            } else if (legendItem.color === area.originalColor && area.mouseEnabled === false && 'GL' !== area.id) {
              area.colorReal = legendItem.color;
              area.mouseEnabled = true;

            }
            if (area.id.toUpperCase() === 'DK') {
              area2 = getMapObject('GL');
              //area2.originalColor = area.originalColor;
              area2.colorReal = area.colorReal;
              area2.mouseEnabled = area.mouseEnabled;
            }
          });
          if (legendItem.visible)
            legendItem.visible = false;
          else
            legendItem.visible = true;
          $scope.map.validateData();
        }; //$scope.legendHide

        //=======================================================================
        //
        //=======================================================================
        function toggleLegend(legend, color) { //jshint ignore:line

          var index = _.findIndex(legend, function(legendItem) {
            return legendItem.color == 'color';
          });
          legend[index].visible = false;
        } //toggleLeggend

        //=======================================================================
        //
        //=======================================================================
        function writeMap(mapData) {

          if (!mapData) mapData = getMapData();
          $scope.map = AmCharts.makeChart("mapdiv", mapData); //jshint ignore:line
          $scope.map.write("mapdiv");

        } // writeMap

        //=======================================================================
        //
        //=======================================================================
        function progressColorMap(mapTypeFunction) {

          hideAreas();
          $scope.legendTitle = ""; // rest legend title
          buildProgressBaloonParties({
            'code': 'GL'
          });
          _.each($scope.items, function(country) {

            if (!_.isEmpty(country.docs))
              _.each(country.docs, function(schema) {
                if (mapTypeFunction) mapTypeFunction(country, schema, $scope.schema);
              });
            else mapTypeFunction(country);
          });
          $scope.map.validateData(); // updates map with color changes
        } //progressColorMap

        //=======================================================================
        //
        //=======================================================================
        function pinMap(mapTypeFunction) {

          $scope.legendTitle = ""; // rest legend title

          _.each($scope.items, function(item) {
            mapTypeFunction(item);
          });
          $scope.map.validateData(); // updates map with color changes

          updateCustomMarkers();

        } //progressColorMap

        //=======================================================================
        //
        //=======================================================================
        function partiesMap(country) {
          genTreatyCombinations();

          changeAreaColor(country.code, getPartyColor(country));
          buildProgressBaloonParties(country);

          legendTitle($scope.schema);

        } // aichiMap
        //=======================================================================
        //
        //=======================================================================
        function defaultPinMap(item) {


          if (itemToImagePin(item))
            $scope.map.dataProvider.images.push(itemToImagePin(item));

        } // aichiMap
        //=======================================================================
        //
        //=======================================================================
        function itemToImagePin(item) {

          if (item.coordinates_s && !_.isObject(item.coordinates_s))
            item.coordinates_s = JSON.parse(item.coordinates_s);

          if (($scope.schema == 'projects' || $scope.schema == 'bioChamps') && (!item.coordinates_s || !item.coordinates_s.lat || !item.coordinates_s.lng))
            return 0;
          else {
            if (($scope.schema == 'actors' || $scope.schema == 'actions') && (!item.lat_d || !item.lng_d)) return 0;
            switch ($scope.schema) {
              case 'projects':
                return {
                  zoomLevel: 5,
                  scale: 0.5,
                  title: item.title_s,
                  latitude: item.coordinates_s.lat,
                  longitude: item.coordinates_s.lng,
                  thumbnail_s: item.thumbnail_s,
                  schema: item.schema_EN_t,
                  url_ss: item.url_ss[0]
                };
              case 'bioChamps':
                return {
                  zoomLevel: 5,
                  scale: 0.5,
                  date: item.date,
                  rank: item.rank,
                  title: item.name,
                  pledge: item.pledge,
                  aichiTargets: item.aichiTargets,
                  directions: item.directions,
                  latitude: _.clone(item.coordinates_s.lat),
                  longitude: _.clone(item.coordinates_s.lng),
                  imgURL: item.imgURL,
                  schema: _.clone($scope.schema),
                  link: item.link

                };
              case 'actions':
                return {
                  zoomLevel: 5,
                  scale: 0.5,
                  startDate_s: item.startDate_s,
                  logo_s: item.logo_s,
                  facebook_s: item.facebook_s,
                  twitter_s: item.twitter_s,
                  youtube_s: item.youtube_s,
                  website_s: item.website_s,
                  endDate_s: item.endDate_s,
                  email_s: item.email_s,
                  address_s: item.address_s,
                  phone_s: item.phone_s,
                  countryCode: item.country_s,
                  description_s: item.description_s,
                  descriptionNative_s: item.descriptionNative_s,
                  title: item.title_s,
                  directions: item.googleMaps_s,
                  latitude: _.clone(item.lat_d),
                  longitude: _.clone(item.lng_d),
                  coordinates_s: {
                    lat: _.clone(item.lat_d),
                    lng: _.clone(item.lat_d)
                  },
                  schema: _.clone($scope.schema),
                };
              case 'actors':
                return {
                  zoomLevel: 5,
                  scale: 0.5,
                  logo_s: item.logo_s,
                  facebook_s: item.facebook_s,
                  twitter_s: item.twitter_s,
                  youtube_s: item.youtube_s,
                  website_s: item.website_s,
                  email_s: item.email_s,
                  address_s: item.address_s,
                  phone_s: item.phone_s,
                  countryCode: item.country_s,
                  description_s: item.description_s,
                  descriptionNative_s: item.descriptionNative_s,
                  title: item.title_s,
                  directions: item.googleMaps_s,
                  latitude: _.clone(item.lat_d),
                  longitude: _.clone(item.lng_d),
                  coordinates_s: {
                    lat: _.clone(item.lat_d),
                    lng: _.clone(item.lat_d)
                  },
                  schema: _.clone($scope.schema),
                };
            }

          }


        } // aichiMap
        //=======================================================================
        //
        //=======================================================================
        function getPartyColor(country) {

          switch (country.treatyComb) {
            case 'CBD,':
              return '#ADD7F6';
            case 'CBD,CPB,':
              return '#87BFFF';
            case 'CBD,CPB,ABS,':
              return '#3F8EFC';
            case 'CBD,ABS,':
              return '#2667FF';
            default:
              return '#dddddd';
          }
        } //getPartyColor

        //=======================================================================
        //
        //=======================================================================
        function legendTitle(schemaName) {

          if (schemaName == 'parties') {
            $scope.legendTitle = 'Parties and their Treaties';

          } else if (schemaName == 'nationalIndicator') {
            $scope.legendTitle = 'National Indicators';

          } else if (schemaName == 'nationalTarget') {
            $scope.legendTitle = 'National Targets';

          } else if (schemaName == 'resourceMobilisation') {
            $scope.legendTitle = 'Resource Mobilisation';
          } else if (schemaName == 'all') {
            $scope.legendTitle = 'All Reporting';
          }
        } //legendTitle

        // //=======================================================================
        // //
        // //=======================================================================
        function changeAreaColor(id, color, area) {
          if (!area)
            area = getMapObject(id);
          area.colorReal = area.originalColor = color;

          if (id === 'DK') {
            var area2 = getMapObject('GL');
            area2.colorReal = area.colorReal;
            area2.originalColor = area.originalColor;
          }

        } //getMapObject



        // //=======================================================================
        // // c
        // //=======================================================================
        function buildProgressBaloonParties(country) {

          var area = getMapObject(country.code);
          area.balloonText = "<i class='flag-icon flag-icon-" + String(country.code).toLowerCase() + " ng-if='country.isEUR'></i>&nbsp;";
          var euImg = "<img src='/app/img/Flag_of_Europe.svg' style='width:25px;hight:21px;padding-left:0px;margin-left:0px;' ng-if='country.isEUR'></img>&nbsp;";
          var balloonText2 = area.title + "";
          if (country.isEUR)
            area.balloonText += euImg;
          area.balloonText += balloonText2;
        } //buildProgressBaloon

        // //=======================================================================
        // // c
        // //=======================================================================
        function buildBaloon(country) {

          var area = getMapObject(country.identifier);
          area.balloonText = "<div class='panel panel-default' ><div class='panel-heading' style='font-weight:bold; font-size:large;''>";
          var euImg = "<img src='app/images/flags/Flag_of_Europe.svg' style='width:25px;hight:21px;' ng-if='country.isEUR'></img>";
          if (country.isEUR)
            area.balloonText += euImg + area.title + "</div>";
          else
            area.balloonText += "<i class='flag-icon flag-icon-" + country.identifier + " ng-if='country.isEUR'></i>&nbsp;" + area.title + "</div>";
          var balloonBody = '';


          if (Object.keys(country.docs).length == 1) {

            _.each(country.docs, function(schema, schemaName) {

              switch (schemaName) {
                case 'nationalReport':
                  if ($scope.schema !== 'all')
                    balloonBody = " <div class='panel-body' style='text-align:left;'>" + country.docs.nationalReport[0].reportType_EN_t + "</div>";
                  break;
              }
            }); //_.each
          }
          area.balloonText += balloonBody;
        } //getMapObject

        // =======================================================================
        //
        // =======================================================================
        function genTreatyCombinations() {
          $scope.treatyCombinations = {};
          $scope.treaties = ['XXVII8', 'XXVII8a', 'XXVII8b', 'XXVII8c'];
          _.each($scope.items, function(country, code) {
            if (country.treaties.XXVII8.party) country.treatyComb = 'CBD,';
            if (country.treaties.XXVII8a.party) country.treatyComb += 'CPB,';
            if (country.treaties.XXVII8b.party) country.treatyComb += 'ABS,';
            if (country.treaties.XXVII8c.party) country.treatyComb += 'NKLP';
            if (!country.treatyComb) country.treatyComb = 'NP';
            if (!$scope.treatyCombinations[country.treatyComb])
              $scope.treatyCombinations[country.treatyComb] = 1;
            else
              $scope.treatyCombinations[country.treatyComb]++;
          });
        } //readQueryString


        //=======================================================================
        //
        //=======================================================================
        function getMapData() {

          return $scope.mapData;
        }

        // //=======================================================================
        // // changes color of all un colored areas
        // //=======================================================================
        function hideAreas(color) {
          // Walkthrough areas
          if (!color) color = '#dddddd';
          _.each($scope.map.dataProvider.areas, function(area) {
            if (area.id !== 'divider1') {
              area.colorReal = area.originalColor = color;
              area.mouseEnabled = true;
              area.balloonText = '[[title]]';
            }
          });
        } //hideAreas(color)

        // //=======================================================================
        // //
        // //=======================================================================
        function getMapObject(id) {

          var index = _.findIndex($scope.map.dataProvider.areas, function(area) {
            return area.id === id;
          });
          return $scope.map.dataProvider.areas[index];
        } //getMapObject

        this.closePopovers = closePopovers;
        this.getMapObject = getMapObject;
        this.getMapObject = getMapObject;
        this.writeMap = writeMap;
        this.getMapData = getMapData;
        this.generatePopover = generatePopover;
        this.generateMap = generateMap;
        this.progressColorMap = progressColorMap;
      }],
    }; // return
  }]); //app.directive('searchFilterCountries
}); // define
