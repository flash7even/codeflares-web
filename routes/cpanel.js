'use strict'

var express = require('express');
var router = express.Router();
var config = require('../config.js');
const axios = require('axios');
require('log-timestamp');

var logout_url = config.server_host + 'auth/logout/at'
var blog_server = require('./servers/blog_services.js');
var user_server = require('./servers/user_services.js');
var follower_server = require('./servers/follower_services.js');
var contact_server = require('./servers/contact_us_services.js');
var jshelper = require('./servers/jshelper.js');
var system_server = require('./servers/system_services.js');


router.showUserControl = async function(req, res, next) {
    console.log('showUserControl called')
    await system_server.verifyAccessRole(req, res, 'moderator')
    var data = system_server.toast_update(req, {})
    res.render('control_user', data);
}

router.updateUserControl = async function(req, res, next) {
    console.log('updateUserControl called')
    await system_server.verifyAccessRole(req, res, 'moderator')
    var url = req.url
    var words = url.split("/");
    var user_id = words[words.length-2]
    var user_details = await user_server.getUserDetails(res, req, user_id)
    res.render('control_user_profile', user_details);
}

router.updateUserControlSubmit = async function(req, res, next) {
    console.log('updateUserControlSubmit called')
    await system_server.verifyAccessRole(req, res, 'moderator')
    var url = req.url
    var words = url.split("/");
    var user_id = words[words.length-2]
    await user_server.updateUserControl(res, req, req.body, user_id);
    system_server.add_toast(req, "User profile has been updated.")
    jshelper.sleep(1000)
    res.redirect('/control/panel/user/');
}

module.exports = router;
