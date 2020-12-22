var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var Schema = mongoose.Schema;

var UserSchema = new Schema(
	{
		email: {type: String, required: true},
		password: {type: String}
	}
);

UserSchema.methods.generateHash = function(password) {
	//return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	return bcrypt.hash(password, saltRounds).then((hashed) => {
		console.log("Hashed password: " + hashedPass);
		return hashed;
	});
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
	return bcrypt.compare(password, this.password).then(function(result) {
		console.log("Hashed password comparison: " + result);
		return result;
	});
	
};

const UserModel = mongoose.model('users', UserSchema);

//Export model
module.exports = UserModel;
