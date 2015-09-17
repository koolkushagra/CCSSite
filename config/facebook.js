var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var fbConfig = require('./fb.js');

module.exports = function(passport) {

    passport.use('facebook', new FacebookStrategy({
        clientID        : fbConfig.appID,
        clientSecret    : fbConfig.appSecret,
        callbackURL     : fbConfig.callbackUrl
 , profileFields: ['id', 'emails', 'name', 'displayName', 'picture.type(large)']    },

    function(access_token, refresh_token, profile, done) {

  //  	console.log('profile', profile);


		process.nextTick(function() {

			// find the user in the database based on their facebook id
	        User.findOne({ 'fb.id' : profile.id }, function(err, user) {


	            if (err)
	                return done(err);

	            if (user) {
	                return done(null, user);
	            } else {

	                var newUser = new User();

	                newUser.fb.id    = profile.id;
	                newUser.fb.access_token = access_token;
	                newUser.fb.firstName  = profile.name.givenName;
	                newUser.fb.lastName = profile.name.familyName;
	                newUser.fb.email = profile.emails[0].value;
	                newUser.fb.photo = profile.photos[0].value;

					// save our user to the database
	                newUser.save(function(err) {
	                    if (err)
	                        throw err;

	                    // if successful, return the new user
	                    return done(null, newUser);
	                });
	            }

	        });
        });

    }));

};
