angular.
  module('stockEdit').
  component('stockEdit', { 
    templateUrl: '/stocks/partials/edit',
    controller: ['$routeParams', '$location', 'Stock',
      function StockEditController($routeParams, $location, Stock) {
        var self = this;
        this.stock = Stock.get({id:$routeParams.stockId},
          function success(stock, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.save = function(stock) {
          stock.$save(
            function success(stock, resHeader) {
              $location.path('/stocks/' + stock.id);
            }, 
            function failure(response) {
              self.error = response.data;
              self.error.status = response.status;
            }
          );
        };
      }
    ]
  });
