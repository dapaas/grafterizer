'use strict';

describe('Directive: columnLiteralNode', function () {

  // load the directive's module
  beforeEach(module('grafterizerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<column-literal-node></column-literal-node>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the columnLiteralNode directive');
  }));
});
