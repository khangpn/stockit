angular.
  module('accountCreate').
  component('accountCreate', { 
    templateUrl: '/accounts/partials/create',
    controller: ['$routeParams', '$location', 'Account',
      function AccountCreateController($routeParams, $location, Account) {
        var self = this;
        this.save = function(account) {
          var i= new Account(account);
          i.$save(
            function success(account, resHeader) {
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
