var config = require('../../config.js');
const axios = require('axios');
require('log-timestamp');

var category_search_url = config.server_host + 'category/search/'
var category_submit_url = config.server_host + 'category/'
var category_resource_submit_url = config.server_host + 'resource/'


module.exports.getCategoryList = async function(res, req, search_param) {
    console.log('getCategoryList called');
    var page = 0
    var category_list = []
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    while(1){
        var post_url = category_search_url + page.toString()
        let response = await axios.post(post_url, search_param, auth_config)
        .catch(error => {
            console.error(error)
            res.render('error_page', {});
        })
        if(response.status != 200 && response.status != 201){
            res.render('error_page', {});
        }
        category_list = response.data
        page++
        break;
    }
    console.log('getCategoryList done');
    return category_list
};

module.exports.postCategory = async function(res, req, category_data) {
    console.log('postCategory called');
    var post_url = category_submit_url
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, category_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.postCategoryResource = async function(res, req, data) {
    console.log('postCategory called');
    var post_url = category_resource_submit_url
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

module.exports.getCategoryDetails = async function(res, req, category_id, user_id = null) {
    console.log('getCategoryDetails')
    var post_url = category_submit_url + category_id
    if(user_id != null){
        post_url = post_url + '/' + user_id
    }
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.get(post_url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.getCategoryToppers = async function(res, req, category_id) {
    console.log('getCategoryDetails')
    var url = config.server_host + 'category/user/toppers/' + category_id
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
