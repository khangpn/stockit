angular.
  module('sellerEdit').
  component('sellerEdit', { 
    templateUrl: '/sellers/partials/edit',
    controller: ['$routeParams', '$location', 'Seller',
      function SellerEditController($routeParams, $location, Seller) {
        var self = this;

        this.seller = Seller.get({id:$routeParams.sellerId},
          function success(seller, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.save = function(seller) {
          seller.$save(
            function success(seller, resHeader) {
              $location.path('/sellers/' + seller.id);
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
