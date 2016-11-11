angular.
  module('orderDetail').
  component('orderDetail', { 
    templateUrl: '/orders/partials/detail',
    controller: ['$routeParams', '$location', 'Order',
      function OrderDetailController($routeParams, $location, Order) {
        this.order = Order.get({id:$routeParams.orderId}) ;

        this.editOrder = function() {
          $location.path('/orders/'+this.order.id+'/edit');
        };
      }
    ]
  });
