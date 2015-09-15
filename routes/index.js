var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index.ejs', { message: req.flash('message') });
  });


  router.get('/home', isAuthenticated, function(req, res){
    res.render('profile.ejs', { user: req.user });
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/login/facebook',
      passport.authenticate('facebook',  { scope: [ 'email' ] } ));


  router.get('/login/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect : '/home',
        failureRedirect : '/'
      })
  );


  return router;
}
