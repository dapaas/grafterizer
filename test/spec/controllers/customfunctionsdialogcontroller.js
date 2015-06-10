'use strict';

describe('Controller: CustomfunctionsdialogcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('grafterizerApp'));

  var CustomfunctionsdialogcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CustomfunctionsdialogcontrollerCtrl = $controller('CustomfunctionsdialogcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
