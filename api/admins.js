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
  var Admin = req.models.admin;
  Admin.findAll({
    include: [req.models.account]
  })
    .then(function(admins){
      return res.json(admins);
    }).catch( function(error){
      return res.status(400).json(error); 
    });
});
//--------------------------------------------------------

//----------------- Authenticated section --------------------
api.post('/',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    if (!req.body) {
      return res.status(400).json({msg: 'Cannot get the req.body'}); 
    }

    var data = req.body;
    var Sequelize = req.models.Sequelize;
    var errors = [];
    if (data['account'] == undefined) {
      var errorItem = new Sequelize.ValidationErrorItem(
        "The account data is invalid",
        "invalid format",
        "account",
        data['account']
      );
      errors.push(errorItem);
    }
    if (data['account']['email'] == undefined) {
      var errorItem = new Sequelize.ValidationErrorItem(
        "The email is invalid",
        "invalid format",
        "email",
        data['email']
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

    // This is because of the current sequelize version error.
    // Unless we have this, it will add null to admin_id, hence raise "can not be null" error because of our model definition.
    data['account_id'] = 'tmp'; 

    data['account']['is_admin'] = true;
    var Account = req.models.account;
    var Admin = req.models.admin;

    return Admin.create(data, {
      include: [Account]
    }) .then(function(admin){
      return res.json(admin); 
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
    var Admin = req.models.admin;
    Admin.destroy({
      where: { id: req.params.id }
      })
      .then(function(deleteds){
        return res.json(deleteds); 
      }).catch( function(error){
        return res.status(400).json(error); 
      });
  }
);

/*TODO: handle admin and admin views*/
api.get('/:id', 
  function (req, res, next) {
    if (!res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    next();
  }, function (req, res, next) {
    var Admin = req.models.admin;
    Admin.findById(req.params.id, {
      include: [req.models.account]
    }).then(function(admin) {
      if (!admin) {
        return res.status(404).json({msg: "Can't find the admin with id: " + req.params.id}); 
      }

      var returnedAdmin = admin.toJSON();
      returnedAdmin.is_owner = admin.account.id == res.locals.current_account.id;
      return res.json(returnedAdmin); 
    }).catch(function(error) {
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
    var Admin = req.models.admin;
    return Admin.findById(data.id).then(function(admin) {
        if (!admin) {
          return res.status(404).json({msg: "Can't find the admin with id: " + data.id}); 
        }

      return admin.update(data).then(function(admin){
        return res.json(admin); 
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

    var Admin = req.models.admin;
    return Admin.findById(data.id).then(function(admin) {
      if (!admin) {
        return res.status(404).json({msg: "Can't find the item with id: " + data.id}); 
      }
      if (admin.account_id != res.locals.current_account.id) {
        return res.status(401).json({msg: 'You are not permitted to access this!'}); 
      }
      res.locals.current_admin = admin;
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
            return res.json(res.locals.current_admin); 
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

