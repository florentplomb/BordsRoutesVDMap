var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Polygon = mongoose.model('Polygon'),
  Zone = mongoose.model('Zone'),
  Commune = mongoose.model('Commune'),
  _ = require('underscore');

module.exports = function(app) {
  app.use('/api/polygons', router);

};

var validationError = function(res, err) {
  return res.json(422, err);
};

router.route("/")
  .get(function(req, res, next) {
    Polygon.find()
      .populate("properties.flores")
      .populate({
        path: 'properties.communes',
        select: 'properties.NAME -_id',
      })
      .exec(function(err, zones) {
        if (err) return next(err);

        return res.status(200).json(zones)
      });

  })

.post(function(req, res, next) {



  //    console.log(polygon);
  //  polygon.properties = req.body.polygon.properties;
  //   polygon.geometry = req.body.polygon.geometry;

  //   console.log(polygon);

  // polygon.save(function(err, polySaved) {
  //   if (err) return validationError(res, err);
  //   return res.status(200).json(polySaved).end();
  // });
})


router.route("/updateData")
  .post(function(req, res, next) {
    if (!req.body.polygon) return res.status(400).json({
      message: 'bad request '
    }).end();

    Polygon.findById(req.body.polygon._id)
      .select("properties")
      .exec(function(err, poly) {
        if (err) return res.status(400).json("poly introuvable");

        if (req.body.polygon.properties.ENTRETIEN) {
          poly.properties.ENTRETIEN = req.body.polygon.properties.ENTRETIEN;
        } else {
          poly.properties.ENTRETIEN = "";
        }
        if (req.body.polygon.properties.DESCRIPTIO) {
          poly.properties.DESCRIPTIO = req.body.polygon.properties.DESCRIPTIO;
        } else {
          poly.properties.DESCRIPTIO = "";
        }
        if (req.body.polygon.properties.CANTONALE) {
          poly.properties.CANTONALE = req.body.polygon.properties.CANTONALE;

        } else {
          poly.properties.CANTONALE = "";

        }
        if (req.body.polygon.properties.TYPE) {
          poly.properties.TYPE = req.body.polygon.properties.TYPE;
        } else {
          poly.properties.TYPE = "";

        }
        if (req.body.polygon.properties.FIABILITE) {
          poly.properties.FIABILITE = req.body.polygon.properties.FIABILITE;

        } else {
          poly.properties.FIABILITE = "";

        }
        if (req.body.polygon.properties.flores) {

          poly.properties.flores = req.body.polygon.properties.flores;

        } else {
          poly.properties.flores = [];

        }

        var myDate = new Date();
        myDate.setHours(myDate.getHours() + 2);
        poly.properties.lastUpdate_at = myDate.toJSON();

        poly.save(function(err, polySave) {
          if (err) return validationError(res, err);
          return res.status(200).json(polySave);
        });


      })

  });


router.route("/fromline")
  .post(function(req, res, next) {
    if (!req.body.polygon) return res.status(400).json({
      message: 'bad request '
    }).end();

    var polygon = new Polygon();

    console.log(req.body.polygon.lineId);

    Zone.findById(req.body.polygon.lineId)
      .select("properties")
      .exec(function(err, zone) {
        if (err) return res.status(400).json("zone introuvable");
        polygon.properties = zone.properties;

        polygon.properties.communes = [];
        polygon.geometry = req.body.polygon.geometry;

        Commune.find({
            geometry: {
              $geoIntersects: {
                $geometry: polygon.geometry
              }
            }
          })
          .exec(function(err, communes) {
            if (err) return next(err);
            communes.forEach(function(commune) {
              //  if (_.contains(zone.properties.communes, commune.id)) {
              polygon.properties.communes.push(commune.id);

              //  }
            });

            polygon.save(function(err, poly) {
              if (err) return validationError(res, err);
              return res.status(200).json(poly);
            });

          });

      });

  });