'use strict';

var drawApp = angular.module('draw', ['leaflet-directive', 'angucomplete-alt', 'ngDialog']);

var apiUrl = "http://localhost:3000/api";
//var apiUrl = "http://florentplomb.ch/api";
//var apiUrl = "http://fleurs-vd.herokuapp.com/api";

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});
<<<<<<< HEAD
drawApp.controller('DrawCtrl', function($scope, $filter, leafletData, ngDialog, ZonesService, PolygonService) {
=======
drawApp.controller('DrawCtrl', function($scope, $filter, $http, leafletData, ngDialog, ZonesService, PolygonService) {
>>>>>>> 10e80f60dd5bc7c8bfffca1f7e96635532903a06


  // Variable AngularsJs SCOPE //



  $scope.map = {};
  // $scope.infoZone = {};
  // $scope.IdLayerCliked = -1;
  // $scope.zoneClicked = {};

  // $scope.editMode = false;
  // $scope.controls = {};
  // $scope.controls.draw = {
  //   polyline: {
  //     shapeOptions: {
  //       color: 'red',
  //       opacity: 1
  //     },
  //   }
  // };


  $scope.map.layers = {

    baselayers: {
      osm: {
        name: 'OpenStreetMap',
        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        type: 'xyz'
      },

      googleTerrain: {
        name: 'Google Terrain',
        layerType: 'TERRAIN',
        type: 'google'
      },
      googleHybrid: {
        name: 'Google Hybrid',
        layerType: 'HYBRID',
        type: 'google'
      },
      googleRoadmap: {
        name: 'Google Streets',
        layerType: 'ROADMAP',
        type: 'google'
      }
    },
    overlays: {}

  }


  //   $http.get("http://localhost:3000/api/zones").success(function(data, status) {

  // });
  //Variable JS //

  var defaultStyle = {
    color: "#c5128a", // #02a6a6 //#ff7e61 //#d87c50 //#256aa6
    weight: 6,
    opacity: 0.7,

    fillColor: "blue"
  };
  var polyDefaultStyle = {
    color: "#dd5825", // #02a6a6 //#ff7e61 //#d87c50 //#256aa6
    weight: 6,
    opacity: 0.7,

    fillColor: "blue"
  };

  var highlightStyle = {
    color: '#1072ac',
  };

  var highlight = {
    color: "#0000ff",
    opacity: 1

  };

  $scope.map.center = {
    lat: 46.841759385352,
    lng: 6.64475440979004,
    zoom: 10
  };

<<<<<<< HEAD
  leafletData.getMap().then(function(map) {

    ZonesService.get(function(error, zones) {
      if (error) {
        $scope.error = error;
      }

      $scope.lines = zones;

=======

  PolygonService.get(function(error, polys) {
    if (error) {
      $scope.error = error;
    }

    $scope.map.layers.overlays.countries = {
      name: 'Polygon',
      type: 'geoJSONShape',
      data: polys,
      layerOptions: {
        style: {
          color: 'red',
          fillColor: 'red',
          weight: 6.0,
          opacity: 0.6,
          fillOpacity: 0.2
        }
      }
    };


    $scope.allPoly = polys;



    leafletData.getMap().then(function(map) {
>>>>>>> 10e80f60dd5bc7c8bfffca1f7e96635532903a06



      $scope.layerPolys = L.geoJson(polys, {
        style: function(feature) {
          return feature.properties.style;
        },
        onEachFeature: function(feature, layer) {

          layer.setStyle(polyDefaultStyle);

          layer.on('click', function(e) {

            $scope.polyClicked = feature

            highlightLayer(layer._leaflet_id);

            var idZone = feature.properties.ID_MAPINFO;
            if (idZone < 10) {
              $scope.infoZone.id = "0000" + idZone;
            } else if (idZone < 99) {

              $scope.infoZone.id = "000" + idZone;

            } else {
              $scope.infoZone.id = "00" + idZone;
            }

          });

          if (feature.properties.flores && feature.properties.flores.length > 0) {

            layer.on('click', function(e) {
              $scope.infoZone.commune = feature.properties.communes;
              $scope.infoZone.fleurs = feature.properties.flores;
            });
          } else {
            layer.on('click', function(e) {
              $scope.infoZone.commune = feature.properties.communes;
              $scope.infoZone.fleurs = [{
                espece: "Aucune fleur répértoriée"
              }];

            });
          };


        }
      })

      var highlightLayer = function(layerID) {
        if ($scope.IdLayerCliked >= 0) {

          map._layers[$scope.IdLayerCliked].setStyle(defaultStyle)
          map._layers[layerID].setStyle(highlight);
          $scope.IdLayerCliked = layerID;
        } else {
          map._layers[layerID].setStyle(highlight);
          $scope.IdLayerCliked = layerID;
        };
      }



    })

    ZonesService.get(function(error, zones) {
      if (error) {
        $scope.error = error;
      }

      $scope.lines = zones;

      $scope.map.layers.overlays.zones = {
        name: 'Lignes',
        type: 'geoJSONShape',
        data: zones,
        layerOptions: {
          style: {
            color: '#00D',
            fillColor: 'red',
            weight: 2.0,
            opacity: 0.6,
            fillOpacity: 0.2
          }
        }
      };


      $scope.layerzones = L.geoJson(zones, {
        style: function(feature) {
          return feature.properties.style;
        },
        onEachFeature: function(feature, layer) {

          layer.setStyle(defaultStyle);

          layer.on('click', function(e) {

            $scope.zoneClicked = feature

            highlightLayer(layer._leaflet_id, map);

            var idZone = feature.properties.ID_MAPINFO;
            if (idZone < 10) {
              $scope.infoZone.id = "0000" + idZone;
            } else if (idZone < 99) {

              $scope.infoZone.id = "000" + idZone;

            } else {
              $scope.infoZone.id = "00" + idZone;
            }

          });

          if (feature.properties.flores && feature.properties.flores.length > 0) {

            layer.on('click', function(e) {
              $scope.infoZone.commune = feature.properties.communes;
              $scope.infoZone.fleurs = feature.properties.flores;
            });
          } else {
            layer.on('click', function(e) {
              $scope.infoZone.commune = feature.properties.communes;
              $scope.infoZone.fleurs = [{
                espece: "Aucune fleur répértoriée"
              }];

            });
          };


        }
      })


<<<<<<< HEAD
=======

      // L.control.layers({
      //   "gmap": L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      //     maxZoom: 20,
      //     subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      //   }).addTo(map),
      //   "OSM": L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')}, {
      //     'Lignes': $scope.layerzones.addTo(map),
      //     'Polygons': $scope.layerPolys
      //   }).addTo(map);


>>>>>>> 10e80f60dd5bc7c8bfffca1f7e96635532903a06

      PolygonService.get(function(error, polys) {
        if (error) {
          $scope.error = error;
        }

        $scope.layerpoly = L.geoJson(polys, {
          style: function(feature) {
            return feature.properties.style;
          },
          onEachFeature: function(feature, layer) {

            layer.setStyle(defaultStyle);

            layer.on('click', function(e) {

              console.log(layer);

              highlightLayer(layer._leaflet_id, map);

              if (feature.properties.flores && feature.properties.flores.length > 0) {

                layer.on('click', function(e) {
                  $scope.infoZone.commune = feature.properties.communes;
                  $scope.infoZone.fleurs = feature.properties.flores;
                });
              } else {
                layer.on('click', function(e) {
                  $scope.infoZone.commune = feature.properties.communes;
                  $scope.infoZone.fleurs = [{
                    espece: "Aucune fleur répértoriée"
                  }];

                });
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
          }),
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

    var highlightLayer = function(layerID) {

      map.eachLayer(function(layer) {

        if (layer.feature) {
          layer.setStyle(defaultStyle);
        };

      });

      if ($scope.IdLayerCliked >= 0) {

        console.log($scope.IdLayerCliked);
        console.log(map);
        if (map._layers[$scope.IdLayerCliked]) {
          map._layers[$scope.IdLayerCliked].setStyle(defaultStyle)
        };
        map._layers[layerID].setStyle(highlight);
        $scope.IdLayerCliked = layerID;
      } else {
        map._layers[layerID].setStyle(highlight);
        $scope.IdLayerCliked = layerID;
      };
    }

  });



  $scope.editGeom = function() {
    $scope.polygon = {};

    $scope.polygon.lineId = $scope.zoneClicked._id;

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
          marker: false
        }
      });
      map.addControl(drawControl);

      map.on('draw:edited', function(e) {


        var layers = e.layers;
        layers.eachLayer(function(layer) {
          $scope.polygon.geometry = layer.toGeoJSON().geometry;
        });

      });
      map.on('draw:created', function(e) {
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
        $scope.error = err;
      } else {
        console.log("SUCESS" + zoneSaved)
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
    get: function(callback) {
      $http.get(apiUrl + "/polygons", config).success(function(data) {
<<<<<<< HEAD
        var polys = data;
        callback(null, polys);
=======
        var poly = data;
        callback(null, poly);
>>>>>>> 10e80f60dd5bc7c8bfffca1f7e96635532903a06
      }).error(function(error) {
        callback(error);
      });
    }
  };
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