'use strict';

var drawApp = angular.module('draw', ['leaflet-directive', 'angucomplete-alt', 'ngDialog']);

// var apiUrl = "http://localhost:3000/api";
//var apiUrl = "http://florentplomb.ch/api";
var apiUrl = "http://fleurs-vd.herokuapp.com/api";

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});
drawApp.controller('DrawCtrl', function($scope, $filter, leafletData, ngDialog, ZonesService, PolygonService, $http) {


      // Variable AngularsJs SCOPE //
      $scope.tags = {};
      $scope.tags.data = [];
      $scope.map = {};
      $scope.polyEditedData = {};
      $scope.currentFeature = {};
      $scope.infoZone = {};
      $scope.IdLayerCliked = -1;
      $scope.featureClickedIdLeaflet = {};
      $scope.editMode = false;
      // $scope.controls = {};
      $scope.lineSelected = false;
      $scope.polySelected = false;
      // $scope.controls.draw = {
      //   poly: {
      //     shapeOptions: {
      //       color: 'red',
      //       opacity: 1
      //     },
      //   }
      // };



      // Variable JS //

      var lineStyle = {
        color: "#c5128a", // #02a6a6 //#ff7e61 //#d87c50 //#256aa6
        weight: 6,
        opacity: 0.7,
        fillColor: "blue"
      };

      var polyStyle = {
        color: "#eca91e", // #02a6a6 //#ff7e61 //#d87c50 //#256aa6 // #eca91e
        weight: 2,
        fill: true,
        fillOpacity: 0.5,
        opacity: 1,

      };
      var highlightStyle = {
        color: '#1072ac',
      };

      // var highlight = {
      //   color: "#0000ff",
      //   opacity: 1

      // };

      $scope.map.center = {
        lat: 46.841759385352,
        lng: 6.64475440979004,
        zoom: 10
      };



      leafletData.getMap().then(function(map) {

        //     map.on('overlayadd', function(layer) {
        //     console.log(e);
        // });

        map.on('overlayremove', function(layerRemove) {
          layerRemove.layer.eachLayer(function(layer) {

            if (layer.feature.geometry.type == "Polygon") {

              layer.setStyle(polyStyle);

            } else {

              layer.setStyle(lineStyle);
            }

          });
        });



        ZonesService.get(function(error, zones) {
          if (error) {
            $scope.error = error;
          }

          $scope.lines = zones;

          $scope.layerzones = L.geoJson(zones, {
            style: function(feature) {
              return feature.properties.style;
            },
            onEachFeature: function(feature, layer) {

              layer.setStyle(lineStyle);

              layer.on('click', function(e) {
                $scope.lineSelected = true;
                $scope.polySelected = false;
                layerDefaultStyle();
                e.target.setStyle(highlightStyle);
                $scope.currentFeature = e.target.feature;
                $scope.featureClickedIdLeaflet = e.target._leaflet_id;


                $scope.infoZone.numTalus = feature.properties.ID_MAPINFO;
                var idZone = feature.properties.ID_MAPINFO;
                if (idZone < 10) {
                  $scope.infoZone.id = "0000" + idZone;
                } else if (idZone < 99) {

                  $scope.infoZone.id = "000" + idZone;

                } else {
                  $scope.infoZone.id = "00" + idZone;
                }
                if (feature.properties.flores && feature.properties.flores.length > 0) {

                  $scope.infoZone.commune = feature.properties.communes;
                  $scope.infoZone.fleurs = feature.properties.flores;

                } else {

                  $scope.infoZone.commune = feature.properties.communes;
                  $scope.infoZone.fleurs = [{
                    espece: "Aucune fleur répértoriée"
                  }];


                };
              });

            }


          })



          PolygonService.get(function(error, polys) {
            if (error) {
              $scope.error = error;
            }

            $scope.layerpoly = L.geoJson(polys, {
              style: function(feature) {
                return feature.properties.style;
              },
              onEachFeature: function(feature, layer) {

                layer.setStyle(polyStyle);

                layer.on('click', function(e) {

                  $scope.lineSelected = false;
                  $scope.polySelected = true;
                  $scope.currentFeature = e.target.feature;
                  $scope.infoZone.numTalus = feature.properties.ID_MAPINFO;
                  $scope.editDataOn = true;

                  layerDefaultStyle();
                  e.target.setStyle(highlightStyle);
                  $scope.featureClickedIdLeaflet = e.target._leaflet_id;


                  var idZone = feature.properties.ID_MAPINFO;
                  if (idZone < 10) {
                    $scope.infoZone.id = "0000" + idZone;
                  } else if (idZone < 99) {

                    $scope.infoZone.id = "000" + idZone;

                  } else {
                    $scope.infoZone.id = "00" + idZone;
                  }


                  if (feature.properties.flores && feature.properties.flores.length > 0) {
                    $scope.infoZone.commune = feature.properties.communes;
                    $scope.infoZone.fleurs = feature.properties.flores;

                  } else {

                    $scope.infoZone.commune = feature.properties.communes;
                    $scope.infoZone.fleurs = [{
                      espece: "Aucune fleur répértoriée"
                    }];


                  };


                });


              }
            })


            L.control.layers({
              'OSM': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 25
              }).addTo(map),
              "googleSat": L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                maxZoom: 25,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
              }).addTo(map),
              "googleHybrid": L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                maxZoom: 25,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
              }),
              "googleTerrain": L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
                maxZoom: 25,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
              })

            }, {
              'Lignes': $scope.layerzones.addTo(map),
              'Polys': $scope.layerpoly.addTo(map),
            }).addTo(map);
          });



        });

        var layerDefaultStyle = function() {

          if (map._layers[$scope.featureClickedIdLeaflet]) {
            if (map._layers[$scope.featureClickedIdLeaflet].feature.geometry.type == "Polygon") {

              console.log("ho");
              map._layers[$scope.featureClickedIdLeaflet].setStyle(polyStyle);
            } else {
              map._layers[$scope.featureClickedIdLeaflet].setStyle(lineStyle);
            }
          };


        }

      });


      $scope.editData = function() {

        $http({
          method: "GET",
          url: apiUrl + "/flores/espece",
          headers: {
            "Content-type": "application/json"
          },

        }).success(function(data) {
          $scope.especesName = data;

        }).error(function(err) {
          alert("Une erreur s’est produite, la dernière opération n'a pas été enregistrée , veuillez actualiser la page et recommencez");

        })

        $scope.polyEditedData = $scope.currentFeature;

        $scope.tags.data = $scope.polyEditedData.properties.flores;


        ngDialog.open({
          template: 'templateId',
          scope: $scope,
          closeByDocument: false,
          closeByEscape: false,
          preCloseCallback: function() {
            window.location.reload();
          }
        });



        $scope.storeEditPolyData = function() {

          var floresId = [];
          angular.forEach($scope.polyEditedData.properties.flores, function(item, key) {
            floresId.push(item._id);
          })

          $scope.polyEditedData.properties.flores = floresId;

          var cb = function(err, zoneSaved) {
            if (err) {
              alert("Une erreur s’est produite, la dernière opération n'a pas été enregistrée , veuillez actualiser la page et recommencez");
            } else {

              console.log("SUCESS" + zoneSaved)
            }

          }

          PolygonService.postData(cb, $scope.polyEditedData);

        }

      }

      $scope.editGeom = function() {

        $scope.polygon = {};

        $scope.polygon = $scope.currentFeature;

        $scope.editMode = true;

        leafletData.getMap().then(function(map) {

            map.eachLayer(function(layer) {

              layer.off('click');
              layer.off('mouseover');

            });

            var drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);

            // Initialise the draw control and pass it the FeatureGroup of editable layers
            var drawControl = new L.Control.Draw({
                edit: {
                  featureGroup: drawnItems
                },
                draw: {
                  polyline: false,
                  rectangle: false,
                  circle: false,
                  marker: false,
                  polygon: {
                    shapeOptions: {
                      color: 'red',
                      opacity: 1
                    }
                  }
                  }
                }); map.addControl(drawControl);

              map.on('draw:edited', function(e) {


                var layers = e.layers;
                layers.eachLayer(function(layer) {
                  $scope.polygon.geometry = layer.toGeoJSON().geometry;
                });

              }); map.on('draw:created', function(e) {
                var layer = e.layer;
                drawnItems.addLayer(layer);
                console.log(layer.toGeoJSON().geometry);
                $scope.polygon.geometry = layer.toGeoJSON().geometry
              });
            });
        };

        $scope.postPolygon = function() {

          var cb = function(err, zoneSaved) {
            if (err) {
              alert("Une erreur s’est produite, la dernière opération n'a pas été enregistrée , veuillez actualiser la page et recommencez");
            } else {
              console.log("SUCESS" + zoneSaved)
              window.location.reload();
            }

          }

          PolygonService.post(cb, $scope.polygon);
        }

      });



    drawApp.factory("PolygonService", function($http) {

      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return {
        post: function(callback, newPoly) {
          $http.post(apiUrl + "/polygons/fromline", {
            "polygon": newPoly,
          }, config).success(function(data) {
            var poly = data;
            callback(null, poly);
          }).error(function(error) {
            callback(error);
          });
        },
        postData: function(callback, polyEdited) {
          $http.post(apiUrl + "/polygons/updateData", {
            "polygon": polyEdited,
          }, config).success(function(data) {
            var poly = data;
            callback(null, poly);
          }).error(function(error) {
            callback(error);
          });
        },
        get: function(callback) {
          $http.get(apiUrl + "/polygons", config).success(function(data) {
            var polys = data;
            callback(null, polys);
          }).error(function(error) {
            callback(error);
          });
        }
      };
    });

    drawApp.controller('TagsController', function($scope, $rootScope, $log) {


      $scope.deleteTag = function(index) {
        $scope.tags.data.splice(index, 1);
      }

      $scope.addTag = function(index) {

        $scope.tags.data.push(
          $scope.selectFlores.originalObject
        );
        $scope.selectFlores = "";
      }
    });



    drawApp.factory("ZonesService", function($http) {

      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      return {
        get: function(callback) {
          $http.get(apiUrl + "/zones", config).success(function(data) {
            var zone = data;
            callback(null, zone);
          }).error(function(error) {
            callback(error);
          });
        }
      };
    });

    drawApp.directive('ngConfirmClick', [
      function() {
        return {
          link: function(scope, element, attr) {
            var msg = attr.ngConfirmClick || "Are you sure?";
            var clickAction = attr.confirmedClick;
            element.bind('click', function(event) {
              if (window.confirm(msg)) {
                scope.$eval(clickAction)
              }
            });
          }
        };
      }
    ])