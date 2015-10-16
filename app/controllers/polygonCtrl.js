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

  //  var polygon = new Polygon();

  //    console.log(polygon);
  //  polygon.properties = req.body.polygon.properties;
  //   polygon.geometry = req.body.polygon.geometry;

  //   console.log(polygon);

  // polygon.save(function(err, polySaved) {
  //   if (err) return validationError(res, err);
  //   return res.status(200).json(polySaved).end();
  // });
})

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