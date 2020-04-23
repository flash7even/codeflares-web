var express = require('express');
var router = express.Router();


router.addProblemForm = function(req, res, next) {
    res.render('add_problem', {});
}

module.exports = router;
