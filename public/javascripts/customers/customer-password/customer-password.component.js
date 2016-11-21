angular.
  module('customerPassword').
  component('customerPassword', { 
    templateUrl: '/customers/partials/update_password',
    controller: ['$routeParams', '$location', 'Customer',
      function CustomerPasswordUpdateController($routeParams, $location, Customer) {
        var self = this;
        this.customer = Customer.get({id:$routeParams.customerId},
          function success(customer, resHeader) {
            customer.account.password = '';
          }, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.save = function(customer) {
          Customer.updatePassword({id:customer.id}, customer,
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
