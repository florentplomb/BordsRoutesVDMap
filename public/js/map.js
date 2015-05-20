'use strict';

var app = angular.module('app', ['leaflet-directive', 'angucomplete-alt', ]);
var apiUrl = "http://localhost:3000/api";
//var apiUrl = "http://florentplomb.ch/api";
//var apiUrl = "http://geofleurs.herokuapp.com/api";

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

app.controller('MapCtrl', function($scope, $filter, leafletData, ZonesService, CommunesService, $http, FloreService) {

  var zonesTalus = [];

  $scope.map = {};
  var yverdon = {
    lat: 46.841759385352,
    lng: 6.64475440979004,
    zoom: 14
  };

  $scope.layers = {};
  var bLayerId = [];
  $scope.infoZone = {};
  $scope.events = {};
  $scope.communesName = [];
  $scope.especesName = [];
  $scope.map = {};
  $scope.map.markers = [];
  $scope.map.center = {};
  $scope.map.center = yverdon;

  // url MapBox
  var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "fplomb.kajpd2d6";
  mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiZnBsb21iIiwiYSI6ImJwRUF2ZlkifQ.OIuXY-qgnEBzcnYwXg8imw";

  var baselayers = {
    baselayers: {
      mapbox_light: {
        name: 'Mapbox Light',
        url: mapboxTileLayer,
        type: 'xyz',
        layerOptions: {
          apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
          mapid: 'fplomb.kajpd2d6'
        }
      },
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
    }
  }


  // Center map on commune selected
  $scope.$watch(function() {
    return $scope.selectcommunesName;
  }, function(newValue, oldValue) {
    if ($scope.selectcommunesName) {


      CommunesService.getCenter(function(error, infoCommunes) {
        if (error) {
          $scope.error = error;
        }

        $scope.infoCommunes = infoCommunes;
        $scope.map.center = {
          lng: infoCommunes.center.coordinates[0],
          lat: infoCommunes.center.coordinates[1],
          zoom: 14
        };

      }, $scope.selectcommunesName.title)

    };
  });

  // Filtrer flower
  $scope.$watch(function() {
    return $scope.selectespecesName;
  }, function(newValue, oldValue) {
    if ($scope.selectespecesName) {

      var selecFleur = $scope.selectespecesName.originalObject.espece;

      leafletData.getMap().then(function(map) {

        map.eachLayer(function(layer) {
          if (layer.feature) {
            if (layer.feature.properties.flores) {
              if (layer.feature.properties.flores) {
                var tabFleur = layer.feature.properties.flores
                angular.forEach(tabFleur, function(item, key) {
                  if (item.espece == selecFleur) {
                    layer.setStyle({
                      color: 'red'
                    });
                  };
                })
              };
            }
          };
        });

      });
    }
  });



  // Autocomplete communes

  CommunesService.getName(function(error, communesName) {
    if (error) {
      $scope.error = error;
    }

    angular.forEach(communesName, function(item, key) {

      $scope.communesName.push(item.properties);
    })


  });

  FloreService.getEspece(function(error, especes) {
    if (error) {
      $scope.error = error;
    }

    // $scope.especesName = especes;
    var tab = [];
    angular.forEach(especes, function(esp, key) {

      if (!_.contains(tab, esp.espece)) {
        tab.push(esp.espece);
        $scope.especesName.push(esp);
      }

    })



  });

  // Display commune

  var callback = function(error, zones) {
    if (error) {
      $scope.error = error;
    }
    $scope.zones = zones;
    addStartZones(zones);


  }

  ZonesService.get(callback);

  $scope.restoreZones = function() {

    leafletData.getMap().then(function(map) {


      $scope.selectespecesName = "";
      map.eachLayer(function(layer) {
        if (layer.feature) {
          if (layer.feature.properties.flores) {
            layer.setStyle({
              color: 'blue'
            });
          }
        }
      });

    });

  };

  function addSpecificZones(layerGeoJson) {
    leafletData.getMap().then(function(map) {

      map.eachLayer(function(layer) {

        if (layer.feature.properties.flores) {
          if (layer.feature.properties.flores) {
            var tabFleur = layer.feature.properties.flores
            angular.forEach(tabFleur, function(item, key) {
              if (item.espece == selecFleur) {
                validate = true;
              };
            })
          };
        }

      });


      var layerZone = addLayerGeojson(layerGeoJson);

      map.eachLayer(function(layer) {
        if (!_.contains(bLayerId, layer._leaflet_id)) {
          map.removeLayer(layer);
        }
      });

      map.addLayer(layerZone);
    });
  }

  function addStartZones(layerGeoJson) {
    leafletData.getMap().then(function(map) {


      map.eachLayer(function(layer) {
        bLayerId.push(layer._leaflet_id);
      });
      var layerZone = addLayerGeojson(layerGeoJson);
      map.addLayer(layerZone);

      $scope.layers = baselayers;

            L.mapbox.accessToken = 'pk.eyJ1IjoiZnBsb21iIiwiYSI6ImJwRUF2ZlkifQ.OIuXY-qgnEBzcnYwXg8imw';
      var map = L.mapbox.map('map')
        .on('ready', function() {
          new L.Control.MiniMap(L.mapbox.tileLayer('map'))
            .addTo(map);
        });
    });


  }

  function addLayerGeojson(layerGeoJson) {

    var layerZone = L.geoJson(layerGeoJson, {


      style: function(feature) {
        return feature.properties.style;
      },
      onEachFeature: function(feature, layer) {

        if (feature.properties.flores) {

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

    return layerZone;

  }
});


app.factory("FloreService", function($http) {

  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return {
    getEspece: function(callback) {
      $http.get(apiUrl + "/flores/espece", config).success(function(data) {
        var zone = data;
        callback(null, zone);
      }).error(function(error) {
        callback(error);
      });
    }
  };
});


app.factory("ZonesService", function($http) {

  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return {
    post: function(callback, newZone) {
      $http.post(apiUrl + "/zones", {
        "type": newZone.type,
        "proprietes": newZone.proprietes,
        "loc": newZone.geometry,
      }, config).success(function(data) {
        zone = data;
        callback(null, zone);
      }).error(function(error) {
        callback(error);
      });
    },
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

app.factory("CommunesService", function($http) {

  var config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return {
    getName: function(callback) {
      $http.get(apiUrl + "/communes/name", config).success(function(data) {
        var zone = data;
        callback(null, zone);
      }).error(function(error) {
        callback(error);
      });
    },
    getCenter: function(callback, name) {
      $http.get(apiUrl + "/communes/center?name=" + name, config).success(function(data) {
        var infoCommunes = data;
        callback(null, infoCommunes);
      }).error(function(error) {
        callback(error);
      });
    }
  };
});



/////////////////////////////////////////
////////// Draw Control ////////////////
////////////////////////////////////////
//  $scope.controls = {};

//  $scope.controls.draw = {};

//  leafletData.getMap().then(function(map) {
//    var drawnItems = $scope.controls.edit.featureGroup;

//    L.geoJson(zonesTalus).addTo(map);

//    map.on('draw:created', function(e) {
//      var layer = e.layer;

//      drawnItems.addLayer(layer);
// //


//      var newZone = layer.toGeoJSON();
//      newZone.properties.commune = "Les clees";
//      console.log(newZone);
//       console.log(newZone.type);
//      console.log(newZone.properties);

//     console.log(JSON.stringify(newZone));

//      // var callback = function(error, zoneSaved) {
//      //   if (error) {
//      //     $scope.error = error;
//      //   }
//      //   console.log(zoneSaved);
//      //       }
//   ZoneService.post(callback, newZone);
// };
//    });
//  });