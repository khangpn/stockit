angular.
  module('orderEdit').
  component('orderEdit', { 
    templateUrl: '/orders/partials/edit',
    controller: ['$routeParams', '$location', 'Order',
      function OrderEditController($routeParams, $location, Order) {
        var self = this;
        this.order = Order.get({id:$routeParams.orderId},
          function success(order, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.save = function(order) {
          order.$save(
            function success(order, resHeader) {
              $location.path('/orders/' + order.id);
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
