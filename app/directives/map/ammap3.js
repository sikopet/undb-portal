define(['text!./ammap3.html',
    'app',
    'lodash',
    'moment-timezone',
    'text!./pin-popup-actions.html',
    'text!./pin-popup-title-actions.html',
    'text!./pin-popup-title-actors.html',
    'data/ccc',
    'ammap',
    'shim!./worldEUHigh[ammap]',
    'shim!ammap/themes/light[ammap]',
    'css!./mappin.css',
    'filters/hack',
    'filters/trunc',
    'utilities/km-utilities'
], function(template, app, _,moment,  popoverTemplateBioChamps, popoverTitleBioChamps, popoverTemplateActions, popoverTitleActions, popoverTitleActors,ccc) {
    'use strict';
var images=[];
    app.directive('ammap3', ['$timeout', 'locale', '$http','$document','$filter',function($timeout, locale, $http,$document,$filter) {
        return {
            restrict: 'E',
            template: template,
            replace: true,
            require: ['^ammap3'],
            scope: {
                items: '=ngModel',
                schema: '=schema',
                debug: '=debug'
            },
            link: function($scope, $element, $attr, requiredDirectives) {

                var ammap3 = requiredDirectives[0];

                $scope.leggends = {
                    parties: [{
                        id: 5,
                        title: 'CBD Party',
                        visible: true,
                        color: '#009B48'
                    }, {
                        id: 0,
                        title: 'Not a Party',
                        visible: true,
                        color: '#8cc65d'
                    }, ],
                    aichi: [ {
                      id: 5,
                      title: 'Exceeded Target',
                      visible: true,
                      color: '#1074bc'
                    }, {
                      id: 4,
                      title: 'Met Target',
                      visible: true,
                      color: '#109e49'
                    }, {
                      id: 3,
                      title: 'Insufficient Rate',
                      visible: true,
                      color: '#fec210'
                    }, {
                      id: 2,
                      title: 'No Progress',
                      visible: true,
                      color: '#ee1d23'
                    } , {
                      id: 1,
                      title: 'Moving Away',
                      visible: true,
                      color: '#6c1c67'
                    },{
                      id: 0,
                      title: 'No Data',
                      visible: true,
                      color: '#dddddd'
                    }]
                };

                //=======================================================================
                //
                //=======================================================================
                $scope.$watch('items', function(newV,old) {
                    if ($scope.map && (!_.isEmpty($scope.items) || (_.isEmpty(newV) && !_.isEmpty(old))) ) {
                        $scope.map.dataProvider.images = _.clone($scope.images);
                        ammap3.generateMap($scope.schema);
                    }
                });

                //=======================================================================
                //
                //=======================================================================
                $http.get('/api/v2015/countries', {
                    cache: true,
                }).then(function(res) {
                    res.data.forEach(function(c) {
                        c.name = c.name[locale];
                    });
                    $scope.countries = res.data;
                    initMap();
                });
                //=======================================================================
                //
                //=======================================================================
                function onMapClick(event) {
                  var info = event.chart.getDevInfo();
                  if(ammap3.isPopoverOpen())
                      ammap3.closePopovers();
                  else{
                    info = event.chart.getDevInfo();
                    var zoomLevel;
                    if($scope.map.zoomLevel()<4097)
                      zoomLevel = $scope.map.zoomLevel()*8;
                    else
                      zoomLevel = $scope.map.zoomLevel();

                    var longitude= info.longitude;
                    var latitude= info.latitude;
                    $timeout(function(){

                        $scope.map.zoomToLongLat(zoomLevel, longitude, latitude);
                    },400);
                  }
                }

                //=======================================================================
                //
                //=======================================================================
                function initMap() {

                    $scope.images = [{
                        "label": "EU",
                        "latitude": -5.02,
                        "longitude": -167.66
                    }];
                    $scope.mapData = {
                        "type": "map",
                        "developerMode":true,
                        "theme": "light",
                        "zoomDuration":.3,
                        "responsive": {
                            "enabled": true
                        },
                        "dataProvider": {
                            "map": "worldEUHigh",
                            "getAreasFromMap": true,
                        },

                        "areasSettings": {
                            "autoZoom": false,
                            "selectedColor": "#004844",
                            "rollOverColor": "#004844",
                            "selectable": true,
                            "color": "#009B48"
                        },

                        "zoomControl": {
                            "left": 28,
                            "maxZoomLevel": 262144,
                            "zoomFactor":8,
                            "panStepSize":.2
                        }
                    }; //

                    $scope.mapData.images = _.clone($scope.images);
                    ammap3.writeMap();
                    $document.keyup(function(v){
                      if(v.keyCode == 27)
                        ammap3.closePopovers();
                    });
                    $scope.map.addListener("homeButtonClicked", ammap3.closePopovers);
                    $scope.map.addListener("homeButtonClicked", ammap3.updateCustomMarkers);
                    $scope.map.addListener("positionChanged", ammap3.updateCustomMarkers);
                    $scope.map.addListener('zoomCompleted',function(){
                      $timeout(function(){ammap3.updateCustomMarkers();},100);
                    });
                    $scope.map.addListener("click",onMapClick );
                } //$scope.initMap
            }, //link


            //=======================================================================
            // controller
            //=======================================================================
            controller: ["$scope", function($scope) {

                //=======================================================================
                //
                //=======================================================================
                function closePopovers(pin) {
                    // get map object
                    var map = $scope.map;

                    // go through all of the images
                    for (var x in map.dataProvider.images) {
                        if (x !== $(pin).data('i'))
                            $($scope.map.dataProvider.images[x].externalElement).children('#pin').popover('hide');
                    }
                } //close popover

                //=======================================================================
                // this function will take current images on the map and create HTML elements for them
                //=======================================================================
                function isPopoverOpen() {
                    // get map object
                    var map = $scope.map;
                    var pin = null;
                    // go through all of the images
                    for (var x in map.dataProvider.images) {
                        pin = $($scope.map.dataProvider.images[x].externalElement).children('#pin');
                        if($(pin).next('div.popover:visible').length) return true;
                    }
                    return false;
                } //close popover


                //=======================================================================
                // this function will take current images on the map and create HTML elements for them
                //=======================================================================
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

                        if (map.dataProvider.images[x].label && map.dataProvider.images[x].label === 'EU' || map.dataProvider.images[x].label && map.dataProvider.images[x].label === ' ') continue;
                        // check if it has corresponding HTML element
                        if ('undefined' == typeof image.externalElement) {
                            image.externalElement = generateMarker(x);
                        }

                        if ('undefined' !== typeof image.externalElement) {
                            // reposition the element accoridng to coordinates
                            var adjustTopLevel=adjustmentZ(image.latitude);

                            if(image.latitude>0)
                               image.externalElement.style.top = map.latitudeToY(image.latitude+adjustTopLevel) + 'px';
                          else
                            image.externalElement.style.top = map.latitudeToY(image.latitude+adjustTopLevel) + 'px';

                            image.externalElement.style.left = map.longitudeToX(image.longitude+adjustTopLevel) + 'px';
                        }
                    } //for


                } //updateCustomMarkers


                //=======================================================================
                //
                //=======================================================================
                function generateMarker(imageIndex) {

                    if ($scope.schema === 'actions')
                        if($scope.map.dataProvider.images[imageIndex].isCCC)
                          return makeMarker(imageIndex, 'pin-ccc', 'pulse-', 'app/img/pointer-undb-orange.png');
                        else
                        return makeMarker(imageIndex, 'pin-action', 'pulse-', 'app/img/pointer-undb-green.png');

                    if ($scope.schema === 'undbActor')
                        return makeMarker(imageIndex, 'pin-actor', 'pulse-', 'app/img/pointer-undb-blue.png');

                } //generateMarker


                //=======================================================================
                // this function creates and returns a new marker element
                //=======================================================================
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

                    $(pin).hover(function(){
                      $(pin).popover(generatePopover(imageIndex));
                    });

                    $(pin).on('shown.bs.popover',function(){
                      if ($(pin).data('bs.popover').tip().hasClass('in')){
                        $scope.map.zoomToLongLat($scope.map.zoomLevel(), $scope.map.dataProvider.images[imageIndex].longitude, $scope.map.dataProvider.images[imageIndex].latitude);
                        $timeout(function(){
                          $scope.map.moveUp();
                        },500);
                      }
                    });

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
                } //makeMarker
                //=======================================================================
                //
                //=======================================================================
                function filterDescription(text,url) {
                      return $filter('hack')($filter('trunc')(text, 410, ' '))+'... <a href="'+url+'">More</a>';

                }
                //=======================================================================
                //
                //=======================================================================
                function extractId (id){
                    if(!id)return;
                    return parseInt(id.replace('52000000cbd08', ''), 16);
                }

                //=======================================================================
                //
                //=======================================================================
                function generatePopover(imageIndex) {
                    var image = $scope.map.dataProvider.images[imageIndex];
                    var popoverTitleParsed = '';
                    var popoverTemplateParsed = '';

                    switch ($scope.schema) {
                        case 'bioChamps':
                            popoverTitleParsed = _.clone(popoverTitleBioChamps);
                            popoverTemplateParsed = _.clone(popoverTemplateBioChamps);

                            popoverTitleParsed = popoverTitleParsed.replace('{{rank}}', image.rank ? image.rank : ' ');
                            popoverTitleParsed = popoverTitleParsed.replace('{{date}}', image.date ? image.date : ' ');
                            popoverTitleParsed = popoverTitleParsed.replace('{{image}}', image.imgURL ? image.imgURL : '#');

                            popoverTitleParsed = popoverTitleParsed.replace('{{title}}', image.title ? image.title : ' ');

                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a1}}',image.a1);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a2}}',image.a2);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a3}}',image.a3);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a4}}',image.a4);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a5}}',image.a5);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a6}}',image.a6);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a7}}',image.a7);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a8}}',image.a8);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a9}}',image.a9);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a10}}',image.a10);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a11}}',image.a11);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a12}}',image.a12);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a13}}',image.a13);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a14}}',image.a14);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a15}}',image.a15);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a16}}',image.a16);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a17}}',image.a17);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a18}}',image.a18);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a19}}',image.a19);
                            popoverTemplateParsed =  popoverTemplateParsed.replace('{{a20}}',image.a20);


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

                            popoverTitleParsed = popoverTitleParsed.replace('{{startDate_s}}', image.startDate_dt ? moment.utc(image.startDate_dt).format('DD MMM YYYY')  : ' ');
                            popoverTitleParsed = popoverTitleParsed.replace('{{endDate_s}}', image.endDate_dt ? moment.utc(image.endDate_dt).format('DD MMM YYYY') : ' ');
                            popoverTitleParsed = popoverTitleParsed.replace('{{logo_s}}', image.logo_s ? image.logo_s : '/app/img/ic_recent_actors_black_48px.svg');

                            if (image.countryCode) image.countryName = _.findWhere($scope.countries, {
                                code: image.countryCode.toUpperCase()
                            }).name;
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{countryCode}}', image.countryCode ? image.countryCode : ' ');
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{countryCode}}', image.countryCode ? image.countryCode : ' ');
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{countryName}}', image.countryName ? image.countryName : ' ');
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{description_s}}', image.description_s ? filterDescription(image.description_s,'actions/'+extractId(image.id)) : ' ');


                            popoverTemplateParsed = popoverTemplateParsed.replace('{{logo_s}}', image.logo_s ? image.logo_s : '/app/img/ic_recent_actors_black_48px.svg');
                            if (image.facebook_s) image.facebook_s = '<a href="' + image.facebook_s + '" target="_blank"><i class="fa fa-facebook-square fa-2x"></i></a>';
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{facebook_s}}', image.facebook_s ? image.facebook_s : ' ');
                            if (image.twitter_s) image.twitter_s = '<a href="' + image.twitter_s + '" target="_blank"><i class="fa fa-twitter-square fa-2x"></i></a>';
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{twitter_s}}', image.twitter_s ? image.twitter_s : ' ');
                            if (image.youtube_s) image.youtube_s = '<a href="' + image.youtube_s + '" target="_blank"><i class="fa fa-youtube-square fa-2x"></i></a>';
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{youtube_s}}', image.youtube_s ? image.youtube_s : ' ');
                            image.website_s = '<a href="' + 'actions/'+extractId(image.id)+ '" ><i class="fa fa-external-link-square fa-2x"></i></a>';
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
                            var img = new Image();
                            if(image.logo_s){
                              img.src=image.logo_s;
                              images.push(img);
                            }else{
                              img.src='/app/img/ic_recent_actors_black_48px.svg';
                              images.push(img);
                            }
                            popoverTitleParsed = _.clone(popoverTitleActors);
                            popoverTemplateParsed = _.clone(popoverTemplateActions);
                            popoverTitleParsed = popoverTitleParsed.replace('{{logo_s}}', image.logo_s ? image.logo_s : '/app/img/ic_recent_actors_black_48px.svg');
                            popoverTitleParsed = popoverTitleParsed.replace('{{title}}', image.title ? image.title : ' ');


                            if (image.countryCode) image.countryName = _.findWhere($scope.countries, {
                                code: image.countryCode.toUpperCase()
                            }).name;
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{countryCode}}', image.countryCode ? image.countryCode : ' ');
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{countryCode}}', image.countryCode ? image.countryCode : ' ');
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{countryName}}', image.countryName ? image.countryName : ' ');
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{description_s}}', image.description_s ? filterDescription(image.description_s,'actors/partners/'+extractId(image.id)): ' ');
                            if (image.descriptionNative_s) image.descriptionNative_s = image.descriptionNative_s + '<br>';
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{descriptionNative_s}}', image.descriptionNative_s ? image.descriptionNative_s : ' ');
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{logo_s}}', image.logo_s ? image.logo_s : '/app/img/ic_recent_actors_black_48px.svg');
                            if (image.facebook_s) image.facebook_s = '<a href="' + image.facebook_s + '" target="_blank"><i class="fa fa-facebook-square fa-2x"></i></a>';
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{facebook_s}}', image.facebook_s ? image.facebook_s : ' ');
                            if (image.twitter_s) image.twitter_s = '<a href="' + image.twitter_s + '" target="_blank"><i class="fa fa-twitter-square fa-2x"></i></a>';
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{twitter_s}}', image.twitter_s ? image.twitter_s : ' ');
                            if (image.youtube_s) image.youtube_s = '<a href="' + image.youtube_s + '" target="_blank"><i class="fa fa-youtube-square fa-2x"></i></a>';
                            popoverTemplateParsed = popoverTemplateParsed.replace('{{youtube_s}}', image.youtube_s ? image.youtube_s : ' ');
                            image.website_s = '<a href="' + 'actors/partners/'+extractId(image.id)+ '" ><i class="fa fa-external-link-square fa-2x"></i></a>';
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
                    if (schema === 'parties'){
                        colorMap(resetMap);
                        partiesMap();
                    }
                    else if (schema === 'aichi'){
                        //colorMap(resetMap);
                        progressColorMap(aichiMap);

                      }
                    else {
                        colorMap(resetMap);
                        pinMap(defaultPinMap);
                    }
                } //generateMap


                //=======================================================================
                //
                //=======================================================================
                function progressToColor(progress) {

                  switch (progress) {
                    case 5:
                      return '#1074bc';
                    case 4:
                      return '#109e49';
                    case 3:
                      return '#fec210';
                    case 2:
                      return '#ee1d23';
                    case 1:
                      return '#6c1c67';
                  }
                } //readQueryString
                //=======================================================================
                //
                //=======================================================================
                function aichiMap(country) {


                  if(!_.isEmpty(country.docs)){
                      changeAreaColor(country.code, progressToColor(country.docs[0].progress));
                      if(country.docs[0].progress && country.docs[0].nationalTarget_EN_t)
                      buildProgressBaloon(country,country.docs[0].progress, country.docs[0].nationalTarget_EN_t);

                  }else
                      changeAreaColor(country.code,'#cccccc');

                  // if(!_.isEmpty(country.targets)){
                  //     buildTargetBaloon(country);
                  // }


                  // legendTitle(country);
                  // restLegend($scope.leggends.aichiTarget);
                } // aichiMap

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
                function partiesMap() {
                       changeAreaColor('divider1', "#009B48");
                       changeAreaColor('EU', "#009B48");
                       changeAreaColor('US', "#8cc65d");
                       var area = getMapObject('EU');
                       area.outlineAlpha = '.5';
                       area = getMapObject('divider1');
                       area.outlineAlpha = '.5';
                       $scope.map.dataProvider.images[0].label = 'EU';
                       $scope.map.validateData();
                } //progressColorMap

                //=======================================================================
                //
                //=======================================================================
                function progressColorMap(mapTypeFunction) {

                    //hideAreas();

                    _.each($scope.items, function(country) {

                        if (!_.isEmpty(country.docs))
                            _.each(country.docs, function(schema) {
                                if (mapTypeFunction) mapTypeFunction(country, schema, $scope.schema);
                            });
                        else mapTypeFunction(country);
                    });

                    changeAreaColor('divider1', "#009B48");

                    var area = getMapObject('EU');
                    area.outlineAlpha = '.5';
                    area = getMapObject('divider1');
                    area.outlineAlpha = '.5';

                    $scope.map.dataProvider.images[0].label = 'EU';
                    $scope.map.validateData(); // updates map with color changes
                } //progressColorMap


                //=======================================================================
                //
                //=======================================================================
                function pinMap(mapTypeFunction) {

                    $scope.legendTitle = ""; // reset legend title
                    _.each($scope.items, function(item) {
                        mapTypeFunction(item);
                    });
                    $scope.map.validateData(); // updates map with color changes
                    updateCustomMarkers();
                } //


                //=======================================================================
                //
                //=======================================================================
                function colorMap(mapTypeFunction) {

                    _.each($scope.map.dataProvider.areas, function(country) {
                        //if(country.id!=='US')
                          mapTypeFunction({
                              'code': country.id
                          });
                    });
                    $scope.map.validateData(); // updates map with color changes
                } //colorMap


                //=======================================================================
                //
                //=======================================================================
                function resetMap(country) {

                    if (!country.code) return;

                    if (country.code !== 'EU')
                        changeAreaColor(country.code, "#009B48");
                    else {
                        changeAreaColor(country.code, "#99CDE8");
                        changeAreaColor('divider1', "#99CDE8");

                        var area = getMapObject(country.code);
                        area.outlineAlpha = 0;
                        area = getMapObject('divider1');
                        area.outlineAlpha = 0;

                        $scope.map.dataProvider.images[0].label = ' ';
                    }
                } //resetMap


                //=======================================================================
                //
                //=======================================================================
                function defaultPinMap(item) {

                    if (itemToImagePin(item))
                        $scope.map.dataProvider.images.push(itemToImagePin(item));
                } // defaultPinMap


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
                                    // zoomLevel: 5,
                                    scale: 0.5,
                                    title: item.title_s,
                                    latitude: item.coordinates_s.lat,
                                    longitude: item.coordinates_s.lng,
                                    thumbnail_s: item.thumbnail_s,
                                    schema: item.schema_EN_t,
                                    url_ss: item.url_ss[0],
                                };
                            case 'bioChamps':
                                return {
                                    // zoomLevel: 5,
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
                                    link: item.link,
                                    a1: item.targets[0]? ' ' : 'style="display:none;"',
                                    a2: item.targets[1]? ' ' : 'style="display:none;"',
                                    a3: item.targets[2]? ' ' : 'style="display:none;"',
                                    a4: item.targets[3]? ' ' : 'style="display:none;"',
                                    a5: item.targets[4]? ' ' : 'style="display:none;"',
                                    a6: item.targets[5]? ' ' : 'style="display:none;"',
                                    a7: item.targets[6]? ' ' : 'style="display:none;"',
                                    a8: item.targets[7]? ' ' : 'style="display:none;"',
                                    a9: item.targets[8]? ' ' : 'style="display:none;"',
                                    a10: item.targets[9]? ' ' : 'style="display:none;"',
                                    a11: item.targets[10]? ' ' : 'style="display:none;"',
                                    a12: item.targets[11]? ' ' : 'style="display:none;"',
                                    a13: item.targets[12]? ' ' : 'style="display:none;"',
                                    a14: item.targets[13]? ' ' : 'style="display:none;"',
                                    a15: item.targets[14]? ' ' : 'style="display:none;"',
                                    a16: item.targets[15]? ' ' : 'style="display:none;"',
                                    a17: item.targets[16]? ' ' : 'style="display:none;"',
                                    a18: item.targets[17]? ' ' : 'style="display:none;"',
                                    a19: item.targets[18]? ' ' : 'style="display:none;"',
                                    a20: item.targets[19]? ' ' : 'style="display:none;"',

                                };
                            case 'actions':
                                return {
                                    // zoomLevel: 5,
                                    scale: 0.5,
                                    id:item.id,
                                    startDate_dt: item.startDate_dt,
                                    logo_s: item.logo_s,
                                    facebook_s: item.facebook_s,
                                    twitter_s: item.twitter_s,
                                    youtube_s: item.youtube_s,
                                    website_s: item.website_s,
                                    endDate_dt: item.endDate_dt,
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
                                    // zoomLevel: 5,
                                    id:item.id,
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


                // =======================================================================
                //
                // =======================================================================
                function changeAreaColor(id, color, area) {

                    if (!area)
                        area = getMapObject(id);

                    area.colorReal = area.originalColor = color;
                    if (id === 'DK') {
                        var area2 = getMapObject('GL');
                        area2.colorReal = area.colorReal;
                        area2.originalColor = area.originalColor;
                    }
                } //changeAreaColor

                // //=======================================================================
                // // c
                // //=======================================================================
                function getProgressIcon(progress) {

                  switch (progress) {
                    case 1:
                      return '/app/images/ratings/36A174B8-085A-4363-AE11-E34163A9209C.png';
                    case 2:
                      return '/app/images/ratings/2D241E0A-1D17-4A0A-9D52-B570D34B23BF.png';
                    case 3:
                      return '/app/images/ratings/486C27A7-6BDF-460D-92F8-312D337EC6E2.png';
                    case 4:
                      return '/app/images/ratings/E49EF94E-0590-486C-903B-68C5E54EC089.png';
                    case 5:
                      return '/app/images/ratings/884D8D8C-F2AE-4AAC-82E3-5B73CE627D45.png';
                  }
                } //getProgressIcon(progress)

                // // =======================================================================
                // //
                // // =======================================================================
                function buildProgressBaloon(country, progress, target) {

                  var area = getMapObject(country.code);
                  if(country.code==='EU')country.code='eur';
                  area.balloonText = "<div class='panel panel-default' ><div class='panel-heading' style='font-weight:bold; font-size:medium; white-space: nowrap;'><img style=\"max-height:20px;\" src=\"https://www.cbd.int/images/flags/96/flag-"+country.code+"-96.png\">&nbsp;";
                  var balloonText2 = area.title + "</div> <div class='panel-body' style='text-align:left;'><img style='float:right;width:60px;hight:60px;' src='" + getProgressIcon(progress) + "' >" + getProgressText(progress, target) + "</div> </div>";

                  area.balloonText += balloonText2;
                } //buildProgressBaloon

                // //=======================================================================
                // //
                // //=======================================================================
                function getProgressText(progress, target) {
                  if(Array.isArray(target))target= target[0];
                  switch (progress) {
                    case 1:
                      return 'Moving away from ' + aichiTargetReadable(target) + ' (things are getting worse rather than better).';
                    case 2:
                      return 'No significant overall progress towards ' + aichiTargetReadable(target) + ' (overall, we are neither moving towards the ' + aichiTargetReadable(target) + ' nor moving away from it).';
                    case 3:
                      return 'Progress towards ' + aichiTargetReadable(target) + ' but at an insufficient rate (unless we increase our efforts the ' + aichiTargetReadable(target) + ' will not be met by its deadline).';
                    case 4:
                      return 'On track to achieve ' + aichiTargetReadable(target) + ' (if we continue on our current trajectory we expect to achieve the ' + aichiTargetReadable(target) + ' by 2020).';
                    case 5:
                      return 'On track to exceed ' + aichiTargetReadable(target) + ' (we expect to achieve the ' + aichiTargetReadable(target) + ' before its deadline).';
                  }
                } //getProgressText(progress, target)
                // //=======================================================================
                // //
                // //=======================================================================
                function aichiTargetReadable(target) {

                  if(typeof target === 'string')
                  return target.replace("-", " ").replace("-", " ").toLowerCase().replace(/\b./g, function(m) {
                    return m.toUpperCase();
                  });
                } //aichiTargetReadable
                //=======================================================================
                //
                //=======================================================================
                function getMapData() {
                    return $scope.mapData;
                }


                // //=======================================================================
                // //
                // //=======================================================================
                function getMapObject(id) {

                    var index = _.findIndex($scope.map.dataProvider.areas, function(area) {
                        if(id==='eur') return area.id === 'EU';

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
                this.updateCustomMarkers=updateCustomMarkers;
                this.isPopoverOpen=isPopoverOpen;
            }],
        }; // return
    }]); //app.directive('searchFilterCountries
}); // define