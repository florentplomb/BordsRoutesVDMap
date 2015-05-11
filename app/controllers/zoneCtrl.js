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
    properties: zone.properties,
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
  console.log(req.body);
  var zone = new Zone({
   type : req.body.type,
   properties : req.body.properties
  });

  zone.save(function(err, zoneSaved) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.status(201).json(convertZone(zoneSaved.zone.geometry));

  });
});