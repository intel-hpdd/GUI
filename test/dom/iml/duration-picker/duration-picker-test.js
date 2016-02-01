import moment from 'moment';
import _ from 'intel-lodash-mixins';

describe('the duration picker', () => {
  var $scope, el, $timeout, dropdownButton,
    dropdownMenu, input, DURATIONS,
    getErrorText;

  beforeEach(module('durationPicker', function ($provide) {
    $provide.value('getServerMoment', () => moment('2015-05-03T07:35'));
  }));

  beforeEach(inject(function ($rootScope, $compile, _$timeout_, _DURATIONS_) {
    DURATIONS = _DURATIONS_;

    const template = '<duration-picker start-unit="{{ startUnit }}" start-size="{{ startSize }}"></duration-picker>';


    $timeout = _$timeout_;

    $scope = $rootScope.$new();
    $scope.startUnit = DURATIONS.MINUTES;
    $scope.startSize = 10;

    el = $compile(template)($scope);

    $scope.$digest();
    $timeout.flush();

    dropdownButton = el.find('.dropdown-toggle');
    input = el.find('.duration-size');
    dropdownMenu = el.find('.dropdown-menu');

    getErrorText = function getErrorText () {
      return el.find('div.error-tooltip.in').text().trim();
    };
  }));

  afterEach(function () {
    $timeout.verifyNoPendingTasks();
  });

  describe('when choosing a duration', function () {
    it('should default to minutes', function () {
      dropdownButton.click();
      var minutes = _.capitalize(DURATIONS.MINUTES);

      expect(dropdownButton.filter(`:contains("${minutes}")`).length).toEqual(1);
    });

    it('should change the duration unit when the user clicks a dropdown item', function () {
      dropdownButton.click();
      var hours = _.capitalize(DURATIONS.HOURS);

      dropdownMenu.find(`a:contains("${hours}")`).click();

      expect(dropdownButton.filter(`:contains("${hours}")`).length).toEqual(1);
    });

    it('should be invalid if duration is blank', function () {
      input.val('').trigger('input');

      $timeout.flush();

      expect(getErrorText())
        .toBe('Duration is required.');
    });

    it('should be be invalid if duration is greater than max', function () {
      input.val('10000').trigger('input');

      $timeout.flush();

      expect(getErrorText())
        .toBe('Duration must be between 1 and 60 minutes.');
    });
  });

  describe('when choosing a range', function () {
    var start, end, rangeButton;

    beforeEach(function () {
      rangeButton = el.find('button[uib-btn-radio="\'range\'"]');
      rangeButton.click();

      $timeout.flush();

      start = el.find('input[name="start"]');
      end = el.find('input[name="end"]');
    });

    it('should set the start date to ten minutes ago', function () {
      expect(start.val()).toBe('2015-05-03T07:25:00.000');
    });

    it('should set the end date to now', function () {
      expect(end.val()).toBe('2015-05-03T07:35:00.000');
    });

    it('should be invalid if start is blank', function () {
      start.val('').trigger('input');

      $timeout.flush();

      expect(getErrorText())
        .toBe('Start is required.');
    });

    it('should be invalid if end is blank', function () {
      end.val('').trigger('input');

      $timeout.flush();

      expect(getErrorText())
        .toBe('End is required.');
    });
  });
});
