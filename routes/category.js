var express = require('express');
var router = express.Router();


router.addCategoryForm = function(req, res, next) {
    res.render('add_category', {});
}
router.categorySubmit = function(req, res, next) {
    // Submit data to server (req.data)
    res.redirect('/');
}

module.exports = router;
