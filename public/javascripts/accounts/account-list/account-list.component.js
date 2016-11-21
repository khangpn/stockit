angular.
  module('accountList').
  component('accountList', { 
    templateUrl: '/accounts/partials/list',
    controller: ['Account',
      function AccountListController(Account) {
        this.orderProp = '-id';
        var self = this;
        this.accounts = Account.query(
          function success(accounts, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );
      }
    ]
  });
