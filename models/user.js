
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	fb: {
		email: String,
		display_name: String,
		photo: String,
		id: String,
		access_token: String,
	},
	bio:{
		info1: String,
		info2: String,
		info3: String
	},
	phone_no: String,
	reg_no: String,
	password: String,
	isFemale: Boolean,
	tech_taken: {type:Boolean, default: false},
	mang_taken: {type:Boolean, default: false},
	crea_taken: {type:Boolean, default: false}
});
