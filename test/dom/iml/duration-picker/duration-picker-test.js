describe('the duration picker', function () {
  'use strict';

  var template, $scope, $timeout, dropdownButton,
    dropdownMenu, input, DURATIONS,
    getErrorText;

  beforeEach(module('durationPicker', 'templates', function ($provide) {
    $provide.value('getServerMoment', function () {
      return moment('2015-05-03T07:35');
    });
  }));

  beforeEach(inject(function ($templateCache, $rootScope, $compile, _$timeout_, _DURATIONS_) {
    DURATIONS = _DURATIONS_;

    template = angular.element($templateCache.get('duration-picker.html'));

    $timeout = _$timeout_;

    $scope = $rootScope.$new();
    $scope.startUnit = DURATIONS.MINUTES;
    $scope.startSize = 10;

    $compile(template)($scope);

    $scope.$digest();
    $timeout.flush();

    dropdownButton = template.find('.dropdown-toggle');
    input = template.find('.duration-size');
    dropdownMenu = template.find('.dropdown-menu');

    getErrorText = function getErrorText () {
      return template.find('div.error-tooltip.in').text().trim();
    };
  }));

  afterEach(function () {
    $timeout.verifyNoPendingTasks();
  });

  describe('when choosing a duration', function () {
    it('should default to minutes', function () {
      dropdownButton.click();
      var minutes = _.capitalize(DURATIONS.MINUTES);

      expect(dropdownButton.filter(':contains("%s")'.sprintf(minutes)).length).toEqual(1);
    });

    it('should change the duration unit when the user clicks a dropdown item', function () {
      dropdownButton.click();
      var hours = _.capitalize(DURATIONS.HOURS);

      dropdownMenu.find('a:contains("%s")'.sprintf(hours)).click();

      expect(dropdownButton.filter(':contains("%s")'.sprintf(hours)).length).toEqual(1);
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
      rangeButton = template.find('button[btn-radio="\'range\'"]');
      rangeButton.click();

      $timeout.flush();

      start = template.find('input[name="start"]');
      end = template.find('input[name="end"]');
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
