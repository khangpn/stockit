var express = require('express');
var api = express.Router();

//------------------- Admin Section ----------------------
//--------------------------------------------------------

//----------------- Authenticated section --------------------
api.get('/',
  function(req, res, next) {
    if (!res.locals.authenticated || !res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    next();
  }, function(req, res, next) {
  var Account = req.models.account;
  Account.findAll({raw:true})
    .then(function(accounts){
        return res.json(accounts);
      }, 
      function(error){
        return next(error);
    });
});

api.post('/',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    if (!req.body) return next(new Error('Cannot get the req.body'));

    next();
  }, function(req, res, next) {
    var data = req.body;
    var Account = req.models.account;

    Account.create(data)
      .then(function(account){
        return res.json(account); 
      }, function(error){
        return res.status(400).json(error); 
      });
  }
);

api.delete('/:id',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }

    next();
  }, function(req, res, next) {
    var Account = req.models.account;
    Account.destroy({
      where: { id: req.params.id }
      })
      .then(function(deleteds){
          return res.json(deleteds); 
        }, 
        function(error){
          return res.status(400).json(error); 
      });
  }
);

api.get('/:id', 
  function (req, res, next) {
    if (!res.locals.authenticated) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
  }, function (req, res, next) {
    var Account = req.models.account;
    Account.findById(req.params.id, {}).then(function(account) {
      if (!account) return next(new Error("Can't find the account with id: " + req.params.id));
      return res.json(account); 
    }).catch(function(error) {
      return next(error);
    });
});

api.post('/:id',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    if (!req.body) return next(new Error('Cannot get the req.body'));
    next();
  }, function(req, res, next) {
    var data = req.body;
    var Account = req.models.account;
    Account.findById(data.id).then(function(account) {
      if (!account) return next(new Error("Can't find the account with id: " + data.id));

      account.update(data).then(function(account){
        return res.json(account); 
      }, function (error) {
        return res.status(400).json(error); 
      });
    }, function(error) {
      return res.status(400).json(error); 
    });
  }
);
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------
module.exports = api;

