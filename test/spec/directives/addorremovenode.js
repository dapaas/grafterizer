'use strict';

describe('Directive: addOrRemoveNode', function () {

  // load the directive's module
  beforeEach(module('grafterizerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<add-or-remove-node></add-or-remove-node>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the addOrRemoveNode directive');
  }));
});
