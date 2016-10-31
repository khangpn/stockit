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
    var Item = req.models.item;

    Item.create(data)
      .then(function(item){
        res.redirect("/items/" + item.id);
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
    var Item = req.models.item;
    Item.destroy({
      where: { id: req.params.id }
      })
      .then(function(deleteds){
          res.redirect("/items");
        }, 
        function(error){
          return next(error);
      });
  }
);

router.get('/edit/:id',
  function(req, res, next) {
    if (!res.locals.isAdmin) {
      var err = new Error('You are not permitted to access this!');
      err.status = 401;
      return next(err);
    }
    next();
  }, function(req, res, next) {
    var Item = req.models.item;
    Item.findById(req.params.id).then(function(item) {
        if (!item) return next(new Error("Can't find the item with id: " + req.params.id));
        return res.render('edit', {
          item: item
        }); 
      }, 
      function(error) {
        return next(error);
    });
  }
);

router.post('/update',
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
    var Item = req.models.item;
    Item.findById(data.id).then(function(item) {
      if (!item) return next(new Error("Can't find the item with id: " + data.id));

      item.update(data).then(function(item){
        return res.redirect("/items/" + item.id);
      }, function (error) {
        return res.render('edit', {
          item: item,
          error: error
        }); 
      });
    }, function(error) {
      return next(error);
    });
  }
);
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
router.get('/', function(req, res, next) {
  var Item = req.models.item;
  Item.findAll()
    .then(function(items){
        return res.render("list", {items: items});
      }, 
      function(error){
        return next(error);
    });
});

router.get('/:id', function (req, res, next) {
  var Item = req.models.item;
  Item.findById(req.params.id).then(function(item) {
      if (!item) return next(new Error("Can't find the item with id: " + req.params.id));
      return res.render('view', {
        item: item
      }); 
    }, 
    function(error) {
      return next(error);
  });
});
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
