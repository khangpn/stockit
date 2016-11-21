var express = require('express');
var api = express.Router();

//------------------- Admin Section ----------------------
api.get('/',
  function(req, res, next) {
    if (!res.locals.authenticated || !res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    next();
  }, function(req, res, next) {
  var Order = req.models.order;

  /*TODO: Should handle owner and admin scenario*/
  Order.findAll({raw:true})
    .then(function(orders){
      return res.json(orders);
  }).catch(function (error) {
    return res.status(400).json(error); 
  });
});

api.post('/',
  function(req, res, next) {
    if (!res.locals.authenticated || !res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    if (!req.body) {
      return res.status(400).json({msg: 'Cannot get the req.body'}); 
    }

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
      return res.status(400).json(error); 
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
        return res.status(201).json(order); 
      });
    }).catch(function (error) {
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
    var Order = req.models.order;
    Order.destroy({
      where: { id: req.params.id }
      })
      .then(function(deleteds){
        return res.json(deleteds); 
      }).catch(function(error){
        return res.status(400).json(error); 
      });
  }
);

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
    var Order = req.models.order;
    Order.findById(data.id).then(function(order) {
      if (!order) {
        return res.status(404).json({msg: "Can't find the order with id: " + data.id}); 
      }

      order.update(data).then(function(order){
        return res.json(order); 
      }, function (error) {
        return res.status(400).json(error); 
      });
    }, function(error) {
      return res.status(400).json(error); 
    });
  }
);

// Load an order's order_details
//api.get('/:id/details', 
//  function(req, res, next) {
//    if (!res.locals.authenticated || !res.locals.isAdmin) {
//      var err = new Error('You are not permitted to access this!');
//      err.status = 401;
//      return next(err);
//    }
//    next();
//  }, function(req, res, next) {
//  }
//);

api.get('/:id', 
  function(req, res, next) {
    /*TODO: Handle owner and admin scenario*/
    if (!res.locals.authenticated || !res.locals.isAdmin) {
      return res.status(401).json({msg: 'You are not permitted to access this!'}); 
    }
    next();
  }, function(req, res, next) {
    var Order = req.models.order;
    var Item = req.models.item;
    var Customer = req.models.customer;
    return Order.findById(req.params.id, {
      include: [Customer]
    }).then(function(order) {
        if (!order) {
          return res.status(404).json({msg: "Can't find the order with id: " + + req.params.id}); 
        }
        order.getOrder_details({
          include: [Item]
        }).then(function (details) {
          var returnedData = order.toJSON();
          returnedData.details = details;
          return res.json(returnedData); 
        }).catch(function(error) {
          return res.status(400).json(error); 
        });
        return null; //either return the getOrder_details promise or null will stop the promise warning
    }).catch(function (error) {
      return res.status(400).json(error); 
    });
  }
);
//--------------------------------------------------------

//----------------- Authenticated section --------------------
//--------------------------------------------------------

//------------------- Unauthorized Section ----------------------
//--------------------------------------------------------
module.exports = api;
