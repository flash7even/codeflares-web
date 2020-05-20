'use strict'

var homeController = require('./home.js');
var problemController = require('./problem.js');
var categoryController = require('./category.js');
var trainingController = require('./training.js');
var teamController = require('./team.js');
var classroomController = require('./classroom.js');
var notificationController = require('./notification.js');
var contestController = require('./contest.js');

module.exports = function(newApp) {
    /* GET home page. */
    newApp.get('/', homeController.showHome);
    newApp.get('/login/', homeController.showLogIn);
    newApp.post('/login/', homeController.logInSubmit);
    newApp.get('/logout/', homeController.logOutSubmit);
    newApp.get('/signup/', homeController.showSignUp);
    newApp.post('/signup/', homeController.signUpSubmit);
    newApp.get('/profile/*', homeController.showUserProfile);
    newApp.get('/update/profile/', homeController.updateUserProfile);
    newApp.post('/update/profile/', homeController.updateUserProfileSubmit);
    newApp.get('/settings/update/', homeController.updateUserSettings);
    newApp.post('/settings/update/', homeController.updateUserSettingsSubmit);

    newApp.get('/problem/add/', problemController.addProblemForm);
    newApp.post('/problem/add/', problemController.addProblemFormSubmit);
    newApp.get('/problem/list/*', problemController.viewProblemList);
    newApp.post('/problem/list/', problemController.viewProblemListAfterFormSubmit);
    newApp.get('/problem/user/status/flag/*', problemController.setProblemStatusFlag);
    newApp.get('/problem/user/status/remove/*', problemController.setProblemStatusRemove);
    newApp.get('/problem/user/status/clear/*', problemController.setProblemStatusClear);
    newApp.get('/flagged/problem/list/', problemController.showFlaggedProblemList);

    newApp.get('/category/add/', categoryController.addCategoryForm);
    newApp.post('/category/add/', categoryController.addCategoryFormSubmit);
    newApp.get('/category/list/', categoryController.viewCategoryList);
    newApp.get('/category/list/root/*', categoryController.viewCategoryListByRoot);
    newApp.post('/category/list/', categoryController.viewCategoryListAfterFormSubmit);

    newApp.get('/training/individual/', trainingController.viewIndividualTraining);
    newApp.get('/training/team/', trainingController.viewTeamTraining);


    newApp.get('/team/add/', teamController.addTeamForm);
    newApp.post('/team/add/', teamController.addTeamFormSubmit);
    newApp.get('/team/list/', teamController.viewTeamList);
    newApp.get('/team/view/*', teamController.viewTeam);
    newApp.get('/team/confirm/*', teamController.confirmTeam);
    newApp.get('/team/reject/*', teamController.rejectTeam);
    newApp.get('/team/delete/*', teamController.deleteTeam);

    newApp.get('/classroom/add/', classroomController.addClassroomForm);
    newApp.post('/classroom/add/', classroomController.addClassroomFormSubmit);
    newApp.get('/classroom/list/', classroomController.viewClassroomList);
    newApp.get('/classroom/training/*', classroomController.trainingClassroom);
    newApp.get('/classroom/confirm/*', classroomController.confirmClassroom);
    newApp.get('/classroom/reject/*', classroomController.rejectClassroom);
    newApp.get('/classroom/delete/*', classroomController.deleteClassroom);
    newApp.get('/classroom/member/delete/*', classroomController.deleteClassroomMember);

    newApp.get('/classroom/task/add/*', classroomController.addClassroomTaskForm);
    newApp.post('/classroom/task/add/*', classroomController.addClassroomTaskFormSubmit);
    newApp.get('/classroom/task/update/*', classroomController.updateClassroomTask);
    newApp.post('/classroom/task/update/*', classroomController.updateClassroomTaskSubmit);
    newApp.get('/classroom/task/delete/*', classroomController.deleteClassroomTask);
    newApp.get('/classroom/task/view/*', classroomController.viewClassroomTaskList);

    newApp.get('/classroom/class/add/*', classroomController.addClassroomClassForm);
    newApp.post('/classroom/class/add/*', classroomController.addClassroomClassFormSubmit);
    newApp.get('/classroom/class/update/*', classroomController.updateClassroomClass);
    newApp.post('/classroom/class/update/*', classroomController.updateClassroomClassSubmit);
    newApp.get('/classroom/class/delete/*', classroomController.deleteClassroomClass);
    newApp.get('/classroom/class/view/*', classroomController.viewClassroomClassList);

    newApp.get('/notification/list/', notificationController.viewNotificationPage);
    newApp.get('/notification/read/all/', notificationController.readAllNotification);
    newApp.get('/notification/read/single/*', notificationController.readSingleNotification);


    newApp.get('/contest/add/', contestController.addContestForm);
    newApp.post('/contest/add/', contestController.addContestFormSubmit);
    newApp.get('/contest/view/*', contestController.viewContest);
    newApp.get('/contest/list/', contestController.viewAllContest);
    newApp.post('/contest/confirm/*', contestController.confirmContestFormSubmit);
}
