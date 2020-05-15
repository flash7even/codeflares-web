'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var serach_all_notification_url = config.server_host + 'notification/search/'
var read_all_notification_url = config.server_host + 'notification/read/all/'
var read_single_notification_url = config.server_host + 'notification/read/single/'





//----------------- Call to the server -------------------//

async function getAllNotification(res, req, param, user_id) {
  console.log('getAllNotification called');
  var url = serach_all_notification_url + user_id
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
}

async function markReadAllNotification(res, req, user_id) {
  console.log('markReadAllNotification called');
  var url = read_all_notification_url + user_id
  console.log("url: " + url)
  var sess = req.session;
  const auth_config = {
      headers: { Authorization: `Bearer ${sess.access_token}` }
  };
  let response = await axios.put(url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('markReadAllNotification done');
  return response.data
}

async function markReadSingleNotification(res, req, notification_id) {
  console.log('markReadSingleNotification called');
  var url = read_single_notification_url + notification_id
  console.log("url: " + url)
  var sess = req.session;
  const auth_config = {
      headers: { Authorization: `Bearer ${sess.access_token}` }
  };
  let response = await axios.put(url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })

  if(response.status != 200 && response.status != 201){
      res.render('error_page', {});
  }
  console.log('markReadSingleNotification done');
  return response.data
}











//----------------- Routes -------------------//

async function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }


router.viewNotificationPage = async function(req, res, next) {
    var sess = req.session;
    var notification_list = await getAllNotification(res, req, {"size": 100}, sess.user_id)
    console.log('notification_list: ')
    console.log(notification_list)
    res.render('view_notification_list', notification_list);
}

router.readAllNotification = async function(req, res, next) {
    var sess = req.session;
    await markReadAllNotification(res, req, sess.user_id)
    sleep(1000);
    res.redirect('back')
}

router.readSingleNotification = async function(req, res, next) {
    var url = req.url
    var words = url.split("/");
    var notification_id = words[words.length-2]
    await markReadSingleNotification(res, req, notification_id)
    sleep(1000);
    res.redirect('back')
}

module.exports = router;
