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
    var Customer = req.models.customer;
    var orderDetails = data['order_details'];
    var totalPrice = 0;
    var Sequelize = req.models.Sequelize;
    var errors = [];

    var detailList = {};
    var codeList = [];
    for (var i = 0; i < orderDetails.length; i++) {
      var detail = orderDetails[i];
      //var itemId = parseInt(detail.item_id);
      var itemCode = detail.item_code;
      var quantity = parseInt(detail.quantity);
      //if (isNaN(itemId)) {
      //  var errorItem = new Sequelize.ValidationErrorItem(
      //    "The item Id is invalid",
      //    "invalid format",
      //    "item_id",
      //    detail.item_id
      //  );
      //  errors.push(errorItem);
      //  continue;
      //}
      if (isNaN(quantity)) {
        var errorItem = new Sequelize.ValidationErrorItem(
          "The quantity is invalid",
          "invalid format",
          "quantity",
          quantity
        );
        errors.push(errorItem);
        continue;
      }
      if (detailList[itemCode] !== undefined) {
        var errorItem = new Sequelize.ValidationErrorItem(
          "The item Code is duplicated",
          "unique Violation",
          "item_code",
          detail.item_code
        );
        errors.push(errorItem);
        continue;
      }

      detailList[itemCode] = {item_id: null, item_code: itemCode, quantity: quantity, note:detail.note};
      codeList.push(itemCode);
    }

    if (errors.length !==0) {
      return res.render("create", {
        error: new Sequelize.ValidationError("The input is invalid", errors)
      });
    }

    // used for promises to throw error to the "catch"
    var throw_errors = function(errors) {
      if (errors.length !==0) {
        throw new Sequelize.ValidationError("The input is invalid", errors);
      }
    }

    var customerId = data.customer_id;
    Customer.findById(customerId).then(function(customer) {
      if (!customer) {
        var errorItem = new Sequelize.ValidationErrorItem(
          "Cannot find the customer",
          "entry not found",
          "customer_id",
          customerId
        );
        errors.push(errorItem);
        throw_errors(errors); // report invalid customer
      }
    }).then(function () {
      return Item.findAll({
        where: {
          code: {
            $in: codeList
          }
        }
      }).then(function(items) {
        if (items.length != orderDetails.length) {
          var errorItem = new Sequelize.ValidationErrorItem(
            "The item codes are invalid",
            "invalid format",
            "item_code",
            codeList
          );
          errors.push(errorItem);
          throw_errors(errors); //report the item code
        }

        for (var i=0; i<items.length; i++) {
          var item = items[i];
          var detail = detailList[item.code];
          if (item.in_stock < detail.quantity) {
            var errorItem = new Sequelize.ValidationErrorItem(
              "The number of item in stock is less than the order quantity",
              "over quantity",
              "quantity",
              detail.quantity
            );
            errors.push(errorItem); //report item in stock
          }
        }

        throw_errors(errors); //report the item quantity

        res.locals.items = items;
        res.locals.code_list = codeList;
        res.locals.details = detailList;
        next();
        return null;
      });
    }).catch(function (error) {
      res.render("create", {
        error: error
      });
    });
  }, function(req, res, next) {
    var data = req.body;
    var items = res.locals.items;
    var details = res.locals.details;
    var account = res.locals.current_account;

    var OrderDetail = req.models.order_detail;
    var Order = req.models.order;
    var Item = req.models.order;

    var order = {
      account_id: account.id,
      customer_id: data.customer_id,
      total_price: 0,
      note: data.note,
      order_details: []
    };

    for (var i=0; i<items.length; i++) {
      var item = items[i];
      var itemCode = item.code;
      var detail = details[itemCode];

      detail.item_id = item.id;
      detail.price = item.price;
      detail.total_price = detail.price * detail.quantity;
      order.total_price += detail.total_price;

      detail.order_id = 'sequelize need to fix this';

      order.order_details.push(detail);

      item.in_stock -= detail.quantity;
    }

    var sequelize = req.models.sequelize;
    return Order.create(order, 
      {
        include: [OrderDetail]
      }
    ).then(function(order) {
      var Promise = require('promise');
      var itemPromises = [];
      for (var i=0; i<items.length; i++) {
        var item = items[i];
        itemPromises.push(item.save());
      }
      return Promise.all(itemPromises).then(function (items) {
        res.redirect("/orders/" + order.id);
        return null;
      });
    }).catch(function (error) {
      res.render("create", {
        error: error
      });
    });

    /*Another way to do this task for reference*/
    //var Item = req.models.order;
    //var order = {
    //  account_id: account.id,
    //  customer_id: data.customer_id,
    //  total_price: 0,
    //  note: data.note
    //};

    //return Order.create(order).then(function(order) {
    //  var itemPromises = [];
    //  var detailArray = [];
    //  for (var i=0; i<items.length; i++) {
    //    var item = items[i];
    //    var itemId = item.id;
    //    var detail = details[itemId];

    //    detail.price = item.price;
    //    detail.total_price = detail.price * detail.quantity;
    //    order.total_price += detail.total_price;

    //    detail.order_id = order.id;

    //    item.in_stock -= detail.quantity;
    //    itemPromises.push(item.save());
    //    detailArray.push(detail);
    //  }
    //  
    //  return OrderDetail.bulkCreate(detailArray, {
    //    validate: true
    //  }).then(function () {
    //    return order.getDetails().then(
    //      function(orderDetails) {
    //        for (var i = 0; i < orderDetails.length; i++) {
    //          var orderDetail = orderDetails[i];
    //          order.addPrice(orderDetail.price);
    //        }
    //        return order.save();
    //      }
    //    ).then(function (order) {
    //      var Sequelize = req.models.Sequelize;
    //      var Promise = Sequelize.Promise;

    //      Promise.all(itemPromises).then(function (items) {
    //        res.redirect("/orders/" + order.id);
    //      }).catch(function (error) {
    //        res.render("create", {
    //          error: error
    //        });
    //      });
    //      return null;
    //    }).catch(function (error) {
    //      next(error);
    //    });
    //  }).catch(function (error) {
    //    res.render("create", {
    //      error: error
    //    });
    //  });
    //}).catch(function (error) {
    //  res.render("create", {
    //    error: error
    //  });
    //});
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

      return order.update(data).then(function(order){
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
// Normal request
router.get('/list', function(req, res, next) {
  var Order = req.models.order;
  Order.findAll()
    .then(function(orders){
        if (res.locals.isAdmin) {
          return res.render("list_admin", {orders: orders});
        } else {
          return res.render("list", {orders: orders});
        }
    }).catch(function(error) {
      return next(error);
    });
});

// Angular version, data will be loaded from client
router.get('/', function(req, res, next) {
  if (res.locals.isAdmin) {
    return res.render("list_admin");
  } else {
    return res.render("list");
  }
});

router.get('/:id', function (req, res, next) {
  var Order = req.models.order;
  var Item = req.models.item;
  var Customer = req.models.customer;
  return Order.findById(req.params.id, {
    include: [Customer]
  }).then(function(order) {
      if (!order) return next(new Error("Can't find the order with id: " + req.params.id));
      order.getOrder_details({
        include: [Item]
      }).then(function (details) {
        return res.render('view', {
          order: order,
          details: details
        }); 
      }).catch(function(error) {
        return next(error);
      });
      return null; //either return the getOrder_details promise or null will stop the promise warning
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
