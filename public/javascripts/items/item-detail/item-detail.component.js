angular.
  module('itemDetail').
  component('itemDetail', { 
    templateUrl: '/items/partials/detail',
    controller: ['$routeParams', '$location', 'Item',
      function ItemDetailController($routeParams, $location, Item) {
        this.item = Item.get({id:$routeParams.itemId}) ;
        //$http.get('/api/items/' + $routeParams.itemId).then(function(response) {
        //  self.item = response.data;
        //});

        //Deletting is handled in core/delete-confirm
        //var self = this;
        //this.deleteItem = function() {
        //  self.item.$delete(
        //    function success(item, resHeader) {
        //      $location.path('/');
        //    }, 
        //    function failure(response) {
        //      self.errors = response.data.errors;
        //    }
        //  );
        //};

        this.editItem = function() {
          $location.path('/items/'+this.item.id+'/edit');
        };
      }
    ]
  });
