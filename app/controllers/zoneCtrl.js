var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Zone = mongoose.model('Zone'),
  _ = require('underscore');

module.exports = function(app) {
  app.use('/api/zones', router);
};

function convertZone(zone, ownerData) {
  var zoneConverted = {
    id: zone.id,
    geometry: zone.geometry,
    type: zone.type,
    proprietes: zone.proprietes,
  }



  return zoneConverted;
}


router.route('/')
  .get(function(req, res, next) {

    Zone.find()
      .exec(function(err, zones) {
        if (err) return next(err);
        res.json(_.map(zones, function(zone) {
          return convertZone(zone);
        }));
      });

  })

.post(function(req, res, next) {
  var zone = new Zone({
    "type": req.type,
    "proprietes": req.proprietes
    //"geometry": req.geometry
  });

  zone.save(function(err, zoneSaved) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.status(201).json(convertZone(zoneSaved));

  });
});