angular.
  module('itemList').
  component('itemList', { 
    templateUrl: '/items/partials/list',
    controller: ['Item',
      function ItemListController(Item) {
        //when items list returned in the callback, 'this' is not defined, so 'self' point back to the controller instance.
        this.orderProp = 'default';
        var self = this;
        //$http.get('/api/items/').then(function(response) {
        //  self.items = response.data;
        //});
        this.items = Item.query();
      }
    ]
  });
