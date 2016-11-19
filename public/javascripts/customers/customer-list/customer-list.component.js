angular.
  module('customerList').
  component('customerList', { 
    templateUrl: '/customers/partials/list',
    controller: ['Customer',
      function CustomerListController(Customer) {
        this.orderProp = '-id';
        var self = this;
        this.customers = Customer.query(
          function success(customers, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
            console.log(self.error);
          }
        );
      }
    ]
  });
