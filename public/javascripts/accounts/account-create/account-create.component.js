angular.
  module('accountCreate').
  component('accountCreate', { 
    templateUrl: '/accounts/partials/create',
    controller: ['$routeParams', '$location', 'Account',
      function AccountCreateController($routeParams, $location, Account) {
        var self = this;
        this.save = function(customer) {
          var i= new Account(customer);
          i.$save(
            function success(customer, resHeader) {
              $location.path('/accounts/' + customer.account.id);
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
