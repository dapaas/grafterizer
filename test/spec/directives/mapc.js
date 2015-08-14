'use strict';

describe('Directive: mapc', function () {

  // load the directive's module
  beforeEach(module('grafterizerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mapc></mapc>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mapc directive');
  }));
});
