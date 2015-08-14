'use strict';

describe('Directive: addOrRemoveProperty', function () {

  // load the directive's module
  beforeEach(module('grafterizerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<add-or-remove-property></add-or-remove-property>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the addOrRemoveProperty directive');
  }));
});
