angular.
  module('itemDetail').
  component('itemDetail', { 
    templateUrl: '/items/partials/detail',
    controller: ['$routeParams', 'Item',
      function ItemDetailController($routeParams, Item) {
        var self = this;
        self.item = Item.get({id:$routeParams.itemId}) ;
        //$http.get('/api/items/' + $routeParams.itemId).then(function(response) {
        //  self.item = response.data;
        //});
      }
    ]
  });
