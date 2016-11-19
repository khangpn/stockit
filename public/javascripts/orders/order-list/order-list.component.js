angular.
  module('orderList').
  component('orderList', { 
    templateUrl: '/orders/partials/list',
    controller: ['Order',
      function OrderListController(Order) {
        this.orderProp = '-id';
        var self = this;
        this.orders = Order.query(
          function success(orders, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );
      }
    ]
  });
