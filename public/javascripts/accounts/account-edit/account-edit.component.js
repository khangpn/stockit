angular.
  module('accountEdit').
  component('accountEdit', { 
    templateUrl: '/accounts/partials/edit',
    controller: ['$routeParams', '$location', 'Account',
      function AccountEditController($routeParams, $location, Account) {
        var self = this;
        this.account = Account.get({id:$routeParams.accountId},
          function success(account, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

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
