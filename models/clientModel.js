var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClientSchema = new Schema(
	{
		name: {type: String, required: true},
	}
);

const ClientModel = mongoose.model('clients', ClientSchema);

//Export model
module.exports = ClientModel;
