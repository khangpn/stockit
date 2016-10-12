var express = require('express');
var api = express.Router();

//------------------- Admin Section ----------------------
//--------------------------------------------------------

//----------------- Authenticated section --------------------
api.get('/',
  function(req, res, next) {
    if (!res.locals.authenticated) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    next();
  }, function(req, res, next) {
  var Item = req.models.item;
  Item.findAll({raw:true})
    .then(function(items){
        return res.json(items);
      }, 
      function(error){
        return next(error);
    });
});
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------
module.exports = api;
