var question = require('../models/questions.json');

var router = require('express').Router();

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

router.get('/', isAuthenticated, function(req, res){
  res.render('pre-question.ejs', {q_no: question[0].Number, q_stat: question[0].Question});
});

router.post('/', isAuthenticated, function(req, res){
  if(req.body.answer != question[0].Anwer)
    res.redirect('/pre-quiz');

  req.flash('message', '2');
  res.redirect('/home');
}
);
module.exports = router;
