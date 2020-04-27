var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session  = require('express-session'); //
var flash      = require('req-flash'); //
var expressHbs = require('express-handlebars'); // Express_Handelbars requirement

const app = require("express")();

//view engine setup
app.set("views", path.join(__dirname, "views")); //setting views directory for views.
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set("view engine", "hbs"); //setting view engine as handlebars


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/index')(app); // getting access of index.js

app.listen(5055, function () {
	console.log('Example app listening on port 5055!')
})

module.exports = app;
