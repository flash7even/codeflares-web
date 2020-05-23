'use strict'

var express = require('express');
var config = require('../config');
var router = express.Router();
const axios = require('axios');
var classroom_task_list_view_all = config.server_host + 'classroom/task/search'
var classroom_class_list_view_all = config.server_host + 'classroom/class/search'

var blog_server = require('./servers/blog_services.js');
var classroom_server = require('./servers/classroom_services.js');
var contest_server = require('./servers/contest_services.js');
var jshelper = require('./servers/jshelper.js');


router.addClassroomForm = async function(req, res, next) {
  let user_list = await classroom_server.getUserList(res, req, {});
  console.log(user_list)
  res.render('add_classroom', user_list);
}

function update_classroom_data(classroom){
  var data = {}
  var user_handle = "user_handle"
  var remarks = "remarks"
  var member_list = []
  for (var key in classroom) {
    console.log(key + " -> " + classroom[key]);
    if(key.startsWith(user_handle)){
        var res = key.split('@')
        if (res.length == 2){
          var id = res[1];
          var dependecy_val = remarks + "@" + id;
          var edge = {
            "user_handle": classroom[key],
            "remarks": classroom[dependecy_val],
          }
          member_list.push(edge);
      }
    }else if(key.startsWith(remarks)){
      continue;
    }else{
      data[key] = classroom[key]
    }
  }
  data['member_list'] = member_list
  return data
}

router.addClassroomFormSubmit = async function(req, res, next) {
  console.log('addClassroomFormSubmit called')
  var classroom = req.body
  classroom['team_type'] = 'classroom';
  console.log(classroom)
  classroom = update_classroom_data(classroom)
  await classroom_server.postClassroom(res, req, classroom)
  jshelper.sleep(1000);
  res.redirect('/classroom/list/');
}

router.viewClassroomList = async function(req, res, next) {
  var sess = req.session;
  let classroom_list = await classroom_server.getClassroomList(res, req, sess.username, {"team_type": "classroom"});
  classroom_list['logged_in_user_id'] = sess.user_id
  console.log(classroom_list)
  res.render('view_classroom_list', classroom_list);
}

router.trainingClassroom = async function(req, res, next) {
  console.log('trainingClassroom called')
  var url = req.url
  console.log(req.url)
  console.log(url)
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  console.log(classroom_id)

  var classroom_details = await classroom_server.classroomDetails(res, req, classroom_id)
  var contest_list = await contest_server.getContestList(res, req, {"contest_ref_id": classroom_id});
  classroom_details['contest_list'] = contest_list['contest_list']
  let blog_data = await blog_server.getBlogList(res, req, {"blog_ref_id": classroom_id});
  classroom_details['blog_list'] = blog_data['blog_list']
  console.log(classroom_details)
  res.render('classroom_training', classroom_details);
}

router.confirmClassroom = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var sess = req.session;
  var data = {
    "team_id": classroom_id,
    "user_handle": sess.username,
    "status": "confirmed"
  }
  await classroom_server.updtateClassroom(res, req, data)
  jshelper.sleep(1000);
  res.redirect('/classroom/list/');
}

router.rejectClassroom = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var sess = req.session;
  var data = {
    "team_id": classroom_id,
    "user_handle": sess.username,
    "status": "rejected"
  }
  await classroom_server.updtateClassroom(res, req, data)
  jshelper.sleep(1000);
  res.redirect('/classroom/list/');
}

router.deleteClassroom = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  await classroom_server.deleteClassroom(res, req, classroom_id)
  jshelper.sleep(1000);
  res.redirect('/classroom/list/');
}

router.deleteClassroomMember = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var user_handle = words[words.length-2]
  var classroom_id = words[words.length-3]
  console.log('user_handle: ' + user_handle)
  console.log('classroom_id: ' + classroom_id)
  await classroom_server.deleteClassroomMember(res, req, classroom_id, user_handle)
  jshelper.sleep(1000);
  res.redirect('back');
}





//---------- Classroom Task Controllers -----------//
router.addClassroomTaskForm = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_details = await classroom_server.classroomDetails(res, req, classroom_id)
  console.log(classroom_details)
  res.render('add_classroom_task', classroom_details);
}

router.addClassroomTaskFormSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_task_data = req.body
  var sess = req.session;
  classroom_task_data["task_added_by"] = sess.user_id
  classroom_task_data["classroom_id"] = classroom_id
  console.log(classroom_task_data)
  await classroom_server.postClassroomTask(res, req, classroom_task_data)
  jshelper.sleep(1000);
  res.redirect('/classroom/training/' + classroom_id + '/');
}

router.deleteClassroomTask = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_task_id = words[words.length-2]
  var sess = req.session;
  var delete_url = classroom_add_task_submit_url + classroom_task_id
  console.log('delete url: ' + delete_url)
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` }};
  let response = await classroom_server.axios.delete(delete_url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })
  jshelper.sleep(1000);
  res.redirect('back');
}

router.updateClassroomTask = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var task_id = words[words.length-2]
  var task_details = await classroom_server.getClassroomTaskDetails(res, req, task_id)
  console.log('task_details found')
  console.log(task_details)
  res.render('update_classroom_task', task_details);
}

router.updateClassroomTaskSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var task_id = words[words.length-2]
  updtateClassroomTask(res, req, req.body, task_id)
  jshelper.sleep(1000);
  res.redirect('/');
}

router.viewClassroomTaskList = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_details = await classroom_server.classroomDetails(res, req, classroom_id)
  var sess = req.session;
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` } };
  var tasklist_url = classroom_task_list_view_all
  let response = await axios.post(tasklist_url, { 'classroom_id': classroom_id }, auth_config)
  .catch(error => {
      console.log(error)
      res.render('error_page', {});
  })
  var response_data = response.data
  classroom_details['task_list'] = response_data['task_list']
  console.log(classroom_details)
  res.render('view_classroom_task_list', classroom_details);
}





//---------- Classroom Class Controllers -----------//
router.addClassroomClassForm = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_details = await classroom_server.classroomDetails(res, req, classroom_id)
  console.log(classroom_details)
  res.render('add_classroom_class', classroom_details);
}

router.addClassroomClassFormSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_class_data = req.body
  var sess = req.session;
  classroom_class_data["class_moderator_id"] = sess.user_id
  classroom_class_data["classroom_id"] = classroom_id
  console.log(classroom_class_data)
  await classroom_server.postClassroomClass(res, req, classroom_class_data)
  jshelper.sleep(1000);
  res.redirect('/classroom/training/' + classroom_id + '/');
}

router.deleteClassroomClass = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_class_id = words[words.length-2]
  var sess = req.session;
  var delete_url = classroom_add_class_submit_url + classroom_class_id
  console.log('delete url: ' + delete_url)
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` }};
  let response = await classroom_server.axios.delete(delete_url, auth_config)
  .catch(error => {
      res.render('error_page', {});
  })
  jshelper.sleep(1000);
  res.redirect('back');
}

router.viewClassroomClassList = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var classroom_id = words[words.length-2]
  var classroom_details = await classroom_server.classroomDetails(res, req, classroom_id)
  var sess = req.session;
  const auth_config = { headers: { Authorization: `Bearer ${sess.access_token}` } };
  var classlist_url = classroom_class_list_view_all
  let response = await axios.post(classlist_url, { 'classroom_id': classroom_id }, auth_config)
  .catch(error => {
      console.log(error)
      res.render('error_page', {});
  })
  var response_data = response.data
  classroom_details['class_list'] = response_data['class_list']
  console.log(classroom_details)
  res.render('view_classroom_class_list', classroom_details);
}

router.updateClassroomClass = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var class_id = words[words.length-2]
  var class_details = await classroom_server.getClassroomClassDetails(res, req, class_id)
  console.log('class_details found')
  console.log(class_details)
  jshelper.sleep(1000);
  res.render('update_classroom_class', class_details);
}

router.updateClassroomClassSubmit = async function(req, res, next) {
  var url = req.url
  var words = url.split("/");
  var class_id = words[words.length-2]
  classroom_server.updtateClassroomClass(res, req, req.body, class_id)
  res.redirect('/');
}

module.exports = router;
