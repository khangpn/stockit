angular.
  module('accountDetail').
  component('accountDetail', { 
    templateUrl: '/accounts/partials/detail',
    controller: ['$routeParams', '$location', 'Account',
      function AccountDetailController($routeParams, $location, Account) {
        var self = this;
        this.account = Account.get({id:$routeParams.accountId},
          function success(account, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.editAccount = function() {
          $location.path('/accounts/'+this.account.id+'/edit');
        };
      }
    ]
  });
