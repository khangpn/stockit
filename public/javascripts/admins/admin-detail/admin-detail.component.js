angular.
  module('adminDetail').
  component('adminDetail', { 
    templateUrl: '/admins/partials/detail',
    controller: ['$routeParams', '$location', 'Admin',
      function AdminDetailController($routeParams, $location, Admin) {
        var self = this;
        this.admin = Admin.get({id:$routeParams.adminId},
          function success(admin, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.editAdmin = function() {
          $location.path('/admins/'+this.admin.id+'/edit');
        };

        this.updatePassword = function() {
          $location.path('/admins/'+this.admin.id+'/password/update');
        };
      }
    ]
  });
