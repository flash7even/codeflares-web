'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var user_search_url = config.server_host + 'user/search'
var user_submit_url = config.server_host + 'user/'
var login_url = config.server_host + 'auth/login'
var logout_url = config.server_host + 'auth/logout/at'
var team_search_url = config.server_host + 'team/search/user/'





//----------------- Call to the server -------------------//

async function getTeamList(res, req, username, search_param) {
    console.log('getTeamList called');
    var post_url = team_search_url + username
    console.log("post_url: " + post_url)
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }

    console.log('getTeamList done');
    return response.data
}

async function searchUser(res, req, user_data) {
    console.log('searchUser called')
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    console.log("post_url: " + user_search_url)
    let response = await axios.post(user_search_url, user_data, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }

    console.log('searchUser completed')
    return response.data
}

async function logIn(res, req, data) {
    console.log('logIn called');
    console.log('Log in call to server')
    let response = await axios.post(login_url, data)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }

    console.log('logIn done');
    return response.data
}

async function updateUser(res, req, user_data, user_id) {
    console.log('updateUser called')
    var url = user_submit_url + user_id
    console.log("url: " + url)
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.put(url, user_data, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
}

async function postUser(res, req, user_data) {
    var post_url = user_submit_url
    console.log("post_url: " + post_url)
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, user_data, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
}











//----------------- Routes -------------------//

router.showHome = function(req, res, next) {
    res.render('index', { title: 'This Is The Homepage' , pageTitle: 'Home'});
}

router.showLogIn = function(req, res, next) {
    res.render('login', {});
}

router.logInSubmit = async function(req, res, next) {
    var user_data = req.body
    var login_data = await logIn(res, req, user_data)
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
    await postUser(res, req, user_data)
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

    var resp = await searchUser(res, req, param)
    console.log(resp)

    var user_details = resp[0];


    res.render('user_profile', user_details);
}


router.updateUserSettings = async function(req, res, next) {
    var sess = req.session;
    let team_list = await getTeamList(res, req, sess.username, {"status": "confirmed"});
    res.render('update_user_settings', team_list);
}

router.updateUserSettingsSubmit = async function(req, res, next) {
    var settings_data = {
        'settings': req.body
    }
    console.log(settings_data)
    var sess = req.session;
    var user_id = sess.user_id
    await updateUser(res, req, settings_data, user_id);
    res.redirect('/');
}

module.exports = router;
