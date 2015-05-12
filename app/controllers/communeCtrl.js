var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Commune = mongoose.model('Commune'),
  Zone = mongoose.model('Zone'),
  _ = require('underscore'),
  polygonCenter = require('geojson-polygon-center'),
  geoJsonTool = require('geojson-tools');



module.exports = function(app) {
  app.use('/api/communes', router);
};

var empty = "empty";

function convertCommune(commune, ownerData) {
  var communeConverted = {
    id: commune.id,
    geometry: commune.geometry,
    type: commune.type,
    properties: commune.properties,
  }

  return communeConverted;
}


router.route('/')
  .get(function(req, res, next) {
    Commune.find()

    .exec(function(err, communes) {
      if (err) return next(err);
      if (!communes) {
        return res.json(204, empty);
      };
      res.json(_.map(communes, function(commune) {
        return convertCommune(commune);
      }));
    });

  })



router.route('/name')
  .get(function(req, res, next) {
    Commune.find()
      .select('properties.NAME')
      .exec(function(err, communes) {
        if (err) return next(err);
        if (!communes) {
          return res.json(204, empty);
        };
        return res.status(200).json(communes)
      });

  });

router.route('/center')
  .get(function(req, res, next) {
    if (!req.query.name) {
      return res.json(404, empty);
    };
    Commune.findOne({
        "properties.NAME": req.query.name
      })
      .select('properties.NAME geometry')
      .exec(function(err, commune) {
        if (err) return next(err);
        if (!commune) {
          return res.json(204, empty);
        };
        var center = polygonCenter(commune.geometry)

        Zone.find({
            geometry: {
              $geoIntersects: {
                $geometry: commune.geometry
              }
            }
          })
          .exec(function(err, zones) {
            console.log("Nombre de talus intersect :" + _.size(zones));

            var distTot = 0;
            zones.forEach(function(zone) {
              var dist = 0;
              var zone = zone.geometry.coordinates[0];
              dist = geoJsonTool.getDistance(zone);
              distTot = dist + distTot;
            });

            // console.log(zones[0].geometry.coordinates);
            // console.log("distance talus:" + geoJsonTool.getDistance(zones[0].geometry.coordinates));

            var centerDist = {};

            centerDist.center = center;
            centerDist.distTot = distTot;

            return res.status(200).json(centerDist)


          });



      });

  });

router.route('/:id')
  .get(function(req, res, next) {
    Commune.findById(req.params.id)
      .exec(function(err, commune) {
        if (err) return next(err);
        if (!commune) {
          return res.json(204, empty);
        };
        return res.json(200, commune);
      });
  });