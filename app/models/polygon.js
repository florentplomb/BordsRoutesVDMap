// Example model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var PolygonSchema = new Schema({
 type: {type: String, default: "Feature"},
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
    ENTRETIEN : String,
    created_at : {type: Date, default: Date.now},
    lastUpdate_at : {type: Date, default: Date.now}
 },
 geometry: Schema.Types.Mixed,

});

PolygonSchema.index({
	polygon:{
		geomerty: '2dsphere'
	}
});




mongoose.model('Polygon', PolygonSchema);