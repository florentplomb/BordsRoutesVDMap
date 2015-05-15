// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ZoneSchema = new Schema({
 type: String,
 properties: {
 	flores: [ { type: Schema.Types.ObjectId, ref: 'Flore' } ],
 	communes: [ { type: Schema.Types.ObjectId, ref: 'Commune' } ],
 	PLUMETTAZ : String,
 	FIABILITE : String,
 	ID_MAPINFO: Number,
 	TYPE:String,
 	COMMUNE:String,
 	LOCALISATI : String,
    CANTONALE : String,
    DESCRIPTIO : String,
    ENTRETIEN : String
 },
 geometry: Schema.Types.Mixed,

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