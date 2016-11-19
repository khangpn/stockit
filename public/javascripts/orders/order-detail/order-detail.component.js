angular.
  module('orderDetail').
  component('orderDetail', { 
    templateUrl: '/orders/partials/detail',
    controller: ['$routeParams', '$location', 'Order',
      function OrderDetailController($routeParams, $location, Order) {
        var self = this;
        this.order = Order.get({id:$routeParams.orderId},
          function success(order, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.editOrder = function() {
          $location.path('/orders/'+this.order.id+'/edit');
        };
      }
    ]
  });
