angular.
  module('sellerList').
  component('sellerList', { 
    templateUrl: '/sellers/partials/list',
    controller: ['Seller',
      function SellerListController(Seller) {
        this.orderProp = '-id';
        //when sellers list returned in the callback, 'this' is not defined, so 'self' point back to the controller instance.
        //var self = this;
        //$http.get('/api/sellers/').then(function(response) {
        //  self.sellers = response.data;
        //});
        var self = this;
        this.sellers = Seller.query(
          function success(sellers, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );
      }
    ]
  });
