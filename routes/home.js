'use strict'

var express = require('express');
var router = express.Router();
var config = require('../config.js');
const axios = require('axios');

var logout_url = config.server_host + 'auth/logout/at'

var user_server = require('./servers/user_services.js');
var jshelper = require('./servers/jshelper.js');


router.showHome = async function(req, res, next) {
    var notification_data = {}

    var sess = req.session;
    var user_id = sess.user_id
    if(user_id){
        notification_data = await user_server.getAllNotification(res, req, {"size": 5}, sess.user_id)
    }
    console.log('notification_data: ')
    console.log(notification_data)
    res.render('index', notification_data);
}

router.showLogIn = function(req, res, next) {
    res.render('login', {});
}

router.logInSubmit = async function(req, res, next) {
    var user_data = req.body
    var login_data = await user_server.logIn(res, req, user_data)
    console.log(login_data)

    var sess = req.session;
    sess.username = login_data.username
    sess.email = login_data.email
    sess.full_name = login_data.full_name
    sess.user_role = login_data.user_role
    sess.user_id = login_data.id
    sess.access_token = login_data.access_token
    sess.refresh_token = login_data.refresh_token
    res.redirect('/');
}

router.showSignUp = function(req, res, next) {
    res.render('signup', {});
}

router.logOutSubmit = async function(req, res, next) {
    console.log('log out called')
    var sess = req.session;
    var access_token = sess.access_token
    console.log(access_token);
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    console.log(config)
    console.log("logout_url")
    console.log(logout_url)
    var response = await axios.post(logout_url, {}, config)
    .catch(error => {
        res.render('error_page', {});
    })
    req.session.destroy();
    console.log('log out done');
    res.redirect('/');
}

router.signUpSubmit = async function(req, res, next) {
    var user_data = req.body
    user_data['user_role'] = 'contestant'
    delete user_data['confirm_password']
    await user_server.postUser(res, req, user_data)
    res.render('login', {});
}

router.showUserProfile = async function(req, res, next) {
    var url = req.url
    console.log(url)
    var words = url.split("/");
    var user_name = words[words.length-1]
    console.log(user_name)

    var param = {
        'username': user_name
    }

    var resp = await user_server.searchUser(res, req, param)
    console.log(resp)

    var user_details = resp.user_list[0];
    console.log(user_details)
    res.render('user_profile', user_details);
}


router.updateUserSettings = async function(req, res, next) {
    var sess = req.session;
    var param = {
        "status": "confirmed",
        "team_type": "team"
    }
    let team_list = await user_server.getTeamList(res, req, sess.username, param);
    res.render('update_user_settings', team_list);
}

router.updateUserSettingsSubmit = async function(req, res, next) {
    var settings_data = {
        'settings': req.body
    }
    console.log(settings_data)
    var sess = req.session;
    var user_id = sess.user_id
    await user_server.updateUser(res, req, settings_data, user_id);
    res.redirect('/');
}

router.updateUserProfile = async function(req, res, next) {
    var sess = req.session;
    console.log('updateUserProfile controller')
    var user_details = await user_server.getUserDetails(res, req, sess.user_id)
    console.log(user_details)
    res.render('update_user_profile', user_details);
}

router.updateUserProfileSubmit = async function(req, res, next) {
    var sess = req.session;
    await user_server.updateUser(res, req, req.body, sess.user_id);
    res.redirect('/');
}

module.exports = router;
