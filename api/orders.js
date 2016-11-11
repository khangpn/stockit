var express = require('express');
var api = express.Router();

//------------------- Admin Section ----------------------
api.get('/',
  function(req, res, next) {
    if (!res.locals.authenticated || !res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    next();
  }, function(req, res, next) {
  var Order = req.models.order;
  Order.findAll({raw:true})
    .then(function(orders){
      return res.json(orders);
  }).catch(function (error) {
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
    var Order = req.models.order;

    Order.create(data)
      .then(function(order){
        return res.json(order); 
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
    var Order = req.models.order;
    Order.destroy({
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
    var Order = req.models.order;
    Order.findById(data.id).then(function(order) {
      if (!order) return next(new Error("Can't find the order with id: " + data.id));

      order.update(data).then(function(order){
        return res.json(order); 
      }, function (error) {
        return res.status(400).json(error); 
      });
    }, function(error) {
      return res.status(400).json(error); 
    });
  }
);

// Load an order's order_details
//api.get('/:id/details', 
//  function(req, res, next) {
//    if (!res.locals.authenticated || !res.locals.isAdmin) {
//      var err = new Error('You are not permitted to access this!');
//      err.status = 401;
//      return next(err);
//    }
//    next();
//  }, function(req, res, next) {
//  }
//);

api.get('/:id', 
  function(req, res, next) {
    if (!res.locals.authenticated || !res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    next();
  }, function(req, res, next) {
    var Order = req.models.order;
    var Item = req.models.item;
    var Customer = req.models.customer;
    return Order.findById(req.params.id, {
      include: [Customer]
    }).then(function(order) {
        if (!order) return next(new Error("Can't find the order with id: " + req.params.id));
        order.getOrder_details({
          include: [Item]
        }).then(function (details) {
          order.details = details;
          return res.json(order); 
        }).catch(function(error) {
          return next(error);
        });
        return null; //either return the getOrder_details promise or null will stop the promise warning
    }).catch(function (error) {
      return next(error);
    });
  }
);
//--------------------------------------------------------

//----------------- Authenticated section --------------------
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------
module.exports = api;
