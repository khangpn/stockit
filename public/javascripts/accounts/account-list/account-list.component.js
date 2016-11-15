angular.
  module('accountList').
  component('accountList', { 
    templateUrl: '/accounts/partials/list',
    controller: ['Account',
      function AccountListController(Account) {
        this.orderProp = '-id';
        this.accounts = Account.query();
      }
    ]
  });
