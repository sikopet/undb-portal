define(['text!./ammap3.html', 'app', 'lodash', 'text!./pin-popup.html', 'text!./pin-popup-title.html', 'ammap3', 'ammap3WorldHigh', 'ammap-theme', 'ammap-export', 'ammap-ex-fabric', 'ammap-ex-filesaver', 'ammap-ex-pdfmake', 'ammap-ex-vfs-fonts', 'ammap-ex-jszip', 'ammap-ex-xlsx'], function(template, app, _, popoverTemplate, popoverTitle) {
  'use strict';

  app.directive('ammap3', ['$timeout', '$compile', function($timeout, $compile) {
    return {
      restrict: 'EAC',
      template: template,
      replace: true,
      require: ['^undbMap', '^ammap3'],
      scope: {
        items: '=ngModel',
        schema: '=schema',
        zoomTo: '=zoomTo',
        debug: '=debug',
        //      pins: '=pins'
      },
      link: function($scope, $element, $attr, requiredDirectives) {

        var reportingDIsplay = requiredDirectives[0];
        var ammap3 = requiredDirectives[1];
        $scope.urlStrings = {
          'projects': {
            'schema_s': ['lwProject'],
            "expired_b": ['false'],
          },
          'caseStudies': {
            'schema_s': ['caseStudy'],
          }
        };
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
          ammap3.generateMap($scope.schema);
        });

        initMap();

        ammap3.writeMap();




        $scope.map.addListener("clickMapObject", function(event) {
          var id = event.mapObject.id;
          if (event.mapObject.id === 'GL') {
            $scope.map.clickMapObject(ammap3.getMapObject('DK'));
            id = 'DK';
          }
        });



        if ($scope.debug) {
          $scope.map.addListener("click", function(event) {

            var info = event.chart.getDevInfo();
            $timeout(function() {
              $("#mapdiv").find("#pin").popover('hide');
              console.log({
                "latitude": info.latitude,
                "longitude": info.longitude,
                "all": info,
              });
            });
          });
        }


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
              "images": [{
                "label": "EU",
                "latitude": -5.02,
                "longitude": -167.66
              }],
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
        } //$scope.initMap
        //not working


      }, //link

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

          // go through all of the images
          for (var x in map.dataProvider.images) {
            // get MapImage object
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
            $scope.map.addListener("positionChanged", updateCustomMarkers);
          }

        }

        // this function creates and returns a new marker element
        function generateMarker(imageIndex) {

          if ($scope.schema === 'actions')
            return makeMarker(imageIndex, 'pin-cbd', 'pulse-cbd', '/app/img/cbd-leaf-green.svg');
          if ($scope.schema === 'actors')
            return makeMarker(imageIndex, 'pin-actor', 'pulse-actor', '/app/img/ic_nature_people_black_24px.svg');
          if ($scope.schema === 'bioChamps')
            return makeMarker(imageIndex, 'pin-actor', 'pulse-actor', '/app/img/ic_verified_user_black_24px.svg');
          if ($scope.schema === 'caseStudies')
            return makeMarker(imageIndex, 'pin-actor', 'pulse-actor', '/app/img/ic_school_black_24px.svg');
          if ($scope.schema === 'projects')
            return makeMarker(imageIndex, 'pin-actor', 'pulse-actor', '/app/img/ic_art_track_black_24px.svg');
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
          pin.addEventListener('click', function() {
            closePopovers(this);
            if ($(pin).data('bs.popover').tip().hasClass('in'))
              $scope.map.clickMapObject($scope.map.dataProvider.images[imageIndex]);
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
          var popoverTitleParsed = _.clone(popoverTitle);
          var popoverTemplateParsed = _.clone(popoverTemplate);

          popoverTitleParsed = popoverTitleParsed.replace('{{schema}}', image.schema);
          popoverTemplateParsed = popoverTemplateParsed.replace('{{projectImage}}', image.thumbnail_s);
          popoverTemplateParsed = popoverTemplateParsed.replace('{{projectTitle}}', image.title);
          if (image.url_ss)
            popoverTemplateParsed = popoverTemplateParsed.replace('{{recordURL}}', image.url_ss);
          switch ($scope.schema) {
            case 'projects':


              return {
                html: true,
                trigger: 'click',
                placement: 'top',
                title: popoverTitleParsed,
                template: popoverTemplateParsed
              };

          }
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
              area2 = getMapObject('gl');
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

          if (!item.coordinates_s || !JSON.parse(item.coordinates_s).lat || !JSON.parse(item.coordinates_s).lng || $scope.schema.trim() === 'caseStudies')
            return 0;
          else
            return {
              zoomLevel: 5,
              scale: 0.5,
              title: item.title_s,
              latitude: JSON.parse(item.coordinates_s).lat,
              longitude: JSON.parse(item.coordinates_s).lng,
              thumbnail_s: item.thumbnail_s,
              schema: item.schema_EN_t,
              url_ss: item.url_ss[0]
            };
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