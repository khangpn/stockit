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
    var orderDetails = data['order_details'];
    var totalPrice = 0;
    var Sequelize = req.models.Sequelize;

    var errors = [];
    var detailList = {};
    var idList = [];
    for (var i = 0; i < orderDetails.length; i++) {
      var detail = orderDetails[i];
      var itemId = parseInt(detail.item_id);
      var quantity = parseInt(detail.quantity);
      if (isNaN(itemId)) {
        var errorItem = new Sequelize.ValidationErrorItem(
          "The item Id is invalid",
          "invalid format",
          "item_id",
          detail.item_id
        );
        errors.push(errorItem);
        continue;
      }
      if (isNaN(quantity)) {
        var errorItem = new Sequelize.ValidationErrorItem(
          "The item quantity is invalid",
          "invalid format",
          "quantity",
          detail.quantity
        );
        errors.push(errorItem);
        continue;
      }

      if (detailList[itemId] !== undefined) {
        var errorItem = new Sequelize.ValidationErrorItem(
          "The item Id is duplicated",
          "unique Violation",
          "item_id",
          detail.item_id
        );
        errors.push(errorItem);
        continue;
      }

      detailList[itemId] = {item_id: itemId, quantity: quantity, note:detail.note};
      idList.push(itemId);
    }

    if (errors.length !==0) {
      return res.render("create", {
        error: new Sequelize.ValidationError("The input is invalid", errors)
      });
    }

    return Item.findAll({
      where: {
        id: {
          $in: idList
        }
      }
    }).then(
      function(items) {
        if (items.length != orderDetails.length) {
          return next(new Error('The items list is invalid'));
        }
        res.locals.items = items;
        res.locals.details = detailList;
        return next();
      }, function(error) {
        return next(error);
      }
    );
  }, function(req, res, next) {
    var data = req.body;
    var items = res.locals.items;
    var details = res.locals.details;
    var account = res.locals.current_account;
    console.log(details);

    var OrderDetail = req.models.order_detail;
    var Order = req.models.order;

    var order = {
      account_id: account.id,
      customer_id: data.customer_id,
      total_price: 0,
      note: data.note,
      order_details: []
    };

    for (var i=0; i<items.length; i++) {
      var item = items[i];
      var itemId = item.id;
      var detail = details[itemId];

      detail.price = item.price;
      detail.total_price = detail.price * detail.quantity;
      order.total_price += detail.total_price;

      detail.order_id = 'tmp';

      order.order_details.push(detail);
    }

    return Order.create(order, 
      {
        include: [OrderDetail]
      }
    ).then(function(order){
        res.redirect("/orders/" + order.id);
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
    var Order = req.models.order;
    Order.destroy({
      where: { id: req.params.id }
      })
      .then(function(deleteds){
          res.redirect("/orders");
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
    var Order = req.models.order;
    Order.findById(req.params.id).then(function(order) {
        if (!order) return next(new Error("Can't find the order with id: " + req.params.id));
        return res.render('edit', {
          order: order
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
    var Order = req.models.order;
    Order.findById(data.id).then(function(order) {
      if (!order) return next(new Error("Can't find the order with id: " + data.id));

      order.update(data).then(function(order){
        return res.redirect("/orders/" + order.id);
      }, function (error) {
        return res.render('edit', {
          order: order,
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
  var Order = req.models.order;
  Order.findAll()
    .then(function(orders){
        if (res.locals.isAdmin) {
          return res.render("list_admin", {orders: orders});
        } else {
          return res.render("list", {orders: orders});
        }
      }, 
      function(error){
        return next(error);
    });
});

router.get('/:id', function (req, res, next) {
  var Order = req.models.order;
  Order.findById(req.params.id).then(function(order) {
      if (!order) return next(new Error("Can't find the order with id: " + req.params.id));
      return res.render('view', {
        order: order
      }); 
    }, 
    function(error) {
      return next(error);
  });
});
//--------------------------------------------------------

//----------------- Authenticated section --------------------
//--------------------------------------------------------

module.exports = router;
