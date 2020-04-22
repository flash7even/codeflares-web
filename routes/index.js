
var homeController = require('./home.js');

module.exports = function(newApp) {
    /* GET home page. */
    newApp.get('/', homeController.showHome);
}

