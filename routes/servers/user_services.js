var config = require('../../config.js');
const axios = require('axios');
require('log-timestamp');


var user_search_url = config.server_host + 'user/search'
var user_search_url_skilled = config.server_host + 'user/search/skilled'
var user_search_url_contributor = config.server_host + 'user/search/contributor'
var user_search_url_solver = config.server_host + 'user/search/solved-count'
var user_submit_url = config.server_host + 'user/'
var login_url = config.server_host + 'auth/login'
var forgot_pass_url = config.server_host + 'user/forgotpass'
var forgot_pass_confirm_url = config.server_host + 'user/confirmpasstoken/'
var forgot_pass_reset_url = config.server_host + 'user/confirmpass/'
var team_search_url = config.server_host + 'team/search/user/'
var serach_all_notification = config.server_host + 'notification/search/'
var user_activate_url = config.server_host + 'user/activate/'
var change_pass_url = config.server_host + 'user/changepass/'

var system_server = require('./system_services.js');


module.exports.getAllNotification = async function(res, req, param, user_id) {
    console.log('getAllNotification called');
    var url = serach_all_notification + user_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.post(url, param, auth_config)
    .catch(error => {
        console.error(error)
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
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, search_param, auth_config)
    .catch(error => {
        console.error(error)
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
    let response = await axios.post(user_search_url, user_data, auth_config)
    .catch(error => {
        console.error(error)
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
    let response = await axios.post(user_search_url_skilled, user_data, auth_config)
    .catch(error => {
        console.error(error)
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
    let response = await axios.post(user_search_url_solver, user_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }

    console.log('searchUser completed')
    return response.data
};

module.exports.topContributors = async function(res, req, user_data) {
    console.log('topContributors called')
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(user_search_url_contributor, user_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }

    console.log('topContributors completed')
    return response.data
};

module.exports.getUserDetails = async function(res, req, user_id) {
    console.log('getUserDetails called')
    var sess = req.session;
    const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` } };
    var url = user_submit_url + user_id
    let response = await axios.get(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    console.log('getUserDetails completed')
    return response.data
};

module.exports.logIn = async function(res, req, data) {
    console.log('logIn called');
    let response = await axios.post(login_url, data)
    .catch(error => {
        console.error(error)
        system_server.add_toast(req, "Login unsuccessful! Username or password is incorrect.", 'warning')
        res.redirect('back')
    })

    if(response.status != 200 && response.status != 201){
        system_server.add_toast(req, "Login unsuccessful! Username or password is incorrect.", 'warning')
        res.redirect('back')
    }

    console.log('logIn done');
    return response.data
};

module.exports.updateUser = async function(res, req, user_data, user_id) {
    console.log('updateUser called')
    var url = user_submit_url + user_id
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.put(url, user_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.updateUserControl = async function(res, req, user_data, user_id) {
    console.log('updateUserControl called')
    var url = config.server_host + 'user/admin/action/' + user_id
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.put(url, user_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.postUser = async function(res, req, user_data) {
    var post_url = user_submit_url + 'register'
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, user_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.syncUser = async function(res, req, user_id) {
    var url = user_submit_url + 'sync' + '/' + user_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(url, {}, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.syncAdminstration = async function(res, req, sync_type, sync_ref) {
    var url = user_submit_url + 'sync-administration' + '/' + sync_type + '/' + sync_ref
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(url, {}, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.activate_user_account = async function(res, req, token) {
    var url = user_activate_url + token
    let response = await axios.post(url, {})
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.forgot_password_request = async function(res, req, data) {
    var url = forgot_pass_url
    let response = await axios.post(url, data)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.forgot_password_token_confirm = async function(res, req, token) {
    var url = forgot_pass_confirm_url + token
    let response = await axios.post(url, {})
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.forgot_password_reset = async function(res, req, user_id, data, token) {
    var url = forgot_pass_reset_url + user_id + '/' + token
    let response = await axios.put(url, data)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.change_password = async function(res, req, user_id, data) {
    var url = change_pass_url + user_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(url, data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.userSubmissionHistory = async function(res, req, user_id) {
    console.log('followStatus called');
    var url = config.server_host + 'problem/user/submission/history/' + user_id + '/0'
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.get(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('followStatus done');
    return response.data
};

module.exports.universityList = async function(res, req) {
    console.log('universityList called');
    var url = config.server_host + 'support/university'
    let response = await axios.get(url)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('universityList done');
    return response.data
};

module.exports.countryList = async function(res, req) {
    console.log('countryList called');
    var url = config.server_host + 'support/country'
    let response = await axios.get(url)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('countryList done');
    return response.data
};

module.exports.getJobList = async function(res, req, page) {
    console.log('getJobList called');
    var url = config.server_host + 'job/search/' + page
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    var param = {
        'sort_order': 'desc'
    }
    let response = await axios.post(url, param, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('getJobList done');
    return response.data
};
