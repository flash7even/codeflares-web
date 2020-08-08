var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session  = require('express-session'); //
var flash      = require('req-flash'); //
require('log-timestamp');
var expressHbs = require('express-handlebars'), Handlebars = require('handlebars');
const app = require("express")();
const DeviceDetector = require('node-device-detector');
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
const device_detector = new DeviceDetector;
var device = require('express-device');

//view engine setup
app.set("views", path.join(__dirname, "views")); //setting views directory for views.
app.engine('.hbs', expressHbs(
	{
		defaultLayout: 'layout',
		extname: '.hbs',
		helpers: {
			reverseWord: function (value) {
				var reversedWord = value.split("").reverse().join("");
  				return reversedWord;
			},
			userAccess: function (user_role, required_role, options) {
				var role_levels = ['contestant', 'service', 'moderator', 'manager', 'admin', 'root']
				var role_order = {
					'contestant': 1,
					'service': 2,
					'moderator': 3,
					'manager': 4,
					'admin': 8,
					'root': 10,
				}
				var user_role_order = role_order[user_role]
				var required_role_order = role_order[required_role]
				if(user_role_order >= required_role_order){
					return options.fn(this)
				}else{
					return options.inverse(this);
				}
			},
			markdown: require('helper-markdown'),
			showdown_helper: function (text) {
				var showdown  = require('showdown'),
				converter = new showdown.Converter(),
				html      = converter.makeHtml(text);
				return new Handlebars.SafeString(html);
			},
			showdown_markdown: function (text) {
				return new Handlebars.SafeString(text);
			}
		}
	}
));

app.set("view engine", "hbs"); //setting view engine as handlebars

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(device.capture());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'a@b@ab@123',saveUninitialized: true,resave: true}));

app.use(function (req, res, next) {
	res.locals.session = req.session;
	next();
});

// Request authenticate middleware
var requestAuthenticate = async function (req, res, next) {
	var device_type = req.device.type
	var ip_address = req.connection.remoteAddress
	var url = req.url
	if (device_type == "bot") {
		console.warn('REQ_AUTH - Request ignore due to blacklisted device type')
		res.redirect('/request/error/')
	}
	console.log('REQ_AUTH - ip_address: ' + ip_address + ' hit: ' + url)
	console.log('REQ_AUTH - device_type: ' + device_type)
	const device_details = device_detector.detect(userAgent);
	console.log('REQ_AUTH - device_info: ')
	console.log(device_details)
	next()
}
app.use(requestAuthenticate)

// Notification middleware
var notificationSetter = async function (req, res, next) {
	var user_server = require('./routes/servers/user_services.js');
	var sess = req.session;
	var notification_data = {}
	if (sess.user_id){
		notification_data = await user_server.getAllNotification(res, req, {"size": 5}, sess.user_id)
	}
	sess.notification_data = notification_data
	next()
}
app.use(notificationSetter)

// User Settings middleware
var userSettingsSetter = async function (req, res, next) {
	var user_server = require('./routes/servers/user_services.js');
	var sess = req.session;
	var user_details = {
		"settings": {}
	}
	if (sess.user_id){
		user_details = await user_server.getUserDetails(res, req, sess.user_id)
	}
	sess.user_settings = user_details.settings
	next()
}
app.use(userSettingsSetter)

require('./routes/index')(app); // getting access of index.js

app.listen(80, function () {
	console.log('Example app listening on port 80!')
})

module.exports = app;