'use strict';

describe('Service: transformationDataModel', function () {

  // load the service's module
  beforeEach(module('grafterizerApp'));

  // instantiate service
  var transformationDataModel;
  beforeEach(inject(function (_transformationDataModel_) {
    transformationDataModel = _transformationDataModel_;
  }));

  it('should do something', function () {
    expect(!!transformationDataModel).toBe(true);
  });

});
