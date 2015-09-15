
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	fb: {
		id: String,
		access_token: String,
		firstName: String,
		lastName: String,
		email: String,
		display_name: String,
		photo: String
	},
	phone_no: String
});
