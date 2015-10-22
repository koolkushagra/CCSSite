var express = require('express');
var router = express.Router();
var User = require('../models/user.js');
var Answers = require('../models/answers.js');
var techQuizData = require('../questions/question.json');
var mangQuizData = require('../questions/question2.json');
var creaQuizData = require('../questions/question3.json');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

var isNotAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated() == false)
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/home');
};

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

module.exports = function(passport){


  router.get('/',isNotAuthenticated , function(req, res) {
    res.render('index.ejs');
  });


  router.get('/home', isAuthenticated, function(req, res){
    console.log(req.user.phone_no);
    if(req.user.phone_no != undefined)
    res.render('profile.ejs', { user: req.user, message: req.flash('message') });
  else
    res.redirect('/first-time');
  });

  router.get('/first-time', isAuthenticated, function(req,res){
      res.render('first-time.ejs');
  });

  router.post('/first-time', isAuthenticated, function(req,res){
      //console.log(req.body);

      if(req.user.phone_no != undefined)
        res.redirect('/');
      process.nextTick(function(){
        User.findById(req.user._id, function(err, user){
          if(err){
            res.send(err);
          }
          user.phone_no = req.body.phone_no;
          user.reg_no = req.body.reg_no;
          user.save();
        });
      var newAnsw = new Answers({reg_no: req.body.reg_no});
      newAnsw.save();
      }
    );

    //  console.log(req.user.phone_no);
    //  req.flash('message','Successfully Signed in, Log in to Continue');
      res.redirect('/');
  });

  router.get('/edit',isAuthenticated, function(req, res) {
    res.render('edit.ejs', {email: req.user.fb.email, phone: req.user.phone_no});
  });

  router.get('/quiz/tech',isAuthenticated, function(req,res){
  //  if(req.user.tech_taken == false)
  //  {
    process.nextTick(function(){
      User.findById(req.user._id, function(err, user){
        if(err)
          res.send(err);
        user.tech_taken = true;

        user.save();
      });
    });
    req.session.f_type = 1;
    res.render('quiz.ejs');
//  }
//  else{
//    res.redirect('/');
//  }
  });

  router.get('/quiz/mang',isAuthenticated, function(req,res){
    if(req.user.mang_taken == false)
    {
    process.nextTick(function(){
      User.findById(req.user._id, function(err, user){
        if(err)
          res.send(err);
        user.mang_taken = true;

        user.save();
      });
    });
    req.session.f_type = 2;
    res.render('quiz.ejs');
  }
  else{
    res.redirect('/');
  }
  });

  router.get('/quiz/crea',isAuthenticated, function(req,res){
if(req.user.crea_taken == false)
{    process.nextTick(function(){
      User.findById(req.user._id, function(err, user){
        if(err)
          res.send(err);
        user.crea_taken = true;

        user.save();
      });
    });
    req.session.f_type = 3;
    res.render('quiz.ejs');
  }
  else{
    res.redirect('/');
  }
  });

  router.post('/edit',isAuthenticated, function(req,res){
    process.nextTick(function(){
      User.findById(req.user._id, function(err, user){
        if(err){
          res.send(err);
        }
        user.phone_no = req.body.phone_no;
        user.fb.email = req.body.email;
        user.save();
      });
      req._passport.session.user.phone_no = req.body.phone_no;
      req._passport.session.user.email = req.body.email;
    });
    req.flash('message', '1');
    res.redirect('/home');
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/begin', function(req, res) {
    res.render('signin.ejs');
  });

  router.post('/quiz/correct',function (req, res) {
    console.log(req.body);
    process.nextTick(function(){
    Answers.findOne({reg_no: req.user.reg_no},function(err, answers){
      if(err){
        res.send(err);
      }
      console.log(req.session);
      switch(req.session.f_type){
        case 1:
          answers.tech = req.body;
          break;
        case 2:
          answers.mang = req.body;
          break;
        case 3:
          answers.crea = req.body;
          break;
      }
      console.log(answers);
    answers.save();
    });
  });
  });

  router.get('/login/facebook',
      passport.authenticate('facebook',  { scope: [ 'email' ] } ));


  router.get('/login/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect : '/home',
        failureRedirect : '/'
      })
  );

  router.post('/login',function(req, res){
    console.log(req.body);
  });

  router.post('/signup',function(req, res){
    console.log(req.body);
  });


  router.get('/quiz/getdata',isAuthenticated,function(req, res){
    switch(req.session.f_type){
      case 1:
      //  shuffleArray(techQuizData);
        res.json(techQuizData);
        break;
      case 2:
    //  shuffleArray(mangQuizData);
      res.json(mangQuizData);
        break;
      case 3:
    //  shuffleArray(creaQuizData);
      res.json(creaQuizData);
        break;
    }
  });



  return router;
};
