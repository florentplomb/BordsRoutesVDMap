var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Flore = mongoose.model('Flore'),
	_ = require('underscore'),
	 Commune = mongoose.model('Commune');


module.exports = function(app) {
	app.use('/draw', router);
	//  app.use(express.static('public'));
};


router.route('/')
	.get(function(req, res, next) {
		res.sendfile('public/draw.html')
	});




router.route('/locZone')
	.post(function(req, res, next) {

		console.log(req.body);

		// if (!req.body.zone) return res.status(400).json({
		// 	message: 'bad request'
		// }).end();

var zone = req.body.zone;
		var communeName = [];
		Commune.find({
				geometry: {
					$geoIntersects: {
						$geometry: zone.geometry
					}
				}
			})
			.select("properties _id")
			.exec(function(err, communes) {
				if (err) return next(err);
				communes.forEach(function(commune) {
				communeName.push(commune);
				});
				return res.status(200).json(communeName)

			});



	});