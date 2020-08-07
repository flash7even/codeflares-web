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


router.showHome = async function(req, res, next) {
    console.log('showHome called')
    let data = await blog_server.getBlogList(res, req, {'status': 'homepage'});
    let top_rated_users = await user_server.topRatedUsers(res, req, {'size': 10})
    let top_solved_users = await user_server.topSolverUsers(res, req, {'size': 10})
    let top_contributors = await user_server.topContributors(res, req, {'size': 10})
    data['top_rated_users'] = top_rated_users.user_list
    data['top_solved_users'] = top_solved_users.user_list
    data['top_contributors'] = top_contributors.user_list
    data = system_server.toast_update(req, data)
    //data['alert_list'] = system_server.clean_session_alert(req)
    res.render('index', data);
}

router.leaderboard = async function(req, res, next) {
    console.log('leaderboard called')
    res.render('leaderboard', {});
}

router.contributorsList = async function(req, res, next) {
    console.log('contributorsList called')
    res.render('leaderboard_contributors', {});
}

router.topSolverList = async function(req, res, next) {
    console.log('topSolverList called')
    res.render('leaderboard_top_solvers', {});
}

router.showLogIn = async function(req, res, next) {
    console.log('showLogIn called')
    var data = system_server.toast_update(req, {})
    res.render('login', data);
}

router.changePassword = async function(req, res, next) {
    console.log('changePassword called')
    res.render('change_password', {});
}

router.changePasswordSubmit = async function(req, res, next) {
    console.log('changePasswordSubmit called')
    var sess = req.session;
    await user_server.change_password(res, req, sess.user_id, req.body)
    system_server.add_toast(req, "Your password has been updated.")
    res.redirect('/profile/' + sess.username + '/');
}

router.showForgotPassword = async function(req, res, next) {
    console.log('showForgotPassword called')
    res.render('forgot_password', {});
}

router.showForgotPasswordSubmit = async function(req, res, next) {
    console.log('showForgotPasswordSubmit called')
    var data = req.body
    await user_server.forgot_password_request(res, req, data)
    data = {}
    data.toast_data = {
        "toast_text": "Request submitted. Please check your email to reser your password.",
        "toast_type": "primary"
    }
    res.render('forgot_password', data);
}

router.ActivateUserAccountClicked = async function(req, res, next) {
    console.log('ActivateUserAccountClicked called')
    var url = req.url
    var words = url.split("/");
    var token = words[words.length-1]
    await user_server.activate_user_account(res, req, token)
    var data = {}
    data.toast_data = {
        "toast_text": "Your account has been activated, you can now proceed to login",
        "toast_type": "primary"
    }
    res.render('login', data);
}

router.ForgotPasswordClicked = async function(req, res, next) {
    console.log('ForgotPasswordClicked called')
    var url = req.url
    var words = url.split("/");
    var token = words[words.length-1]
    var resp = await user_server.forgot_password_token_confirm(res, req, token)
    var data = {
        "token": token,
        "user_id": resp.user_id
    }
    res.render('forgot_password_reset', data);
}

router.ForgotPasswordConfirm = async function(req, res, next) {
    console.log('ForgotPasswordConfirm called')
    var url = req.url
    var words = url.split("/");
    var token = words[words.length-1]
    var user_id = words[words.length-2]

    var user_data = req.body
    var data = {
        "new_password": user_data.password
    }
    await user_server.forgot_password_reset(res, req, user_id, data, token)
    system_server.add_toast(req, "Your password has been updated, you can now proceed to login.")
    res.redirect('/login/');
}

router.logInSubmit = async function(req, res, next) {
    console.log('logInSubmit called')
    var user_data = req.body
    var login_data = await user_server.logIn(res, req, user_data)

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

router.showSignUp = async function(req, res, next) {
    console.log('showSignUp called')
    var university_list = await user_server.universityList(res, req)
    var country_list = await user_server.countryList(res, req)
    var data = system_server.toast_update(req, {})
    data['university_list'] = university_list.university_list
    data['country_list'] = country_list.country_list
    res.render('signup', data);
}

router.logOutSubmit = async function(req, res, next) {
    console.log('logOutSubmit called')
    try{
        var sess = req.session;
        if(sess.access_token){
            var access_token = sess.access_token
            const config = {
                headers: { Authorization: `Bearer ${access_token}` }
            };
            var response = await axios.post(logout_url, {}, config)
            .catch(error => {
                res.render('error_page', {});
            })
            req.session.destroy();
        }
        res.redirect('/login/');
    } catch (ex){
        res.render('error_page', {});
    }
}

router.signUpSubmit = async function(req, res, next) {
    console.log('signUpSubmit called')
    var user_data = req.body
    user_data['user_role'] = 'contestant'
    delete user_data['confirm_password']
    await user_server.postUser(res, req, user_data)

    var data = {}
    data.toast_data = {
        "toast_text": "Request submitted. Please check your email to activate your account.",
        "toast_type": "primary"
    }
    res.render('signup', data);
}

router.showUserProfile = async function(req, res, next) {
    console.log('showUserProfile called')
    var url = req.url
    var words = url.split("/");
    var user_name = words[words.length-2]
    var sess = req.session;
    var param = {
        'username': user_name
    }
    var resp = await user_server.searchUser(res, req, param)
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
    user_details['profile-page'] = true
    user_details = system_server.toast_update(req, user_details)
    res.render('user_profile', user_details);
}

router.showUserSubmissionHistory = async function(req, res, next) {
    console.log('showUserSubmissionHistory called')
    var url = req.url
    var words = url.split("/");
    var user_handle = words[words.length-2]
    var param = {
        'username': user_handle
    }
    var resp = await user_server.searchUser(res, req, param)
    var user_details = resp.user_list[0];
    var user_id = user_details.id
    var submission_history = {}
    submission_history['user_handle'] = user_handle
    submission_history['id'] = user_details.id
    submission_history['user_skill_color'] = user_details.skill_color
    submission_history['skill_color'] = submission_history.user_skill_color
    submission_history['username'] = submission_history.user_handle
    submission_history['submission-page'] = true
    res.render('user_profile', submission_history);
}

router.updateUserSettings = async function(req, res, next) {
    console.log('updateUserSettings called')
    var sess = req.session;
    var param = {
        "status": "confirmed",
        "team_type": "team"
    }
    let team_list = await user_server.getTeamList(res, req, sess.username, param);
    res.render('update_user_settings', team_list);
}

router.updateUserSettingsSubmit = async function(req, res, next) {
    console.log('updateUserSettingsSubmit called')
    var settings_data = {
        'settings': req.body
    }
    var sess = req.session;
    var user_id = sess.user_id
    await user_server.updateUser(res, req, settings_data, user_id);
    system_server.add_toast(req, "Updated settings successfully")
    res.redirect('/');
}

router.updateUserProfile = async function(req, res, next) {
    console.log('updateUserProfile called')
    var sess = req.session;
    var user_details = await user_server.getUserDetails(res, req, sess.user_id)
    var university_list = await user_server.universityList(res, req)
    var country_list = await user_server.countryList(res, req)
    user_details['university_list'] = university_list.university_list
    user_details['country_list'] = country_list.country_list
    res.render('update_user_profile', user_details);
}

router.updateUserProfileSubmit = async function(req, res, next) {
    console.log('updateUserProfileSubmit called')
    var sess = req.session;
    await user_server.updateUser(res, req, req.body, sess.user_id);
    system_server.add_toast(req, "Your profile has been updated.")
    res.redirect('/profile/' + sess.username + '/');
}


router.syncUserData = async function(req, res, next) {
    console.log('updateUserProfileSubmit called')
    var url = req.url
    var words = url.split("/");
    var user_id = words[words.length-2]
    var response = await user_server.syncUser(res, req, user_id);
    var sess = req.session;
    system_server.add_toast(req, "Your request to sync user data has been sent to the server. We will process the request shortly.")
    res.redirect('back');
}


router.contactUs = async function(req, res, next) {
    console.log('contactUs called')
    var sess = req.session;
    var user_details = {}
    if(sess.user_id){
        user_details = await user_server.getUserDetails(res, req, sess.user_id)
    }
    res.render('contact_us', user_details);
}


router.contactUsSubmit = async function(req, res, next) {
    console.log('contactUsSubmit called')
    await contact_server.postContactUs(res, req, req.body)
    res.redirect('/');
}


router.aboutUs = async function(req, res, next) {
    console.log('aboutUs called')
    res.render('about_us', {});
}

module.exports = router;
