
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var FloreSchema = new Schema({
 talus_id:Number,
 ESPECE:String,
 ESPECE_DEF:String,
 NO_SISF_DEF:Number,
});



mongoose.model('Flore', FloreSchema);