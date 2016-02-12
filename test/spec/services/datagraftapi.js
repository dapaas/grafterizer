'use strict';

describe('Service: dataGraftApi', function () {

  // load the service's module
  beforeEach(module('grafterizerApp'));

  // instantiate service
  var dataGraftApi;
  beforeEach(inject(function (_dataGraftApi_) {
    dataGraftApi = _dataGraftApi_;
  }));

  it('should do something', function () {
    expect(!!dataGraftApi).toBe(true);
  });

});
