angular.
  module('customerEdit').
  component('customerEdit', { 
    templateUrl: '/customers/partials/edit',
    controller: ['$routeParams', '$location', 'Customer',
      function CustomerEditController($routeParams, $location, Customer) {
        var self = this;
        this.customer = Customer.get({id:$routeParams.customerId},
          function success(customer, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.save = function(customer) {
          customer.$save(
            function success(customer, resHeader) {
              $location.path('/customers/' + customer.id);
            }, 
            function failure(response) {
              self.errors = response.data.errors;
            }
          );
        };
      }
    ]
  });
