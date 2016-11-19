angular.
  module('customerCreate').
  component('customerCreate', { 
    templateUrl: '/customers/partials/create',
    controller: ['$routeParams', '$location', 'Customer',
      function CustomerCreateController($routeParams, $location, Customer) {
        var self = this;
        this.save = function(customer) {
          var i = new Customer(customer);
          i.$save(
            function success(customer, resHeader) {
              $location.path('/customers/' + customer.id);
            }, 
            function failure(res) {
              self.error = res.data;
              self.error.status = res.status;
            }
          );
        };
      }
    ]
  });
