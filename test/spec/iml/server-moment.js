import angular from 'angular';
const {module, inject} = angular.mock;

describe('Server Moment', function () {
  'use strict';

  var momentInstance;

  beforeEach(module('serverMoment', function ($provide) {
    momentInstance = {
      add: jasmine.createSpy('add')
    };
    momentInstance.add.and.returnValue(momentInstance);

    $provide.value('moment', jasmine.createSpy('moment').and.returnValue(momentInstance));

    $provide.constant('SERVER_TIME_DIFF', 2000);
  }));

  var moment, getServerMoment;

  beforeEach(inject(function (_moment_, _getServerMoment_) {
    moment = _moment_;
    getServerMoment = _getServerMoment_;
  }));

  it('should be a function', function () {
    expect(getServerMoment).toEqual(jasmine.any(Function));
  });

  it('should create a new moment', function () {
    var serverMoment = getServerMoment();

    expect(moment).toHaveBeenCalledOnce();
    expect(serverMoment).toEqual(momentInstance);
  });

  it('should add the server time diff', function () {
    getServerMoment();

    expect(momentInstance.add)
      .toHaveBeenCalledOnceWith(2000);
  });

  it('should forward arguments to moment', function () {
    var epochTime = new Date().valueOf();

    getServerMoment(epochTime);

    expect(moment).toHaveBeenCalledOnceWith(epochTime);
  });
});
