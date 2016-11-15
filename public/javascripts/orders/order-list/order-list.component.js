angular.
  module('orderList').
  component('orderList', { 
    templateUrl: '/orders/partials/list',
    controller: ['Order',
      function OrderListController(Order) {
        this.orderProp = '-id';
        this.orders = Order.query();
      }
    ]
  });
