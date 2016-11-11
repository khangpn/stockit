angular.
  module('orderDetail').
  component('orderDetail', { 
    templateUrl: '/orders/partials/detail',
    controller: ['$routeParams', '$location', 'Order',
      function OrderDetailController($routeParams, $location, Order) {
        var self = this;
        Order.get({id:$routeParams.orderId}, 
          function success(data) {
            self.order = data.order;
            self.details = data.details;
          }
        ) ;

        this.editOrder = function() {
          $location.path('/orders/'+this.order.id+'/edit');
        };
      }
    ]
  });
