import angular from '../../../angular-mock-setup.js';
import filtersModule from '../../../../source/iml/filters/filters-module';

describe('Insert help text filter', () => {
  let insertHelp, help, result, helpFilter;

  beforeEach(
    angular.mock.module(filtersModule, $provide => {
      helpFilter = {
        valueOf: jest.fn()
      };

      help = {
        get: jest.fn(() => helpFilter)
      };

      $provide.value('help', help);
    })
  );

  beforeEach(
    angular.mock.inject(function($filter) {
      insertHelp = $filter('insertHelp');
    })
  );

  describe('without params', function() {
    beforeEach(function() {
      result = insertHelp('key');
    });

    it('should retrieve values from help', function() {
      expect(help.get).toHaveBeenCalledTimes(1);
    });

    it('should return the wrapper', function() {
      expect(result).toEqual(helpFilter);
    });
  });

  describe('with params', function() {
    beforeEach(function() {
      helpFilter.valueOf.mockReturnValueOnce('This row has changed locally. Click to reset value to %(remote)s');

      result = insertHelp('key', {
        remote: 'Lustre Network 0'
      });
    });

    it('should populate the help text with params', function() {
      expect(result.valueOf()).toEqual('This row has changed locally. Click to reset value to Lustre Network 0');
    });
  });
});
