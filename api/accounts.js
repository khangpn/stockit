var express = require('express');
var api = express.Router();

//------------------- Admin Section ----------------------
api.get('/',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    next();
  }, function(req, res, next) {
  var Account = req.models.account;
  var Admin = req.models.admin;
  var Customer = req.models.customer;
  Account.findAll({
    include: [Admin, Customer]
  })
    .then(function(accounts){
      return res.json(accounts);
    }).catch( function(error){
      return res.status(400).json(error); 
    });
});
//--------------------------------------------------------

//----------------- Authenticated section --------------------
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------
module.exports = api;

