// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var CommuneSchema = new Schema({
 type: String,
 properties: Schema.Types.Mixed,
 geometry: Schema.Types.Mixed
});

CommuneSchema.index({
	commune:{
		geomerty: '2dsphere'
	}
});

CommuneSchema.virtual('date')
	.get(function() {
		return this._id.getTimestamp();
	});

mongoose.model('Commune', CommuneSchema);