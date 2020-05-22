var config = require('../../config.js');
const axios = require('axios');


var user_search_url = config.server_host + 'user/search'
var user_search_url_skilled = config.server_host + 'user/search/skilled'
var user_search_url_solver = config.server_host + 'user/search/solved-count'
var user_submit_url = config.server_host + 'user/'
var login_url = config.server_host + 'auth/login'
var team_search_url = config.server_host + 'team/search/user/'
var serach_all_notification = config.server_host + 'notification/search/'


module.exports.getAllNotification = async function(res, req, param, user_id) {
    console.log('getAllNotification called');
    var url = serach_all_notification + user_id
    console.log("url: " + url)
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.post(url, param, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })
  
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getAllNotification done');
    return response.data
};

module.exports.getTeamList = async function(res, req, username, search_param) {
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
};

module.exports.searchUser = async function(res, req, user_data) {
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
};

module.exports.topRatedUsers = async function(res, req, user_data) {
    console.log('searchUser called')
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    console.log("post_url: " + user_search_url_skilled)
    let response = await axios.post(user_search_url_skilled, user_data, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }

    console.log('searchUser completed')
    return response.data
};

module.exports.topSolverUsers = async function(res, req, user_data) {
    console.log('searchUser called')
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    console.log("post_url: " + user_search_url_solver)
    let response = await axios.post(user_search_url_solver, user_data, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }

    console.log('searchUser completed')
    return response.data
};

module.exports.getUserDetails = async function(res, req, user_id) {
    console.log('getUserDetails called')
    var sess = req.session;
    const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` } };
    var url = user_submit_url + user_id
    let response = await axios.get(url, auth_config)
    .catch(error => {
        res.render('error_page', {});
    })
    console.log('getUserDetails completed')
    return response.data
};

module.exports.logIn = async function(res, req, data) {
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
};

module.exports.updateUser = async function(res, req, user_data, user_id) {
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
};

module.exports.postUser = async function(res, req, user_data) {
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
};

