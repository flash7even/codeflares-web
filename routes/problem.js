var express = require('express');
var router = express.Router();


router.addProblemForm = function(req, res, next) {
    res.render('add_problem', {});
}

router.viewProblemList = function(req, res, next) {
    res.render('view_problem_list', {});
}

router.problemSubmit = function(req, res, next) {
    // Submit data to server (req.data)
    res.redirect('/');
}

module.exports = router;
