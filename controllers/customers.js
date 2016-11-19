var express = require('express');
var router = express.Router();
var partials = express.Router();

//------------------- Admin Section ----------------------
router.get('/create', function(req, res, next) {
  if (!res.locals.isAdmin) {
    var err = new Error('You are not permitted to access this!');
    err.status = 401;
    return next(err);
  }

  res.render("create");
});

router.post('/create',
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
    var Customer = req.models.customer;

    Customer.create(data)
      .then(function(customer){
        res.redirect("/customers/" + customer.id);
      }, function(error){
        return res.render("create", {
          error: error
        });
      });
  }
);

router.get('/delete/:id',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }

    next();
  }, function(req, res, next) {
    var Customer = req.models.customer;
    Customer.destroy({
      where: { id: req.params.id }
      })
      .then(function(deleteds){
          res.redirect("/customers");
        }, 
        function(error){
          return next(error);
      });
  }
);

router.get('/edit/:id',
  function(req, res, next) {
    if (!res.locals.authenticated) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }

    var Customer = req.models.customer;
    return Customer.findById(req.params.id, {
      include: req.models.account
    }).then(function(customer) {
        if (!customer) return next(new Error("Can't find the customer with id: " + req.params.id));

        if (customer.account.id == res.locals.current_account.id || res.locals.isAdmin) {
          res.locals.customer = customer;
          return next();
        } else {
          var err = new Error('You are not permitted to access this!');
          err.status = 401;
          return next(err);
        }
      }, 
      function(error) {
        return next(error);
    });
  }, function(req, res, next) {
    return res.render('edit'); 
  }
);

router.post('/update',
  function(req, res, next) {
    if (!res.locals.authenticated) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    if (!req.body) return next(new Error('Cannot get the req.body'));
    var data = req.body;

    var Customer = req.models.customer;
    var customer_id = req.body.id;

    return Customer.findById(customer_id, {
      include: req.models.account
    }).then(function(customer) {
        if (!customer) 
          return next(
            new Error("Can't find the customer with id: " + customer_id)
          );

        if (customer.account.id == res.locals.current_account.id || res.locals.isAdmin) {
          res.locals.customer = customer;
          return next();
        } else {
          var err = new Error('You are not permitted to access this!');
          err.status = 401;
          return next(err);
        }
      }, 
      function(error) {
        return next(error);
    });
  }, function(req, res, next) {
    var data = req.body;

    res.locals.customer.update(data).then(function(customer){
      return res.redirect("/customers/" + customer.id);
    }, function (error) {
      return res.render('edit', {
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
  var Customer = req.models.customer;
  Customer.findAll()
    .then(function(customers){
        res.render("list", {customers: customers});
      }, 
      function(error){
        return next(error);
    });
});

router.get('/:id', function (req, res, next) {
  var Customer = req.models.customer;
  Customer.findById(req.params.id).then(function(customer) {
      if (!customer) return next(new Error("Can't find the customer with id: " + req.params.id));
      return res.render('view', {
        customer: customer
      }); 
    }, 
    function(error) {
      return next(error);
  });
});
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------

//----------------- Authenticated section --------------------
//--------------------------------------------------------

//----------------- Partials section --------------------
partials.get('/:name', function (req, res) {
  var name = req.params.name;
  res.render('partials/_' + name);
});

router.use('/partials', partials);
//--------------------------------------------------------

module.exports = router;
