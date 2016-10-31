angular.
  module('itemCreate').
  component('itemCreate', { 
    templateUrl: '/items/partials/create',
    controller: ['$routeParams', '$location', 'Item',
      function ItemCreateController($routeParams, $location, Item) {
        var self = this;
        this.create = function(item) {
          console.log(item);
          var i= new Item(item);
          i.$save(
            function success(item, resHeader) {
              $location.path('/');
            }, 
            function failure(response) {
              console.log(response);
              self.errors = response.data.errors;
            }
          );
        };
      }
    ]
  });
