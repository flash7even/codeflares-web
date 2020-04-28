'use strict'

var homeController = require('./home.js');
var problemController = require('./problem.js');
var categoryController = require('./category.js');
var trainingController = require('./training.js');
var teamController = require('./team.js');

module.exports = function(newApp) {
    /* GET home page. */
    newApp.get('/', homeController.showHome);
    newApp.get('/login/', homeController.showLogIn);
    newApp.get('/signup/', homeController.showSignUp);

    newApp.get('/problem/add/', problemController.addProblemForm);
    newApp.post('/problem/add/', problemController.addProblemFormSubmit);
    newApp.get('/problem/list/', problemController.viewProblemList);
    newApp.post('/problem/list/', problemController.viewProblemListAfterFormSubmit);

    newApp.get('/category/add/', categoryController.addCategoryForm);
    newApp.post('/category/add/', categoryController.addCategoryFormSubmit);
    newApp.get('/category/list/', categoryController.viewCategoryList);
    newApp.post('/category/list/', categoryController.viewCategoryListAfterFormSubmit);

    newApp.get('/training/individual/', trainingController.viewIndividualTraining);


    newApp.get('/team/add/', teamController.addTeamForm);
    newApp.post('/team/add/', teamController.addTeamFormSubmit);
    newApp.get('/team/list/', teamController.viewTeamList);
}
