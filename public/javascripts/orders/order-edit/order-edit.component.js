angular.
  module('orderEdit').
  component('orderEdit', { 
    templateUrl: '/orders/partials/edit',
    controller: ['$routeParams', '$location', 'Order',
      function OrderEditController($routeParams, $location, Order) {
        this.order = Order.get({id:$routeParams.orderId}) ;

        var self = this;
        this.save = function(order) {
          order.$save(
            function success(order, resHeader) {
              $location.path('/orders/' + order.id);
            }, 
            function failure(response) {
              self.errors = response.data.errors;
            }
          );
        };
      }
    ]
  });
