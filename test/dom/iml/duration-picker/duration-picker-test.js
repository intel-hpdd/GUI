import _ from 'intel-lodash-mixins';

import {DURATIONS} from '../../../../source/iml/duration-picker/duration-picker.js';

describe('the duration picker', () => {
  let $scope, el, dropdownButton,
    dropdownMenu, input,
    getErrorText, durationControls;

  beforeEach(module('durationPicker'));

  beforeEach(inject(function ($rootScope, $compile) {
    const template = '<duration-picker type="type" size="size" unit="unit" start-date="startDate" \
end-date="endDate"></duration-picker>';

    $scope = $rootScope.$new();
    $scope.type = 'duration';
    $scope.unit = DURATIONS.HOURS;
    $scope.size = 25;
    $scope.startDate = new Date(1460560065352);
    $scope.endDate = new Date(1460563665352);

    el = $compile(template)($scope);

    $scope.$digest();

    dropdownButton = el.find('.dropdown-toggle');
    input = el.find('.duration-size');
    dropdownMenu = el.find('.dropdown-menu');
    durationControls = el.find('.duration-controls');

    getErrorText = function getErrorText () {
      return el.find('div.error-tooltip.in').text().trim();
    };
  }));


  describe('when choosing a duration', function () {
    it('should select the type provided', () => {
      expect(durationControls.length).toEqual(1);
    });

    it('should set the unit to the value provided', function () {
      dropdownButton.click();
      const hours = _.capitalize(DURATIONS.HOURS);

      expect(dropdownButton.filter(`:contains("${hours}")`).length).toEqual(1);
    });

    it('should change the duration unit when the user clicks a dropdown item', function () {
      dropdownButton.click();
      const minutes = _.capitalize(DURATIONS.MINUTES);

      dropdownMenu.find(`a:contains("${minutes}")`).click();

      expect(dropdownButton.filter(`:contains("${minutes}")`).length).toEqual(1);
    });

    it('should set the size to the value provided', () => {
      expect(input.val()).toBe('25');
    });

    it('should be invalid if duration is blank', function () {
      input.val('').trigger('input');

      expect(getErrorText())
        .toBe('Duration is required.');
    });

    it('should be be invalid if duration is greater than max', function () {
      input.val('10000').trigger('input');

      expect(getErrorText())
        .toBe('Duration must be between 1 and 24 hours.');
    });
  });

  describe('when choosing a range', function () {
    let start, end, rangeButton;

    beforeEach(function () {
      rangeButton = el.find('button[uib-btn-radio="\'range\'"]');
      rangeButton.click();

      start = el.find('input[name="start"]');
      end = el.find('input[name="end"]');
    });

    it('should set the start date input to the value provided', function () {
      const startDate = new Date(start.val() + 'Z');
      const utcDateVal = new Date(startDate.valueOf() + ($scope.startDate.getTimezoneOffset() * 60 * 1000));
      expect(utcDateVal.toISOString()).toBe('2016-04-13T15:07:45.352Z');
    });

    it('should set the end date to the value provided', function () {
      const endDate = new Date(end.val() + 'Z');
      const utcDateVal = new Date(endDate.valueOf() + ($scope.endDate.getTimezoneOffset() * 60 * 1000));

      expect(utcDateVal.toISOString()).toBe('2016-04-13T16:07:45.352Z');
    });

    it('should be invalid if start is blank', function () {
      start.val('').trigger('input');

      expect(getErrorText())
        .toBe('Start is required.');
    });

    it('should be invalid if end is blank', function () {
      end.val('').trigger('input');

      expect(getErrorText())
        .toBe('End is required.');
    });
  });
});
