'use strict'

var express = require('express');
var config = require('../config.js');
var router = express.Router();

var follower_server = require('./servers/follower_services.js');
var jshelper = require('./servers/jshelper.js');


router.followUser = async function(req, res, next) {
    console.log('followUser in controller called')
    var url = req.url
    var words = url.split("/");
    var user_id = words[words.length-2]
    var resp = await follower_server.followUser(res, req, user_id)
    console.log(resp)
    jshelper.sleep(1000);
    res.redirect('back');
}

router.unfollowUser = async function(req, res, next) {
    var url = req.url
    var words = url.split("/");
    var user_id = words[words.length-2]
    var resp = await follower_server.unfollowUser(res, req, user_id)
    console.log(resp)
    jshelper.sleep(1000);
    res.redirect('back');
}

module.exports = router;
