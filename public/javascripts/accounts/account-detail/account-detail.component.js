angular.
  module('accountDetail').
  component('accountDetail', { 
    templateUrl: '/accounts/partials/detail',
    controller: ['$routeParams', '$location', 'Account',
      function AccountDetailController($routeParams, $location, Account) {
        this.account = Account.get({id:$routeParams.accountId}) ;

        this.editAccount = function() {
          $location.path('/accounts/'+this.account.id+'/edit');
        };
      }
    ]
  });
