angular.
  module('stockDetail').
  component('stockDetail', { 
    templateUrl: '/stocks/partials/detail',
    controller: ['$routeParams', '$location', 'Stock',
      function StockDetailController($routeParams, $location, Stock) {
        var self = this;
        this.stock = Stock.get({id:$routeParams.stockId},
          function success(stock, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.editStock = function() {
          $location.path('/stocks/'+this.stock.id+'/edit');
        };
      }
    ]
  });
