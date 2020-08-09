'use strict'

var express = require('express');
var config = require('../config.js');
var router = express.Router();
require('log-timestamp');

var notification_server = require('./servers/notification_services.js');
var jshelper = require('./servers/jshelper.js');
var system_server = require('./servers/system_services.js');


router.viewNotificationPage = async function(req, res, next) {
    console.log('viewNotificationPage called')
    await system_server.verifyAccessRole(req, res, 'contestant')
    var sess = req.session;
    var notification_list = await notification_server.getAllNotification(res, req, {"size": 100}, sess.user_id)
    res.render('view_notification_list', notification_list);
}

router.readAllNotification = async function(req, res, next) {
    console.log('readAllNotification called')
    await system_server.verifyAccessRole(req, res, 'contestant')
    var sess = req.session;
    await notification_server.markReadAllNotification(res, req, sess.user_id)
    jshelper.sleep(1000);
    res.redirect('back')
}

router.readSingleNotification = async function(req, res, next) {
    console.log('readSingleNotification called')
    await system_server.verifyAccessRole(req, res, 'contestant')
    var url = req.url
    var words = url.split("/");
    var notification_id = words[words.length-2]
    await notification_server.markReadSingleNotification(res, req, notification_id)
    jshelper.sleep(1000);
    res.redirect('back')
}

module.exports = router;
