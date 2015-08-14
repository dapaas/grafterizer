'use strict';

describe('Controller: PipelinefunctiondialogCtrl', function () {

  // load the controller's module
  beforeEach(module('grafterizerApp'));

  var PipelinefunctiondialogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PipelinefunctiondialogCtrl = $controller('PipelinefunctiondialogCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
