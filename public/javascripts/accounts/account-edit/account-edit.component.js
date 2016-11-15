angular.
  module('accountEdit').
  component('accountEdit', { 
    templateUrl: '/accounts/partials/edit',
    controller: ['$routeParams', '$location', 'Account',
      function AccountEditController($routeParams, $location, Account) {
        this.account = Account.get({id:$routeParams.accountId}) ;

        var self = this;
        this.save = function(account) {
          account.$save(
            function success(account, resHeader) {
              $location.path('/accounts/' + account.id);
            }, 
            function failure(response) {
              self.errors = response.data.errors;
            }
          );
        };
      }
    ]
  });
