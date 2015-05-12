var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Commune = mongoose.model('Commune'),
  _ = require('underscore');

module.exports = function(app) {
  app.use('/api/communes', router);
};

function convertCommune(commune, ownerData) {
  var communeConverted = {
    id: commune.id,
    geometry: commune.geometry,
    type: commune.type,
    properties: commune.properties,
  }



  return communeConverted;
}


router.route('/name')
  .get(function(req, res, next) {
    Commune.find()
    .select('properties.NAME')
      .exec(function(err, communes) {
        if (err) return next(err);
        res.json(_.map(communes, function(commune) {
          return convertCommune(commune);
        }));
      });

  })

.post(function(req, res, next) {
  console.log(req.body);
  var commune = new Commune({
   type : req.body.type,
   properties : req.body.properties
  });

  commune.save(function(err, communeSaved) {
    if (err) {
      return res.status(400).send(err.message);
    }
    res.status(201).json(convertCommune(communeSaved.commune.geometry));

  });
});

router.route('/:id')
  .get(function(req, res, next) {
    Commune.findById(req.params.id)
    .exec(function(err, commune) {
      res.json(converterService.convertCommune(commune));
    });
  })