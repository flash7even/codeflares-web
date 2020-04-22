var express = require('express');
var router = express.Router();


/* GET home page. */
router.showHome = function(req, res, next) {
    res.render('index', { title: 'This Is The Homepage' , pageTitle: 'Home'});
}

router.showLogIn = function(req, res, next) {
    res.render('login', {});
}

router.showSignUp = function(req, res, next) {
    res.render('signup', {});
}

module.exports = router;
