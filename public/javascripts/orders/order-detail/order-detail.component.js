angular.
  module('orderDetail').
  component('orderDetail', { 
    templateUrl: '/orders/partials/detail',
    controller: ['$routeParams', '$location', 'Order',
      function OrderDetailController($routeParams, $location, Order) {
        var self = this;
        this.order = Order.get({id:$routeParams.orderId}
          function success(order, resHeader) {}, 
          function failure(response) {
            self.error = response.data;
            self.error.status = response.status;
          }
        );

        this.editOrder = function() {
          $location.path('/orders/'+this.order.id+'/edit');
        };
      }
    ]
  });
