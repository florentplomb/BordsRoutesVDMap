'use strict';

var app = angular.module('app', ['leaflet-directive', 'angucomplete-alt', 'ngDialog']);
//var apiUrl = "http://localhost:3000/api";
//var apiUrl = "http://florentplomb.ch/api";
var apiUrl = "http://fleurs-vd.herokuapp.com/api";

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

app.controller('MapCtrl', function($scope, $filter, ngDialog, leafletData, ZonesService, CommunesService, $http, FloreService) {

  var zonesTalus = [];
  var yverdon = {
    lat: 46.841759385352,
    lng: 6.64475440979004,
    zoom: 10
  };
  var defaultStyle = {
    color: "#c5128a", // #02a6a6 //#ff7e61 //#d87c50 //#256aa6
    weight: 6,
    opacity: 0.8,

    fillColor: "blue"
  };
  var highlightStyle = {
    color: '#1072ac',

  };
  $scope.layers = {};
  $scope.nbrSelected = {};
  $scope.map = {};
  $scope.infoZone = {};
  $scope.events = {};
  $scope.communesName = [];
  $scope.especesName = [];
  $scope.map = {};
  $scope.map.markers = [];
  $scope.map.center = {};
  $scope.map.center = yverdon;
  // url MapBox

  ngDialog.open({
    template: 'pop.html',
    scope: $scope
  });



  var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "fplomb.685fc191";
  mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiZnBsb21iIiwiYSI6ImJwRUF2ZlkifQ.OIuXY-qgnEBzcnYwXg8imw";
  var baselayers = {
      baselayers: {
        osm: {
          name: 'OpenStreetMap',
          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          type: 'xyz'
        },
        mapbox_light: {
          name: 'Frontières communales',
          url: mapboxTileLayer,
          type: 'xyz',
          layerOptions: {
            apikey: 'pk.eyJ1IjoiYnVmYW51dm9scyIsImEiOiJLSURpX0pnIn0.2_9NrLz1U9bpwMQBhVk97Q',
            mapid: 'fplomb.685fc191'
          }
        },
        googleSatellite: {
          name: 'Google Satellite',
          layerType: 'SATELLITE',
          type: 'google'
        },
        googleRoadmap: {
          name: 'Google Streets',
          layerType: 'ROADMAP',
          type: 'google'
        },
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
        $scope.infoCommunes = infoCommunes
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
        var cpt = 0;
        map.eachLayer(function(layer) {
          if (layer.feature) {
            if (layer.feature.properties.flores) {
              if (layer.feature.properties.flores) {
                var tabFleur = layer.feature.properties.flores

                angular.forEach(tabFleur, function(item, key) {
                  if (item.espece == selecFleur) {

                    cpt++;
                    layer.setStyle({
                      color: '#ec971f'
                    });
                    $scope.nbrSelected = cpt;
                    layer.on("mouseover", function(e) {
                      // Change the style to the highlighted version
                      layer.setStyle(highlightStyle);
                      // Create a popup with a unique ID linked to this record
                    });
                    layer.on("mouseout", function(e) {
                      // Change the style to the highlighted version
                      layer.setStyle({
                        color: '#ec971f'
                      });
                      // Create a popup with a unique ID linked to this record
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
            layer.setStyle(defaultStyle)
            layer.on("mouseover", function(e) {
              // Change the style to the highlighted version
              layer.setStyle(highlightStyle);
              // Create a popup with a unique ID linked to this record
            });

            layer.on("mouseout", function(e) {
              // Change the style to the highlighted version
              layer.setStyle(defaultStyle);
              // Create a popup with a unique ID linked to this record

            });;
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
    });
  }

  function addStartZones(layerGeoJson) {
    leafletData.getMap().then(function(map) {
      var callback = function(error, layerZone) {
        if (error) {
          $scope.error = error;
        }
        map.addLayer(layerZone);
        $scope.layers = baselayers;
      }
      addLayerGeojson(callback, layerGeoJson);
    });
  }

  function addLayerGeojson(callback, layerGeoJson) {

    var layerZone = L.geoJson(layerGeoJson, {
      style: function(feature) {
        return feature.properties.style;
      },
      onEachFeature: function(feature, layer) {
        layer.setStyle(defaultStyle);
        layer.on("mouseover", function(e) {
          // Change the style to the highlighted version
          layer.setStyle(highlightStyle);
          // Create a popup with a unique ID linked to this record
        });
        layer.on("mouseout", function(e) {
          // Change the style to the highlighted version
          layer.setStyle(defaultStyle);
          // Create a popup with a unique ID linked to this record
        });



        layer.on('click', function(e) {

          var idZone = feature.properties.ID_MAPINFO;
          if (idZone < 10) {
            $scope.infoZone.id = "0000" + idZone;
          } else if (idZone < 99) {

            $scope.infoZone.id = "000" + idZone;

          } else {
            $scope.infoZone.id = "00" + idZone;
          }

          console.log($scope.infoZone.id);

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
    callback(null, layerZone);


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