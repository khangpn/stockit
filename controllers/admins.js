var express = require('express');
var router = express.Router();

//------------------- Owner section ----------------------
router.get('/edit/:id', function(req, res, next) {
    if (!res.locals.authenticated || !res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }

    return res.locals.current_account.getAdmin().then(
      function(admin) {
        if (!admin) return next(new Error("Can't find the admin info"));
        if (admin.id != req.params.id) {
          var err = new Error('You are not permitted to access this!');
          err.status = 401;
          return next(err);
        }
        res.locals.admin = admin;
        return next();
      }, function(error) {
        return next(error);
      }
    );
  }, function(req, res, next) {
    return res.render('edit');
  }
);

router.post('/update', function(req, res, next) {
    if (!req.body) return next(new Error('Cannot get the req.body'));
    if (!res.locals.authenticated || !res.locals.isAdmin || 
    res.locals.current_account.id != parseInt(req.body['id'])) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    next();
  }, function(req, res, next) {
    var data = req.body;
    var Admin = req.models.admin;

    res.locals.current_account.getAdmin().then(
      function(admin) {
        if (!admin) return next(new Error("Can't find the admin info"));
        admin.update(data).then(function(admin) {
          return res.redirect("/admins/" + admin.id);
        }, function(error) {
          return res.render('edit', {
            error: error
          }); 
        });
      }, function(error) {
        return next(error);
      }
    );
  }
);
//--------------------------------------------------------

//------------------- Admin section ----------------------
router.get('/', function(req, res, next) {
    if (!res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    next();
  }, function(req, res, next) {
    var Admin = req.models.admin;
    Admin.findAll({
      include: req.models.account
    }).then(
      function(admins) {
        return res.render('list', {
          admins: admins
        });
      }, function(error) {
        return next(error);
      }
    );
  }
);

router.get('/:id', function(req, res, next) {
    if (!res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    next();
  }, function(req, res, next) {
    return res.locals.current_account.getAdmin().then(
      function(admin) {
        if (!admin) return next(new Error("Can't find the admin info"));
        return res.render('view', {
          admin: admin
        });
      }, function(error) {
        return next(error);
      }
    );
  }
);
//--------------------------------------------------------
module.exports = router;
