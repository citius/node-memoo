'use strict';

var express = require('express');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/login', (req, res) => res.render('users/login'));
router.get('/signup', (req, res) => res.render('users/signup'));
router.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});
router.get('/is-exists', (req, res, next) => {
  User.checkEmail(req.query.email, (err, isExists) => {
    var result = {
      email: req.query.email,
      exits: isExists
    };
    
    if (isExists) {
      res.writeHead(409, 'Email уже существует', {'content-type': 'text/plain;charset=utf-8'});
      res.end();
    } else {
      res.status(200);
    }
  });
});

router.post('/signup', (req, res, next) => {
  var user = new User(req.body);
  user.save(function (err) {
    if (err) {
      if (err.name && err.name == 'ValidationError') {
        for (let attribute in err.errors) {
          req.flash('warning', err.errors[attribute].message);
        }
        return res.redirect('/users/signup');
      } else {
        return next(err);
      }
    } else {
      req.flash('success', 'You successfully registered.');
      return res.redirect('/users/login'); 
    }
  });
});

router.post('/signin',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  (req, res, next) => {
    if (!req.body.rememberMe) return next();
    
    User.Token.update(req.user, function (err, token) {
      if (err) return next(err);
      
      res.cookie('rememberMe', token, {
        path: '/', 
        httpOnly: true, 
        maxAge: req.app.get('config').rememberUserPeriod
      });
      
      return next();
    });
  },
  (req, res) => res.redirect('/')
);

module.exports = router;
