'use strict';

describe('Controller: PropertydialogCtrl', function () {

  // load the controller's module
  beforeEach(module('grafterizerApp'));

  var PropertydialogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PropertydialogCtrl = $controller('PropertydialogCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
