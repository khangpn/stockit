angular.
  module('customerDetail').
  component('customerDetail', { 
    templateUrl: '/customers/partials/detail',
    controller: ['$routeParams', '$location', 'Customer',
      function CustomerDetailController($routeParams, $location, Customer) {
        var self = this;
        this.customer = Customer.get({id:$routeParams.customerId},
          function success(customer, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.editCustomer = function() {
          $location.path('/customers/'+this.customer.id+'/edit');
        };

        this.updatePassword = function() {
          $location.path('/customers/'+this.customer.id+'/password/update');
        };
      }
    ]
  });
