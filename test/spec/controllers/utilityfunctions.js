'use strict';

describe('Controller: UtilityfunctionsCtrl', function () {

  // load the controller's module
  beforeEach(module('grafterizerApp'));

  var UtilityfunctionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UtilityfunctionsCtrl = $controller('UtilityfunctionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(UtilityfunctionsCtrl.awesomeThings.length).toBe(3);
  });
});
