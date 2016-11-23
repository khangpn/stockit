angular.
  module('stockCreate').
  component('stockCreate', { 
    templateUrl: '/stocks/partials/create',
    controller: ['$routeParams', '$location', 'Stock',
      function StockCreateController($routeParams, $location, Stock) {
        this.stock = {};
        this.stock.stock_details = [];
        function StockDetail() {
          this.item_code = '';
          this.quantity = 0;
          this.note = '';
        };

        var emptyStockDetail = new StockDetail();
        this.stock.stock_details.push(emptyStockDetail);

        this.addItem = function() {
          var entry = new StockDetail();
          this.stock.stock_details.push(entry);
        };

        this.removeItem = function(entry) {
          var index = this.stock.stock_details.indexOf(entry);
          this.stock.stock_details.splice(index,1);
        };

        var self = this;
        this.save = function(stock) {
          var newStock = new Stock(stock);
          newStock.$save(
            function success(stock, resHeader) {
              $location.path('/');
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
