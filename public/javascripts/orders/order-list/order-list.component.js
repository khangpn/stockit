angular.
  module('orderList').
  component('orderList', { 
    templateUrl: '/orders/partials/list',
    controller: ['Order',
      function OrderListController(Order) {
        this.orderProp = '-id';
        var self = this;
        this.orders = Order.query(
          function success(order, resHeader) {}, 
          function failure(response) {
            self.error = response.data;
            self.error.status = response.status;
          }
        );
      }
    ]
  });
