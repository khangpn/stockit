angular.
  module('itemList').
  component('itemList', { 
    templateUrl: '/items/partials/list',
    controller: ['Item',
      function ItemListController(Item) {
        this.orderProp = '-id';
        //when items list returned in the callback, 'this' is not defined, so 'self' point back to the controller instance.
        //var self = this;
        //$http.get('/api/items/').then(function(response) {
        //  self.items = response.data;
        //});
        var self = this;
        this.items = Item.query(
          function success(items, resHeader) {}, 
          function failure(res) {
            self.error = res.data;
            self.error.status = res.status;
          }
        );
      }
    ]
  });
