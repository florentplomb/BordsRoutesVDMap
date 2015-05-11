// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	GeoJSON = require('mongoose-geojson-schema');


var ZoneSchema = new Schema({
 type: String,
 properties: Schema.Types.Mixed,
 geometry: Schema.Types.Mixed
});

ZoneSchema.index({
	zone:{
		geomerty: '2dsphere'
	}
});

ZoneSchema.virtual('date')
	.get(function() {
		return this._id.getTimestamp();
	});

mongoose.model('Zone', ZoneSchema);