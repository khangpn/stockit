var express = require('express');
var api = express.Router();

//------------------- Admin Section ----------------------
//--------------------------------------------------------

//----------------- Authenticated section --------------------
api.get('/',
  function(req, res, next) {
    if (!res.locals.authenticated || !res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    next();
  }, function(req, res, next) {
  var Seller = req.models.seller;
  Seller.findAll({raw:true})
    .then(function(sellers){
      return res.json(sellers);
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
    var Seller = req.models.seller;

    Seller.create(data)
      .then(function(seller){
        return res.json(seller); 
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
    var Seller = req.models.seller;
    Seller.destroy({
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
    var Seller = req.models.seller;
    Seller.findById(req.params.id, {raw:true})
      .then(function(seller) {
        if (!seller) {
          return res.status(404).json({msg: "Can't find the seller with id: " + req.params.id}); 
        }
        return res.json(seller); 
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
    var Seller = req.models.seller;
    Seller.findById(data.id)
      .then(function(seller) {
        if (!seller) {
          return res.status(404).json({msg: "Can't find the seller with id: " + data.id}); 
        }

        seller.update(data).then(function(seller){
          return res.json(seller); 
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
