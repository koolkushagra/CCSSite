var LocalStrategy  = require('passport-local').Strategy;
var User = require('../models/user');
var Answers = require('../models/answers.js');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            User.findOne({ 'reg_no' :  username },
                function(err, user) {
                    if (err)
                        return done(err);
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));
                    }
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }

                    return done(null, user);
                }
            );

        })
    );


    passport.use('signup', new LocalStrategy({
              passReqToCallback : true // allows us to pass back the entire request to the callback
          },
          function(req, username, password, done) {

              findOrCreateUser = function(){
                  User.findOne({ 'reg_no' :  username }, function(err, user) {
                      // In case of any error, return using the done method
                      if (err){
                          console.log('Error in SignUp: '+err);
                          return done(err);
                      }
                      // already exists
                      if (user) {
                          console.log('User already exists with username: '+username);
                          return done(null, false, req.flash('message','User Already Exists'));
                      } else {
                          // if there is no user with that email
                          // create the user
                          var newUser = new User();

                          // set the user's local credentials
                          newUser.reg_no = username;
                          newUser.password = createHash(password);
                          newUser.fb.email = req.param('email');
                          newUser.fb.display_name = req.param('name');
                				  newUser.isFemale = req.param('sex');
													newUser.phone_no = req.param('phone_no');
													newUser.bio.info1 = req.param('message')[0];
													newUser.bio.info2 = req.param('message')[1];
													newUser.bio.info3 = req.param('message')[2];

                          // save the user
                          newUser.save(function(err) {
                              if (err){
                                  console.log('Error in Saving user: '+err);
                                  throw err;
                              }
															var newAnsw = new Answers({'reg_no': username});
												      newAnsw.save();
                              console.log('User Registration succesful');
                              return done(null, newUser);
                          });
                      }
                  });
              };
              // Delay the execution of findOrCreateUser and execute the method
              // in the next tick of the event loop
              process.nextTick(findOrCreateUser);
          })
      );

      // Generates hash using bCrypt
      var createHash = function(password){
          return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
      }


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

};
