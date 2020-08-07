var config = require('../../config.js');
const axios = require('axios');
require('log-timestamp');

var serach_all_notification_url = config.server_host + 'notification/search/'
var read_all_notification_url = config.server_host + 'notification/read/all/'
var read_single_notification_url = config.server_host + 'notification/read/single/'


module.exports.getAllNotification = async function(res, req, param, user_id) {
    console.log('getAllNotification called');
    var url = serach_all_notification_url + user_id
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

module.exports.markReadAllNotification = async function(res, req, user_id) {
    console.log('markReadAllNotification called');
    var url = read_all_notification_url + user_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('markReadAllNotification done');
    return response.data
};

module.exports.markReadSingleNotification = async function(res, req, notification_id) {
    console.log('markReadSingleNotification called');
    var url = read_single_notification_url + notification_id
    var sess = req.session;
    const auth_config = {
        headers: { Authorization: `Bearer ${sess.access_token}` }
    };
    let response = await axios.put(url, auth_config)
    .catch(error => {
        console.error(error)
        res.render('error_page', {});
    })

    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    console.log('markReadSingleNotification done');
    return response.data
};
