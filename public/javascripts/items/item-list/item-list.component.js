angular.
  module('itemList').
  component('itemList', { 
    templateUrl: '/items/partials/list',
    controller: ['$http',
      function ItemListController($http) {
        //when items list returned in the callback, 'this' is not defined, so 'self' point back to the controller instance.
        var self = this;
        self.orderProp = 'default';
        $http.get('/api/items/').then(function(response) {
          self.items = response.data;
        });
      }
    ]
  });
