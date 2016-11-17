angular.
  module('itemCreate').
  component('itemCreate', { 
    templateUrl: '/items/partials/create',
    controller: ['$routeParams', '$location', 'Item',
      function ItemCreateController($routeParams, $location, Item) {
        var self = this;
        this.save = function(item) {
          var i= new Item(item);
          i.$save(
            function success(item, resHeader) {
              $location.path('/');
            }, 
            function failure(response) {
              self.error = response.data;
            }
          );
        };
      }
    ]
  });
