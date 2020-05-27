'use strict'

var express = require('express');
var router = express.Router();
var config = require('../config.js');
const axios = require('axios');

var logout_url = config.server_host + 'auth/logout/at'

var blog_server = require('./servers/blog_services.js');
var user_server = require('./servers/user_services.js');
var follower_server = require('./servers/follower_services.js');
var jshelper = require('./servers/jshelper.js');
var system_server = require('./servers/system_services.js');


router.showHome = async function(req, res, next) {
    let data = await blog_server.getBlogList(res, req, {'status': 'homepage'});
    let top_rated_users = await user_server.topRatedUsers(res, req, {'size': 10})
    let top_solved_users = await user_server.topSolverUsers(res, req, {'size': 10})
    data['top_rated_users'] = top_rated_users.user_list
    data['top_solved_users'] = top_solved_users.user_list
    system_server.add_session_alert(req, "Welcome to CodeFlares. Please read our guideline before start.")
    data = system_server.toast_update(req, data)
    //data['alert_list'] = system_server.clean_session_alert(req)
    res.render('index', data);
}

router.leaderboard = async function(req, res, next) {
    let data = {}
    let top_rated_users = await user_server.topRatedUsers(res, req, {'size': 10})
    data['top_rated_users'] = top_rated_users.user_list
    res.render('leaderboard', data);
}

router.showLogIn = function(req, res, next) {
    var data = system_server.toast_update(req, {})
    res.render('login', data);
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
    sess.user_settings = login_data.settings
    system_server.add_toast(req, "Successfully logged in!", "success")
    res.redirect('/');
}

router.showSignUp = function(req, res, next) {
    var data = system_server.toast_update(req, {})
    res.render('signup', data);
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
    var toast_data = {
        'toast_data': {
            'toast_text': 'Logged out successfully! Hope to see you soon again.',
            'toast_type': 'info',
        }
    }
    res.render('login', toast_data);
}

router.signUpSubmit = async function(req, res, next) {
    var user_data = req.body
    user_data['user_role'] = 'contestant'
    delete user_data['confirm_password']
    await user_server.postUser(res, req, user_data)
    system_server.add_toast(req, "Registration successfully completed!")
    res.redirect('/login/');
}

router.showUserProfile = async function(req, res, next) {
    var url = req.url
    var words = url.split("/");
    var user_name = words[words.length-2]
    var sess = req.session;

    var param = {
        'username': user_name
    }

    var resp = await user_server.searchUser(res, req, param)
    console.log(resp)

    var user_details = resp.user_list[0];
    if(sess.user_id && sess.user_id != user_details.id){
        var follow_status = await follower_server.followStatus(res, req, user_details.id)
        if(follow_status.status == 'following'){
            user_details['following'] = true;
        }else{
            user_details['unfollowing'] = true;
        }
    }

    if(sess.user_id == user_details.id){
        user_details['own_profile'] = true;
    }
    user_details = system_server.toast_update(req, user_details)
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
    system_server.add_toast(req, "Updated settings successfully")
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
    system_server.add_toast(req, "Updated user data successfully")
    res.redirect('/');
}


router.syncUserData = async function(req, res, next) {
    console.log('syncUserData')
    var url = req.url
    console.log(url)
    var words = url.split("/");
    var user_id = words[words.length-2]
    var response = await user_server.syncUser(res, req, user_id);
    var sess = req.session;
    system_server.add_toast(req, "Your request to sync user data has been sent to the server. We will process the request shortly.")
    res.redirect('back');
}

module.exports = router;
