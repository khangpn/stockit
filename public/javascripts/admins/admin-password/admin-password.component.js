angular.
  module('adminPassword').
  component('adminPassword', { 
    templateUrl: '/admins/partials/update_password',
    controller: ['$routeParams', '$location', 'Admin',
      function AdminPasswordUpdateController($routeParams, $location, Admin) {
        var self = this;
        this.admin = Admin.get({id:$routeParams.adminId},
          function success(admin, resHeader) {
            admin.account.password = '';
          }, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.save = function(admin) {
          Admin.updatePassword({id:admin.id}, admin,
            function success(admin, resHeader) {
              $location.path('/admins/' + admin.id);
            }, 
            function failure(res) {
              self.error = res.data;
              self.error.status = res.status;
            }
          );
        };
      }
    ]
  });
