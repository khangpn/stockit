angular.
  module('itemEdit').
  component('itemEdit', { 
    templateUrl: '/items/partials/edit',
    controller: ['$routeParams', '$location', 'Item',
      function ItemEditController($routeParams, $location, Item) {
        this.untouched = this.item = Item.get({id:$routeParams.itemId}) ;

        var self = this;
        this.save = function(item) {
          item.$save(
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
