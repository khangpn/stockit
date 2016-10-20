# Features:
1. Order price is allowed to input.
2. Total price must plus 21% TVA.
3. Order view should allow add/remove items.

# Technical notes:
## Angularjs:
- If register controller to the app module directly using 
    var myApp = angular.module("myApp", []);
    myApp.controller("FirstController", function FirstController($scope) {...});
  Then in the view, "ng-controller='FirstController'" must be defined on a tag to make it bound to the controller.
- Otherwise, if register controller as the app COMPONENT
    // Assume this app definition is put separately in another file e.g app.js
    var myApp = angular.module("myApp", []); // define myApp
    
    // The component file e.x first.component.js
    angular.module("myApp). // Get the defined myApp
      component('itemList', {
        template: ... ,
        controller: function FirstController() {
          this.items = [];
        }
      })
  Then we don't have to add *ng-controller='FirstController'* on the view because it already know which TEMPLATE to bind to.
  Adding "ng-controller='FirstController'" on the view again may cause "Argument 'FirstController' is not a function, got undefined" error

## Angularjs + Jade:
- They can be used together
- Define Angular expression as e.g:

    tr(ng-repeat="item in $ctrl.items")
      td {{item.id}}
      td
        a(href='/items/' + "{{item.id}}") {{item.code}}
      td {{item.name}}
      td {{item.price}}
      td {{item.in_stock}}

- In order to render Jade as templateUrl in componet we can put:

    // js file
    angular.
      module('stockit').
      component('itemList', {
        templateUrl: '/items/partials/list', ...

    // On express Item controller
    partials.get('/:name', function (req, res) {
      var name = req.params.name;
      res.render('_' + name);
    });
    
    router.use('/partials', partials);

    // _list.jade
    table.table.table-hover
      thead
        tr
          th ID
          th Code
          th Name
          th Price
          th In stock
      tbody
        tr(ng-repeat="item in $ctrl.items")
          td {{item.id}}
          td
            a(href='/items/' + "{{item.id}}") {{item.code}}
          td {{item.name}}
          td {{item.price}}
          td {{item.in_stock}}

- If we use "=" (equal sign) to print out angularjs scriptlet we need to wrap them between ""

    label.col-md-1 Name:
    div.col-md-11
      = "{{$ctrl.item.name}}"
