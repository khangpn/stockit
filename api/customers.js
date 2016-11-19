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
  var Customer = req.models.customer;
  Customer.findAll({
    include: [req.models.account]
  })
    .then(function(customers){
      return res.json(customers);
    }).catch( function(error){
      return res.status(400).json(error); 
    });
});
//--------------------------------------------------------

//----------------- Authenticated section --------------------
api.post('/',
  function(req, res, next) {
    if (res.locals.authenticated && !res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    if (!req.body) {
      return res.status(400).json({msg: 'Cannot get the req.body'}); 
    }

    next();
  }, function(req, res, next) {
    var data = req.body;
    data['customer']['email'] = data['email'];

    // This is because of the current sequelize version error.
    // Unless we have this, it will add null to customer_id, hence raise "can not be null" error because of our model definition.
    data['customer_id'] = 'tmp'; 

    delete(data['customer']['is_admin']);
    var Customer = req.models.customer;
    var Customer = req.models.customer;

    return Customer.create(data, {
      include: [Customer]
    }) .then(function(customer){
      return res.json(customer); 
    }).catch ( function(error){
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
    var Customer = req.models.customer;
    Customer.destroy({
      where: { id: req.params.id }
      })
      .then(function(deleteds){
        return res.json(deleteds); 
      }).catch( function(error){
        return res.status(400).json(error); 
      });
  }
);

/*TODO: handle customer and admin views*/
api.get('/:id', 
  function (req, res, next) {
    if (!res.locals.authenticated) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    next();
  }, function (req, res, next) {
    var Customer = req.models.customer;
    Customer.findById(req.params.id, {
      include: [req.models.account]
    }).then(function(customer) {
      if (!customer) {
        return res.status(404).json({msg: "Can't find the customer with id: " + req.params.id}); 
      }

      var returnedCustomer = customer.toJSON();
      returnedCustomer.is_owner = customer.id == res.locals.current_account.id;
      return res.json(returnedCustomer); 
    }).catch(function(error) {
      return next(error);
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
    var Customer = req.models.customer;
    Customer.findById(data.id).then(function(customer) {
        if (!customer) {
          return res.status(404).json({msg: "Can't find the item with id: " + data.id}); 
        }

      customer.update(data).then(function(customer){
        return res.json(customer); 
      }, function (error) {
        return res.status(400).json(error); 
      });
    }).catch( function(error){
      return res.status(400).json(error); 
    });
  }
);
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------
module.exports = api;

