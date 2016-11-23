angular.
  module('stockList').
  component('stockList', { 
    templateUrl: '/stocks/partials/list',
    controller: ['Stock',
      function StockListController(Stock) {
        this.orderProp = '-id';
        var self = this;
        this.stocks = Stock.query(
          function success(stocks, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );
      }
    ]
  });
