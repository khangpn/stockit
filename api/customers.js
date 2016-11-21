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
    if (res.locals.authenticated || !res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    if (!req.body) {
      return res.status(400).json({msg: 'Cannot get the req.body'}); 
    }

    var data = req.body;
    var Sequelize = req.models.Sequelize;
    var errors = [];
    if (data['email'] == undefined) {
      var errorItem = new Sequelize.ValidationErrorItem(
        "The email is invalid",
        "invalid format",
        "email",
        data['email']
      );
      errors.push(errorItem);
    }
    if (data['account'] == undefined) {
      var errorItem = new Sequelize.ValidationErrorItem(
        "The account data is invalid",
        "invalid format",
        "account",
        data['account']
      );
      errors.push(errorItem);
    }
    if (errors.length != 0) {
      var error = new Sequelize.ValidationError("The input is invalid", errors);
      return res.status(400).json(error); 
    }

    next();
  }, function(req, res, next) {
    var data = req.body;
    data['account']['email'] = data['email'];

    // This is because of the current sequelize version error.
    // Unless we have this, it will add null to customer_id, hence raise "can not be null" error because of our model definition.
    data['account_id'] = 'tmp'; 

    delete(data['account']['is_admin']);
    var Account = req.models.account;
    var Customer = req.models.customer;

    return Customer.create(data, {
      include: [Account]
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
      returnedCustomer.is_owner = customer.account.id == res.locals.current_account.id;
      return res.json(returnedCustomer); 
    }).catch(function(error) {
      return res.status(400).json(error); 
    });
});

api.post('/:id',
  function(req, res, next) {
    if (!res.locals.authenticated || res.locals.current_account.id != parseInt(req.params.id)) {
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
          return res.status(404).json({msg: "Can't find the customer with id: " + data.id}); 
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

api.post('/:id/password/update',
  function(req, res, next) {
    if (!res.locals.authenticated) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    if (!req.body) {
      return res.status(400).json({msg: 'Cannot get the req.body'}); 
    }
    var data = req.body;
    if (!data.account.old_password) {
      return res.status(400).json({msg: 'Old password must not be empty'}); 
    }

    var Customer = req.models.customer;
    return Customer.findById(data.id).then(function(customer) {
      if (!customer) {
        return res.status(404).json({msg: "Can't find the item with id: " + data.id}); 
      }
      if (customer.account_id != res.locals.current_account.id) {
        return res.status(401).json({msg: 'You are not permitted to access this!'}); 
      }
      res.locals.current_customer = customer;
      return next();
    }).catch( function(error){
      return res.status(400).json(error); 
    });
  }, function(req, res, next) {
    var data = req.body;
    var accountData = data.account;
    var account = res.locals.current_account;

    account.checkPasswordMatch(accountData.old_password, function(error, matched){
      if (error) return next(error);

      if (matched) {
        account.set('password', accountData.password);
        account.set('password_confirm', accountData.password_confirm);
        account.save()
          .then(function(updatedAcc){
            return res.json(res.locals.current_customer); 
          }).catch( function(error){
            return res.status(400).json(error); 
          });
      } else {
        return res.status(401).json({msg: 'Your old password is incorrect!'}); 
      }
    });
  }
);
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------
module.exports = api;

