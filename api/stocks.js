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
  var Stock = req.models.stock;
  var Seller = req.models.seller;

  /*TODO: Should handle owner and admin scenario*/
  Stock.findAll({
    include: [Seller]
  })
    .then(function(stocks){
      return res.json(stocks);
  }).catch(function (error) {
    next(error);
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
    var Seller = req.models.seller;
    var stockDetails = data['stock_details'];
    var totalPrice = 0;
    var Sequelize = req.models.Sequelize;
    var errors = [];

    var detailList = {};
    var codeList = [];
    for (var i = 0; i < stockDetails.length; i++) {
      var detail = stockDetails[i];
      //var itemId = parseInt(detail.item_id);
      var itemCode = detail.item_code;
      var quantity = parseInt(detail.quantity);
      if (isNaN(quantity) || quantity <= 0) {
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
      var error = new Sequelize.ValidationError("The input is invalid", errors);
      return res.status(400).json(error); 
    }

    // used for promises to throw error to the "catch"
    var throw_errors = function(errors) {
      if (errors.length !==0) {
        throw new Sequelize.ValidationError("The input is invalid", errors);
      }
    };

    var sellerId = data.seller_id;
    Seller.findById(sellerId).then(function(seller) {
      if (!seller) {
        var errorItem = new Sequelize.ValidationErrorItem(
          "Cannot find the seller",
          "entry not found",
          "seller_id",
          sellerId
        );
        errors.push(errorItem);
        throw_errors(errors); // report invalid seller
      }
    }).then(function () {
      return Item.findAll({
        where: {
          code: {
            $in: codeList
          }
        }
      }).then(function(items) {
        if (items.length != stockDetails.length) {
          var errorItem = new Sequelize.ValidationErrorItem(
            "The item codes are invalid",
            "invalid format",
            "item_code",
            codeList
          );
          errors.push(errorItem);
          throw_errors(errors); //report the item code
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

    var StockDetail = req.models.stock_detail;
    var Stock = req.models.stock;
    var Item = req.models.stock;

    var stock = {
      account_id: account.id,
      seller_id: data.seller_id,
      total_price: 0,
      note: data.note,
      stock_details: []
    };

    for (var i=0; i<items.length; i++) {
      var item = items[i];
      var itemCode = item.code;
      var detail = details[itemCode];

      detail.item_id = item.id;
      detail.price = item.price;
      detail.total_price = detail.price * detail.quantity;
      stock.total_price += detail.total_price;

      detail.stock_id = 'sequelize need to fix this';

      stock.stock_details.push(detail);

      item.in_stock += detail.quantity;
    }

    var sequelize = req.models.sequelize;
    return Stock.create(stock, 
      {
        include: [StockDetail]
      }
    ).then(function(stock) {
      var Promise = require('promise');
      var itemPromises = [];
      for (var i=0; i<items.length; i++) {
        var item = items[i];
        itemPromises.push(item.save());
      }
      return Promise.all(itemPromises).then(function (items) {
        return res.status(201).json(stock); 
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
    var Stock = req.models.stock;
    Stock.destroy({
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
    var Stock = req.models.stock;
    Stock.findById(data.id).then(function(stock) {
      if (!stock) {
        return res.status(404).json({msg: "Can't find the stock with id: " + data.id}); 
      }

      stock.update(data).then(function(stock){
        return res.json(stock); 
      }, function (error) {
        return res.status(400).json(error); 
      });
    }, function(error) {
      return res.status(400).json(error); 
    });
  }
);

// Load an stock's stock_details
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
    var Stock = req.models.stock;
    var Item = req.models.item;
    var Seller = req.models.seller;
    return Stock.findById(req.params.id, {
      include: [Seller]
    }).then(function(stock) {
        if (!stock) {
          return res.status(404).json({msg: "Can't find the stock with id: " + + req.params.id}); 
        }
        stock.getStock_details({
          include: [Item]
        }).then(function (details) {
          var returnedData = stock.toJSON();
          returnedData.details = details;
          return res.json(returnedData); 
        }).catch(function(error) {
          return res.status(400).json(error); 
        });
        return null; //either return the getStock_details promise or null will stop the promise warning
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
