'use strict';

describe('Directive: graphMapping', function () {

  // load the directive's module
  beforeEach(module('grafterizerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<graph-mapping></graph-mapping>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the graphMapping directive');
  }));
});
