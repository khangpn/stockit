angular.
  module('customerCreate').
  component('customerCreate', { 
    templateUrl: '/customers/partials/create',
    controller: ['$routeParams', '$location', 'Customer',
      function CustomerCreateController($routeParams, $location, Customer) {
        var self = this;
        this.save = function(customer) {
          var i= new Customer(customer);
          i.$save(
            function success(customer, resHeader) {
              $location.path('/customers/' + customer.customer.id);
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
