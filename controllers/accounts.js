var express = require('express');
var router = express.Router();
var partials = express.Router();

//------------------- Unauthorized Section ----------------------
router.get('/create', function(req, res, next) {
  if (res.locals.authenticated && !res.locals.isAdmin) {
    return res.redirect("/");
  }

  res.render("create");
});

router.post('/create', function(req, res, next) {
  if (res.locals.authenticated && !res.locals.isAdmin) {
    return res.redirect("/");
  }

  if (!req.body) return next(new Error('Cannot get the req.body'));

  var data = req.body;
  data['account']['email'] = data['email'];

  // This is because of the current sequelize version error.
  // Unless we have this, it will add null to account_id, hence raise "can not be null" error because of our model definition.
  data['account_id'] = 'tmp'; 

  delete(data['account']['is_admin']);
  var Account = req.models.account;
  var Customer = req.models.customer;

  return Customer.create(data, {
    include: [Account]
  })
    .then(function(customer){
      var account = customer.account;
      // Handle logging in
      if (!res.locals.authenticated) {
        (function login() {
          var Token = req.models.token;
          var token = Token.generateToken();
          var origin_name = token.name;
          token.account_id = account.id;
          token.save()
            .then(function(tk){
              if (data.remember === 'on') {
                res.cookie('token', origin_name, {
                  httpOnly: true,
                  maxAge: 1209600000
                });
              } else {
                res.cookie('token', origin_name, {
                  httpOnly: true
                });
              }
              return res.redirect('/accounts/' + account.id);
              
            }, function(error) {
              return next(error);
            });
        })();
      }
    }, function(error){
      return res.render("create", {
        error: error
      });
    });
});
//--------------------------------------------------------

//------------------- Admin Section ----------------------
router.get('/admin/create', function(req, res, next) {
  if (process.env.NODE_ENV != "development" && !res.locals.isAdmin) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }

  res.render("create_admin");
});

router.post('/admin/create', 
  function(req, res, next) {
    if (process.env.NODE_ENV != "development" && !res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    if (!req.body) return next(new Error('Cannot get the req.body'));

    next();
  }, function(req, res, next) {
    var data = req.body;
    data['account']['email'] = data['email'];
    data['account']['is_admin'] = true;
    data['account_id'] = 'tmp';
    var Account = req.models.account;
    var Admin = req.models.admin;

    return Admin.create(data, {
      include: [Account]
    }).then(function(admin){
        // Handle logging in
        if (!res.locals.authenticated) {
          (function login() {
            var Token = req.models.token;
            var token = Token.generateToken();
            var origin_name = token.name;
            token.account_id = admin.account.id;
            token.save()
              .then(function(tk){
                if (data.remember === 'on') {
                  res.cookie('token', origin_name, {
                    httpOnly: true,
                    maxAge: 1209600000
                  });
                } else {
                  res.cookie('token', origin_name, {
                    httpOnly: true
                  });
                }
                return res.redirect('/accounts/' + admin.account.id);
                
              }, function(error) {
                return next(error);
              });
          })();
        }
      }, function(error){
        return res.render("create_admin", {
          error: error
        });
      });
  }
);

//Angular app
router.get('/', function(req, res, next) {
  return res.render("angular_index");
});

//Normal request
router.get('/list', function(req, res, next) {
  if (!res.locals.isAdmin) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }
  var Account = req.models.account;
  Account.findAll({
    include: [req.models.admin, req.models.customer]
  })
    .then(function(accounts){
        res.render("list", {accounts: accounts});
      }, 
      function(error){
        return next(error);
    });
});

router.get('/delete/:id', function(req, res, next) {
  if (!res.locals.isAdmin) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }
  var Account = req.models.account;
  Account.destroy({
    where: { id: req.params.id }
    })
    .then(function(deleteds){
        res.redirect("/accounts");
      }, 
      function(error){
        return next(error);
    });
});
//--------------------------------------------------------

//------------------- Owner section ----------------------
router.get('/edit/:id', function(req, res, next) {
  if (!res.locals.authenticated) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }

  var Account = req.models.account;
  var Admin = req.models.admin;
  var Customer = req.models.customer;

  return Account.findById(req.params.id, {
    include: [Admin, Customer]
  }).then(function(account) {
      if (!account) 
        return next(new Error("Can't find the account with id: " + req.params.id));

      var isOwner = account.id == res.locals.current_account.id
      var isAdmin = res.locals.isAdmin;

      if (isOwner || isAdmin) {
        if (account.admin)
          return res.redirect("/admins/edit/" + account.admin.id);
        return res.redirect("/customers/edit/" + account.customer.id);
      }
    }, 
    function(error) {
      return next(error);
    });
});

router.get('/:id/password/update',
  function(req, res, next) {
    if (!res.locals.authenticated) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    res.render('update_password', {
      account: res.locals.current_account
    }); 
  }
);

router.post('/:id/password/update',
  function(req, res, next) {
    if (!res.locals.authenticated || res.locals.current_account.id != parseInt(req.params.id)) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    if (!req.body) return next(new Error('Cannot get the req.body'));
    next();
  }, function(req, res, next) {
    var data = req.body;
    var Account = req.models.account;
    var account = res.locals.current_account;

    account.checkPasswordMatch(data.old_password, function(error, matched){
      if (error) return next(error);

      if (matched) {
        account.set('password', data.password);
        account.set('password_confirm', data.password_confirm);
        account.save()
          .then(function(updatedAcc){
            res.redirect('/accounts/' + updatedAcc.id);
          }, function(error){
            console.log(error);
            return res.render("update_password", {
              account: account,
              error: error
            });
          });
      } else {
        var err = new Error('Your old password is incorrect!');
        return next(err);
      }
    });
  }
);
//--------------------------------------------------------

//----------------- Authenticated section --------------------
router.get('/:id', function (req, res, next) {
  if (!res.locals.authenticated) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }
  var Account = req.models.account;
  Account.findById(req.params.id, {
    include: [
      req.models.admin,
      req.models.customer
    ]
  }).then(function(account) {
      if (!account) return next(new Error("Can't find the account with id: " + req.params.id));
      // redirect to angular detail accordings to the account type
      if (account.is_admin) {
        return res.redirect('/admins#!/admins/' + account.admin.id);
      } else {
        return res.redirect('/customers#!/customers/' + account.customer.id);
      }
      //return res.render('view', {
      //  account: account,
      //  isOwner: account.id == res.locals.current_account.id
      //}); 
    }, 
    function(error) {
      return next(error);
  });
});
//--------------------------------------------------------

//----------------- Partials section --------------------
partials.get('/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/_' + name);
});

router.use('/partials', partials);
//--------------------------------------------------------

module.exports = router;
