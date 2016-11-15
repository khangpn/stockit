angular.
  module('core').
  directive('deleteConfirm', ['$http', '$location', function($http, $location) {
    return {
      restrict: 'A',
      scope: {
        objectId: "@", //Read https://docs.angularjs.org/guide/directive
        objectType: "@"
      },
      link: function (scope, elem, attr) {
        //these 2 code blocks are because directive does not update
        //its scope on change, need research on this
        scope.$watch('objectId', function(newValue, oldValue) {
          updateDialog(newValue, scope.objectType);
        });
        scope.$watch('objectType', function(newValue, oldValue) {
          updateDialog(scope.objectId, newValue);
        });

        var updateDialog = function(objectId, objectType) {
          // Config the dialog
          $("#dialog-confirm").dialog({
            autoOpen: false,
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
              "Delete": function() {
                var actionPath = '/api/' + scope.objectType + '/' + scope.objectId;
                var self = this;
                $http.delete(actionPath).then(function(response) {
                  $(self).dialog( "close" );
                  $location.path('/');
                });
              },
              Cancel: function() {
                $( this ).dialog( "close" );
              }
            }
          });
        }

        // This is from Jquery and JqueryUI, trigger the dialog
        elem.on("click", function(e) {
          $("#dialog-confirm").dialog('open');
        });
      }
    };
  }]);
