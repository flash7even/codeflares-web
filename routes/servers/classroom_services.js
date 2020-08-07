var config = require('../../config.js');
const axios = require('axios');
require('log-timestamp');

var classroom_search_url = config.server_host + 'classroom/search/user/'
var user_search_url = config.server_host + 'user/search/'
var classroom_submit_url = config.server_host + 'classroom/'
var classroom_member_delete_url = config.server_host + 'classroom/member/'
var classroom_training_url = config.server_host + 'training/classroom/'
var classroom_add_task_submit_url = config.server_host + 'classroom/task/'
var classroom_add_class_submit_url = config.server_host + 'classroom/class/'


module.exports.getClassroomList = async function(res, req, username, search_param) {
    console.log('getClassroomList called');
    var post_url = classroom_search_url + username
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
    console.log('getClassroomList done');
    return response.data
};

module.exports.getUserList = async function(res, req, search_param) {
    console.log('getUserList called');
    var page = 0
    var user_list = []
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    while(1){
        var post_url = user_search_url + page.toString()
        let response = await axios.post(post_url, search_param, auth_config)
        .catch(error => {
            console.error(error)
            res.render('error_page', {});
        })
        if(response.status != 200 && response.status != 201){
            res.render('error_page', {});
        }
        user_list = response.data
        page++
        break;
    }
    console.log('getUserList done');
    return user_list
};

module.exports.postClassroom = async function(res, req, classroom_data) {
    console.log('postClassroom called');
    var post_url = classroom_submit_url
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, classroom_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.updateClassroom = async function(res, req, classroom_id, classroom_data) {
    var post_url = classroom_submit_url + classroom_id
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.put(post_url, classroom_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.postClassroomTask = async function(res, req, classroom_task_data) {
    var post_url = classroom_add_task_submit_url
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, classroom_task_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.getClassroomTaskDetails = async function(res, req, task_id) {
    var url = classroom_add_task_submit_url + task_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.get(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    return response.data
};

module.exports.getClassroomClassDetails = async function(res, req, class_id) {
    var url = classroom_add_class_submit_url + class_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.get(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })
    return response.data
};

module.exports.postClassroomClass = async function(res, req, classroom_class_data) {
    var post_url = classroom_add_class_submit_url
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.post(post_url, classroom_class_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.deleteClassroom = async function(res, req, classroom_id) {
    var url = classroom_submit_url + classroom_id
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
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

module.exports.deleteClassroomMember = async function(res, req, classroom_id, user_handle) {
    var url = classroom_member_delete_url + classroom_id + '/' + user_handle
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
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

module.exports.updtateClassroom = async function(res, req, classroom_data) {
    var url = classroom_submit_url + 'member' + '/'
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    let response = await axios.put(url, classroom_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.classroomDetails = async function(res, req, classroom_id) {
    console.log('classroomDetails called')
    var sess = req.session;
    var access_token = sess.access_token
    const auth_config = {
        headers: { Authorization: `Bearer ${access_token}` }
    };
    var url = classroom_training_url + classroom_id
    let response = await axios.get(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('classroomDetails done')
    return response.data
};

module.exports.updtateClassroomTask = async function(res, req, task_data, task_id) {
    var url = classroom_add_task_submit_url + task_id
    var sess = req.session;
    const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` }};
    let response = await axios.put(url, task_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};

module.exports.updtateClassroomClass = async function(res, req, class_data, class_id) {
    var url = classroom_add_class_submit_url + class_id
    var sess = req.session;
    const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` }};
    let response = await axios.put(url, class_data, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    return response.data
};
