// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	GeoJSON = require('mongoose-geojson-schema');


var ZoneSchema = new Schema({
	type: String,
	proprietes :[{
	}
	]
	// geometry: {
	// 	type:GeoJSON.MultiLineString
	// }
});

ZoneSchema.index({
	geomerty: '2dsphere'
});

ZoneSchema.virtual('date')
	.get(function() {
		return this._id.getTimestamp();
	});

mongoose.model('Zone', ZoneSchema);