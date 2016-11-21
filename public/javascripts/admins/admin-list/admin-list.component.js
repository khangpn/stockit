angular.
  module('adminList').
  component('adminList', { 
    templateUrl: '/admins/partials/list',
    controller: ['Admin',
      function AdminListController(Admin) {
        this.orderProp = '-id';
        var self = this;
        this.admins = Admin.query(
          function success(admins, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );
      }
    ]
  });
