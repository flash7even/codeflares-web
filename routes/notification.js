'use strict'

var express = require('express');
var config = require('../config.js');
var router = express.Router();

var notification_server = require('./servers/notification_services.js');
var jshelper = require('./servers/jshelper.js');


router.viewNotificationPage = async function(req, res, next) {
    var sess = req.session;
    var notification_list = await notification_server.getAllNotification(res, req, {"size": 100}, sess.user_id)
    console.log('notification_list: ')
    console.log(notification_list)
    res.render('view_notification_list', notification_list);
}

router.readAllNotification = async function(req, res, next) {
    var sess = req.session;
    await notification_server.markReadAllNotification(res, req, sess.user_id)
    jshelper.sleep(1000);
    res.redirect('back')
}

router.readSingleNotification = async function(req, res, next) {
    var url = req.url
    var words = url.split("/");
    var notification_id = words[words.length-2]
    await notification_server.markReadSingleNotification(res, req, notification_id)
    jshelper.sleep(1000);
    res.redirect('back')
}

module.exports = router;
