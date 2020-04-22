var express = require('express');
var router = express.Router();


/* GET home page. */
router.showHome = function(req, res, next) {
    res.render('index', { title: 'This Is The Homepage' , pageTitle: 'Home'});
}

module.exports = router;
