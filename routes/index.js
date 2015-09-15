var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

var isFirstTime = function (req, res, next) {

};

module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) {
    res.render('index.ejs', { message: req.flash('message') });
  });


  router.get('/home', isAuthenticated, function(req, res){
    console.log(req.user.phone_no);
    if(req.user.phone_no != undefined)
    res.render('profile.ejs', { user: req.user });
  else
    res.redirect('/first-time');
  });

  router.get('/first-time', isAuthenticated, function(req,res){
      res.render('first-time.ejs');
  });

  router.post('/first-time', isAuthenticated, function(req,res){
      console.log(req.body);
      process.nextTick(function(){
        User.findById(req.user._id, function(err, user){
          if(err){
            res.send(err);
          }
          user.phone_no = req.body.phone_no;
          user.save();
        });
      });
      console.log(req.user.phone_no);
      req.flash('message','Successfully Signed in, Log in to Continue');
      res.redirect('/');
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
};
