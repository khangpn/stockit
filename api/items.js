var express = require('express');
var api = express.Router();

//------------------- Admin Section ----------------------
//--------------------------------------------------------

//----------------- Authenticated section --------------------
api.get('/',
  function(req, res, next) {
    if (!res.locals.authenticated && !res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    next();
  }, function(req, res, next) {
  var Item = req.models.item;
  Item.findAll({raw:true})
    .then(function(items){
      return res.json(items);
    }).catch(function(error){
      return res.status(400).json(error); 
    });
});

api.post('/',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    if (!req.body) {
      return res.status(400).json({msg: 'Cannot get the req.body'}); 
    }
    next();
  }, function(req, res, next) {
    var data = req.body;
    var Item = req.models.item;

    Item.create(data)
      .then(function(item){
        return res.json(item); 
      }).catch(function(error){
        return res.status(400).json(error); 
      });
  }
);

api.delete('/:id',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }

    next();
  }, function(req, res, next) {
    var Item = req.models.item;
    Item.destroy({
      where: { id: req.params.id }
      })
      .then(function(deleteds){
          return res.json(deleteds); 
      }).catch(function(error){
        return res.status(400).json(error); 
      });
  }
);

api.get('/:id',
  function(req, res, next) {
    if (!res.locals.authenticated) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }

    next();
  }, function(req, res, next) {
    var Item = req.models.item;
    Item.findById(req.params.id, {raw:true})
      .then(function(item) {
        if (!item) {
          return res.status(404).json({msg: "Can't find the item with id: " + req.params.id}); 
        }
        return res.json(item); 
      }).catch(function(error){
        return res.status(400).json(error); 
      });
});

api.post('/:id',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    if (!req.body) {
      return res.status(400).json({msg: 'Cannot get the req.body'}); 
    }
    next();
  }, function(req, res, next) {
    var data = req.body;
    var Item = req.models.item;
    Item.findById(data.id)
      .then(function(item) {
        if (!item) {
          return res.status(404).json({msg: "Can't find the item with id: " + req.params.id}); 
        }

        item.update(data).then(function(item){
          return res.json(item); 
        }).catch(function(error){
          return res.status(400).json(error); 
        });
      }).catch(function(error){
        return res.status(400).json(error); 
      });
  }
);
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------
module.exports = api;
