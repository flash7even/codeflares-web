var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session  = require('express-session'); //
var flash      = require('req-flash'); //
var expressHbs = require('express-handlebars'), Handlebars = require('handlebars');
const app = require("express")();

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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'a@b@ab@123',saveUninitialized: true,resave: true}));

app.use(function (req, res, next) {
	res.locals.session = req.session;
	next();
});

// Notification middleware
var notificationSetter = async function (req, res, next) {
	var user_server = require('./routes/servers/user_services.js');
	var sess = req.session;
	var notification_data = {}
	if (sess.user_id){
		notification_data = await user_server.getAllNotification(res, req, {"size": 5}, sess.user_id)
	}
    //console.log('notification_data: ')
	//console.log(notification_data)
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
    //console.log('user_details: ')
	//console.log(user_details)
	sess.user_settings = user_details.settings
	next()
}

app.use(notificationSetter)
app.use(userSettingsSetter)

require('./routes/index')(app); // getting access of index.js

app.listen(80, function () {
	console.log('Example app listening on port 80!')
})

module.exports = app;
