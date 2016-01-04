import angular from 'angular';
const {module, inject} = angular.mock;

describe('Insert help text filter', function () {
  'use strict';

  var insertHelp, help, result, helpFilter;

  beforeEach(module('filters', function ($provide) {
    helpFilter = {
      valueOf: jasmine.createSpy('valueOf')
    };

    help = {
      get: jasmine.createSpy('helpBody')
        .and.returnValue(helpFilter)
    };

    $provide.value('help', help);
  }));

  beforeEach(inject(function ($filter) {
    insertHelp = $filter('insertHelp');
  }));

  describe('without params', function () {
    beforeEach(function () {
      result = insertHelp('key');
    });

    it('should retrieve values from help', function () {
      expect(help.get).toHaveBeenCalledOnce();
    });

    it('should return the wrapper', function () {
      expect(result).toEqual(helpFilter);
    });
  });

  describe('with params', function () {
    beforeEach(function () {
      helpFilter
        .valueOf.and.returnValue('This row has changed locally. Click to reset value to %(remote)s');

      result = insertHelp('key', {
        remote: 'Lustre Network 0'
      });
    });

    it('should populate the help text with params', function () {
      expect(result.valueOf())
        .toEqual('This row has changed locally. Click to reset value to Lustre Network 0');
    });
  });
});
