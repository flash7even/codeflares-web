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

async function getTeamList(username, search_param) {
    console.log('getTeamList called');
    var post_url = team_search_url + username
    console.log("post_url: " + post_url)
    let res = await axios.post(post_url, search_param);
    console.log('getTeamList done');
    return res.data
}

async function searchUser(user_data, req) {
    console.log('searchUser called')
    var sess = req.session;
    var access_token = sess.access_token
    const config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    console.log("post_url: " + user_search_url)
    let res = await axios.post(user_search_url, user_data, config);
    console.log('searchUser completed')
    return res.data
}

async function logIn(data) {
    console.log('logIn called');
    let res = await axios.post(login_url, data);
    console.log('logIn done');
    return res
}

async function updateUser(user_data, user_id) {
    console.log('updateUser called')
    var url = user_submit_url + user_id
    console.log("url: " + url)
    let res = await axios.put(url, user_data);
}

async function postUser(user_data) {
    var post_url = user_submit_url
    console.log("post_url: " + post_url)
    let res = await axios.post(post_url, user_data);
}

router.showHome = function(req, res, next) {
    res.render('index', { title: 'This Is The Homepage' , pageTitle: 'Home'});
}

router.showLogIn = function(req, res, next) {
    res.render('login', {});
}

router.logInSubmit = async function(req, res, next) {
    var user_data = req.body
    var login_resp = await logIn(user_data)
    if(login_resp.status == 200 || login_resp.status == 201){
        var login_data = login_resp.data
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
    }else{
        console.log('Log In Failed')
    }
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
    await axios.post(logout_url, {}, config);
    req.session.destroy();
    console.log('log out done');
    res.redirect('/');
}

router.signUpSubmit = async function(req, res, next) {
    var user_data = req.body
    user_data['user_role'] = 'contestant'
    delete user_data['confirm_password']
    await postUser(user_data)
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

    var resp = await searchUser(param, req)
    console.log(resp)

    var user_details = resp[0];


    res.render('user_profile', user_details);
}


router.updateUserSettings = async function(req, res, next) {
    var sess = req.session;
    let team_list = await getTeamList(sess.username, {"status": "confirmed"});
    res.render('update_user_settings', team_list);
}

router.updateUserSettingsSubmit = async function(req, res, next) {
    var settings_data = {
        'settings': req.body
    }
    console.log(settings_data)
    var sess = req.session;
    var user_id = sess.user_id
    await updateUser(settings_data, user_id);
    res.redirect('/');
}

module.exports = router;
