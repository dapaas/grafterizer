'use strict';

describe('Controller: EditprefixersCtrl', function () {

  // load the controller's module
  beforeEach(module('grafterizerApp'));

  var EditprefixersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditprefixersCtrl = $controller('EditprefixersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
