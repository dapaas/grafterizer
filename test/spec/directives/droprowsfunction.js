'use strict';

describe('Directive: dropRowsFunction', function () {

  // load the directive's module
  beforeEach(module('grafterizerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drop-rows-function></drop-rows-function>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dropRowsFunction directive');
  }));
});
