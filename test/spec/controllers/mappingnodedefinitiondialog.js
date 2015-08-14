'use strict';

describe('Controller: MappingnodedefinitiondialogCtrl', function () {

  // load the controller's module
  beforeEach(module('grafterizerApp'));

  var MappingnodedefinitiondialogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MappingnodedefinitiondialogCtrl = $controller('MappingnodedefinitiondialogCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
