import angular from 'angular';
const {module, inject} = angular.mock;

describe('spring module', function () {
  'use strict';

  var regenerator, socketStream;

  beforeEach(module('socket-module', function ($provide) {

    regenerator = jasmine.createSpy('regenerator');
    $provide.value('regenerator', regenerator);

    socketStream = jasmine.createSpy('socketStream')
      .andReturn(highland());
    spyOn(socketStream.plan(), 'destroy');
    $provide.value('socketStream', socketStream);
  }));

  var spring;

  beforeEach(inject(function (getSpring) {
    spring = getSpring();
  }));

  it('should pass a setup and teardown function to regenerator', function () {
    expect(regenerator)
      .toHaveBeenCalledOnceWith(jasmine.any(Function), jasmine.any(Function));
  });

  it('should setup a socket stream', function () {
    regenerator.mostRecentCall.args[0]('foo', 'bar');

    expect(socketStream).toHaveBeenCalledOnceWith('foo', 'bar');
  });

  it('should teardown a socket stream', function () {
    regenerator.mostRecentCall.args[0]('foo', 'bar');
    regenerator.mostRecentCall.args[1](socketStream.plan());

    expect(socketStream.plan().destroy).toHaveBeenCalledOnce();
  });
});
