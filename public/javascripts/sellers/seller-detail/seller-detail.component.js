angular.
  module('sellerDetail').
  component('sellerDetail', { 
    templateUrl: '/sellers/partials/detail',
    controller: ['$routeParams', '$location', 'Seller',
      function SellerDetailController($routeParams, $location, Seller) {
        var self = this;
        this.seller = Seller.get({id:$routeParams.sellerId},
          function success(seller, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );

        this.editSeller = function() {
          $location.path('/sellers/'+this.seller.id+'/edit');
        };
      }
    ]
  });
