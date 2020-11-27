var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HeroSchema = new Schema(
	{
		name: {type: String, required: true},
		age: {type: Number, min: 5, max: 120 }
	}
);

const HeroModel = mongoose.model('heroes', HeroSchema);

//Export model
module.exports = HeroModel;
