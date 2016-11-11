angular.
  module('orderCreate').
  component('orderCreate', { 
    templateUrl: '/orders/partials/create',
    controller: ['$routeParams', '$location', 'Order',
      function OrderCreateController($routeParams, $location, Order) {
        var self = this;
        this.save = function(order) {
          var i= new Order(order);
          i.$save(
            function success(order, resHeader) {
              $location.path('/');
            }, 
            function failure(response) {
              console.log(response);
              self.errors = response.data.errors;
            }
          );
        };
      }
    ]
  });
