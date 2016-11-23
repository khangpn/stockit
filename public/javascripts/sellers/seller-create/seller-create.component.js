angular.
  module('sellerCreate').
  component('sellerCreate', { 
    templateUrl: '/sellers/partials/create',
    controller: ['$routeParams', '$location', 'Seller',
      function SellerCreateController($routeParams, $location, Seller) {
        var self = this;
        this.save = function(seller) {
          var i= new Seller(seller);
          i.$save(
            function success(seller, resHeader) {
              $location.path('/');
            }, 
            function failure(response) {
              self.error = response.data;
              self.error.status = response.status;
            }
          );
        };
      }
    ]
  });
