var express = require('express');
var router = express.Router();

//------------------- Admin Section ----------------------
router.get('/create', function(req, res, next) {
  if (!res.locals.isAdmin) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }
  res.render("create");
});

router.post('/create', function(req, res, next) {
  if (!res.locals.isAdmin) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }
  if (!req.body) return next(new Error('Cannot get the req.body'));

  var data = req.body;
  var Account = req.models.account;

  Account.create(data)
    .then(function(newAcc){
      res.redirect('/accounts/' + newAcc.id);
    }, function(error){
      return res.render("create", {
        error: error
      });
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

router.get('/update_password', function(req, res, next) {
  if (!res.locals.authenticated) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }

  res.render('update_password', {
    account: res.locals.current_account
  }); 
});

router.post('/update_password', function(req, res, next) {
  if (!res.locals.authenticated) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }
  if (!req.body) return next(new Error('Cannot get the req.body'));

  var data = req.body;
  var Account = req.models.account;
  var id = res.locals.current_account.id;

  Account.findById(data.id)
    .then(function(account) {
        if (!account) return next(new Error("Can't find the account with id: " + req.params.id));
        account.set('password', data.password);
        account.set('password_confirm', data.password_confirm);
        account.save()
          .then(function(updatedAcc){
            res.redirect('/accounts/' + updatedAcc.id);
          }, function(error){
            return res.render("update_password", {
              account: account,
              error: error
            });
          });
       }, 
      function(error) {
        return next(error);
    });
});
//--------------------------------------------------------

//----------------- Authenticated section --------------------
router.get('/', function(req, res, next) {
  if (!res.locals.authenticated) {
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
  })
    .then(function(account) {
      if (!account) return next(new Error("Can't find the account with id: " + req.params.id));
      account.getProjectProfiles({
        where: {
          account_id: account.id
        },
        include: [
          req.models.security_level, 
          req.models.project,
          req.models.account,
          {
            model: req.models.role,
            as: 'roles'
          }
        ]
      })
        .then(function (project_profiles) {
            res.render('view', {
              account: account,
              is_owner: account.id == res.locals.current_account.id,
              project_profiles: project_profiles
            }); 
          }, function (error) {
            return next(error);
          }
        );
      }, 
      function(error) {
        return next(error);
    });
});
//--------------------------------------------------------

module.exports = router;
