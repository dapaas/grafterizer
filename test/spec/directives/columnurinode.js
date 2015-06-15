'use strict';

describe('Directive: columnURINode', function () {

  // load the directive's module
  beforeEach(module('grafterizerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<column-u-r-i-node></column-u-r-i-node>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the columnURINode directive');
  }));
});
