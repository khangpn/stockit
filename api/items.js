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
  var Item = req.models.item;
  Item.findAll({raw:true})
    .then(function(items){
        return res.json(items);
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
    var Item = req.models.item;

    Item.create(data)
      .then(function(item){
        return res.json(item); 
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
    var Item = req.models.item;
    Item.destroy({
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

api.get('/:id', function (req, res, next) {
  var Item = req.models.item;
  Item.findById(req.params.id, {raw:true}).then(function(item) {
      if (!item) return next(new Error("Can't find the item with id: " + req.params.id));
      return res.json(item); 
    }, 
    function(error) {
      return next(error);
  });
});
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------
module.exports = api;
