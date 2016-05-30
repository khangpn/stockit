/**
 * Reference code from the Express MVC example
 * https://github.com/strongloop/express/tree/master/examples/mvc
 * Loading controller
 */

var express = require('express');
var fs = require('fs');
var verbose = process.env.NODE_ENV === 'development';

module.exports = function(app, options){
  fs.readdirSync(__dirname + '/../controllers').forEach(function(name){
    var dirname = name.split('.')[0];
    verbose && console.log('\nLoading controller %s:', name);
    var controller = require('./../controllers/' + name);
    var subApp = express();

    // allow specifying the view engine
    var view_engine = controller.engine !== undefined ? controller.engine : 'jade';

    subApp.set('view engine', view_engine);
    subApp.set('views', __dirname + '/../views/' + dirname);
    subApp.use(controller);

    // mount the route
    if (name === 'index.js') {
      app.use('/', subApp);
    } else {
      app.use('/' + dirname, subApp);
    }
  });
};
