angular.
  module('orderCreate').
  component('orderCreate', { 
    templateUrl: '/orders/partials/create',
    controller: ['$routeParams', '$location', 'Order',
      function OrderCreateController($routeParams, $location, Order) {
        this.order = {};
        this.order.order_details = [];
        function OrderDetail() {
          this.item_code = '';
          this.quantity = 0;
          this.note = '';
        };

        var emptyOrderDetail = new OrderDetail();
        this.order.order_details.push(emptyOrderDetail);

        this.addItem = function() {
          var entry = new OrderDetail();
          this.order.order_details.push(entry);
        };

        this.removeItem = function(entry) {
          var index = this.order.order_details.indexOf(entry);
          this.order.order_details.splice(index,1);
        };

        var self = this;
        this.save = function(order) {
          var newOrder = new Order(order);
          newOrder.$save(
            function success(order, resHeader) {
              $location.path('/');
            }, 
            function failure(response) {
              self.errors = response.data.errors;
            }
          );
        };
      }
    ]
  });
