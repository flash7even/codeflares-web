'use strict'

var express = require('express');
var router = express.Router();
var config = require('../config.js');
const axios = require('axios');
require('log-timestamp');


router.getLeaderboard = async function(req, res, next) {
    console.log('getLeaderboard called');
    var url = config.server_host + 'user/dtsearch'
    let response = await axios.post(url, req.body)
    .catch(error => {
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    var result = response.data

    res.writeHead(200, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(result));
}

router.getUserSubmission = async function(req, res, next) {
    console.log('getUserSubmission called');

    var url = req.url
    var words = url.split("/");
    var user_id = words[words.length-1]
    var url = config.server_host + 'problem/user/submission/history/dtsearch/' + user_id
    let response = await axios.post(url, req.body)
    .catch(error => {
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    var result = response.data

    res.writeHead(200, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(result));
}

router.getProblemSubmission = async function(req, res, next) {
    console.log('getProblemSubmission called');

    var url = req.url
    var words = url.split("/");
    var problem_id = words[words.length-1]
    var url = config.server_host + 'problem/submission/history/dtsearch/' + problem_id
    let response = await axios.post(url, req.body)
    .catch(error => {
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    var result = response.data

    res.writeHead(200, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(result));
}

router.getProblems = async function(req, res, next) {
    console.log('getProblems called');

    var url = req.url
    var words = url.split("/");
    var problem_id = words[words.length-1]
    var url = config.server_host + 'problem/dtsearch/heavy'
    let response = await axios.post(url, req.body)
    .catch(error => {
        res.render('error_page', {});
    })
    if(response.status != 200 && response.status != 201){
        res.render('error_page', {});
    }
    var result = response.data

    res.writeHead(200, { 
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(result));
}

module.exports = router;
