var express = require('express');
var router = express.Router();

//------------------- Unauthorized Section ----------------------
router.get('/create', function(req, res, next) {
  if (res.locals.authenticated) {
    return res.redirect("/");
  }

  res.render("create");
});

router.post('/create', function(req, res, next) {
  if (res.locals.authenticated) {
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

  console.log(data);
  return Customer.create(data, {
    include: [Account]
  })
    .then(function(customer){
      var account = customer.account;
      // Handle logging in
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
    }, function(error){
      return res.render("create", {
        error: error
      });
    });
});
//--------------------------------------------------------

//------------------- Admin Section ----------------------
router.get('/create_admin', function(req, res, next) {
  if (!res.locals.isAdmin) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }

  res.render("create_admin");
});

router.post('/create_admin', 
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
    data['is_admin'] = true;
    var Account = req.models.account;

    Account.create(data)
      .then(function(account){
        res.redirect("/accounts");
      }, function(error){
        return res.render("create_admin", {
          error: error
        });
      });
  }
);

router.get('/', function(req, res, next) {
  if (!res.locals.isAdmin) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }
  var Account = req.models.account;
  Account.findAll({include: req.models.account_detail})
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
router.get('/update_detail', function(req, res, next) {
  if (!res.locals.authenticated) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }

  res.render('detail',
    {
      account: res.locals.current_account
    } 
  );
});

router.post('/update_detail', function(req, res, next) {
  if (!res.locals.authenticated) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }
  var data = req.body;
  var AccountDetail = req.models.account_detail;
  var account = res.locals.current_account;

  var handleSuccess = function () {
    res.redirect('/accounts/' + account.id);
  }

  var handleError = function (account, error) {
     return res.render("detail", {
       account: account,
       error: error
     });
  }

  if (account.account_detail) {
    var detail = account.account_detail;
    detail.update(data).then(
      function(detail) {
        handleSuccess();
      },
      function(error) {
        handleError(account, error);
      }
    );
  } else {
    data.account_id = account.id;
    AccountDetail.create(data)
      .then(function(newAccDetail){
        handleSuccess();
      }, function(error){
        handleError(account, error);
      });
  }
});

router.get('/update_password',
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

router.post('/update_password',
  function(req, res, next) {
    if (!res.locals.authenticated) {
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
      req.models.account_detail
    ]
  }).then(function(account) {
      if (!account) return next(new Error("Can't find the account with id: " + req.params.id));
      return res.render('view', {
        account: account,
        is_owner: account.id == res.locals.current_account.id
      }); 
    }, 
    function(error) {
      return next(error);
  });
});
//--------------------------------------------------------

module.exports = router;
