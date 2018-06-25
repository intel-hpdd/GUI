import { DURATIONS, default as durationPicker } from '../../../../source/iml/duration-picker/duration-picker.js';
import capitalizeFilter from '../../../../source/iml/filters/capitalize-filter.js';
import { imlTooltip } from '../../../../source/iml/tooltip/tooltip.js';
import angular from '../../../angular-mock-setup.js';
import angularUiBootstrap from 'angular-ui-bootstrap';

describe('the duration picker', () => {
  let $scope, el, dropdownButton, dropdownMenu, input, getErrorText, durationControls;

  beforeEach(() => {
    if (!window.angular) require('angular');
  });

  beforeEach(
    angular.mock.module(angularUiBootstrap, ($filterProvider, $compileProvider) => {
      $filterProvider.register('capitalize', capitalizeFilter);
      $compileProvider.directive('imlTooltip', imlTooltip);
      $compileProvider.component('durationPicker', durationPicker);
    })
  );

  beforeEach(
    angular.mock.inject(function($rootScope, $compile) {
      const template =
        '<duration-picker type="type" size="size" unit="unit" start-date="startDate" end-date="endDate"></duration-picker>';
      $scope = $rootScope.$new();
      $scope.type = 'duration';
      $scope.unit = DURATIONS.HOURS;
      $scope.size = 25;
      $scope.startDate = new Date(1460560065352);
      $scope.endDate = new Date(1460563665352);
      el = $compile(template)($scope)[0];
      $scope.$digest();
      dropdownButton = el.querySelector('.dropdown-toggle');
      input = el.querySelector('.duration-size');
      dropdownMenu = el.querySelector('.dropdown-menu');
      durationControls = el.querySelector('.duration-controls');
      getErrorText = () => el.querySelector('div.error-tooltip.in').textContent.trim();
    })
  );
  describe('when choosing a duration', () => {
    it('should select the type provided', () => {
      expect(durationControls).not.toBeNull();
    });
    it('should set the unit to the value provided', () => {
      dropdownButton.click();
      expect(dropdownButton.textContent.trim()).toBe('Hours');
    });
    it('should change the duration unit when the user clicks a dropdown item', () => {
      dropdownButton.click();
      dropdownMenu.querySelector('li a').click();
      expect(dropdownButton.textContent.trim()).toBe('Minutes');
    });
    it('should set the size to the value provided', () => {
      expect(input.value).toBe('25');
    });
    it('should be invalid if duration is blank', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      expect(getErrorText()).toBe('Duration is required.');
    });
    it('should be be invalid if duration is greater than max', () => {
      input.value = '10000';
      input.dispatchEvent(new Event('input'));
      expect(getErrorText()).toBe('Duration must be between 1 and 24 hours.');
    });
  });
  describe('when choosing a range', () => {
    let start, end, rangeButton;
    beforeEach(() => {
      rangeButton = Array.from(el.querySelectorAll('button[uib-btn-radio]')).filter(
        x => x.getAttribute('uib-btn-radio') === `'range'`
      )[0];
      rangeButton.click();
      start = el.querySelector('input[name="start"]');
      end = el.querySelector('input[name="end"]');
    });
    it('should set the start date input to the value provided', () => {
      const startDate = new Date(start.value + 'Z');
      const utcDateVal = new Date(startDate.valueOf() + $scope.startDate.getTimezoneOffset() * 60 * 1000);
      expect(utcDateVal.toISOString()).toBe('2016-04-13T15:07:45.352Z');
    });
    it('should set the end date to the value provided', () => {
      const endDate = new Date(end.value + 'Z');
      const utcDateVal = new Date(endDate.valueOf() + $scope.endDate.getTimezoneOffset() * 60 * 1000);
      expect(utcDateVal.toISOString()).toBe('2016-04-13T16:07:45.352Z');
    });
    it('should be invalid if start is blank', () => {
      start.value = '';
      start.dispatchEvent(new Event('input'));
      expect(getErrorText()).toBe('Start is required.');
    });
    it('should be invalid if end is blank', () => {
      end.value = '';
      end.dispatchEvent(new Event('input'));
      expect(getErrorText()).toBe('End is required.');
    });
  });
});
