var config = require('../../config.js');
const axios = require('axios');
require('log-timestamp');

var problem_search_url = config.server_host + 'problem/search/heavy/'
var problem_submit_url = config.server_host + 'problem/'
var problem_resource_submit_url = config.server_host + 'resource/'
var user_problem_status_submit_url = config.server_host + 'problem/status/'


module.exports.getProblemList = async function(res, req, search_param) {
    console.log('getProblemList called');
    var page = 0
    var problem_list = []
    while(1){
        var post_url = problem_search_url + page.toString()
        let response = await axios.post(post_url, search_param)
        .catch(error => {
            console.error(error)
            res.render('error_page', {});
        })

        if(response.status != 200 && response.status != 201){
            res.render('error_page', {});
        }
        problem_list = response.data
        page++
        break;
    }
    console.log('getProblemList done');
    return problem_list
};

module.exports.postProblem = async function(res, req, problem_data) {
    var post_url = problem_submit_url
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, problem_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.postProblemResource = async function(res, req, data) {
    var post_url = problem_resource_submit_url
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.getProblemDetails = async function(res, req, problem_id, user_id = null) {
    console.log('getProblemDetails')
    var post_url = problem_submit_url + problem_id
    if (user_id != null){
        post_url = post_url + '/' + user_id
    }
    let response = await axios.get(post_url)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.addUserProblemStatus = async function(res, req, data) {
    var post_url = user_problem_status_submit_url
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.post(post_url, data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.viewFlaggedProblems = async function(res, req, param, user_id) {
    var url = user_problem_status_submit_url + 'search/' + user_id
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
    return response.data
};

module.exports.getSubmissionHistory = async function(res, req, problem_id) {
    var url = config.server_host + 'problem/submission/history/' + problem_id + '/' + "0"
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
    return response.data
};

module.exports.updateProblemData = async function(res, req, problem_id, data) {
    var post_url = problem_submit_url + problem_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(post_url, data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
  
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.deleteResourceDetails = async function(res, req, resource_id) {
    var url = config.server_host + 'resource/' + resource_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.delete(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.getResourceDetails = async function(res, req, resource_id) {
    var url = config.server_host + 'resource/' + resource_id
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
    return response.data
};

module.exports.updateResourceDetails = async function(res, req, data, resource_id) {
    var url = config.server_host + 'resource/' + resource_id
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

module.exports.getOJList = async function(res, req) {
    var url = config.server_host + 'support/online-judges'
    let response = await axios.get(url)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};
