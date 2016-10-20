angular.
  module('itemDetail').
  component('itemDetail', { 
    templateUrl: '/items/partials/detail',
    controller: ['$routeParams', '$http',
      function ItemDetailController($routeParams, $http) {
        var self = this;
        //self.item = {};
        $http.get('/api/items/' + $routeParams.itemId).then(function(response) {
          self.item = response.data;
        });
      }
    ]
  });
