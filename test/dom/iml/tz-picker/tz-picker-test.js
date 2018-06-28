// @flow

import { querySelector } from '../../../../source/iml/dom-utils.js';
import angular from '../../../angular-mock-setup.js';
import highland from 'highland';

import Inferno from 'inferno';

import type { HighlandStreamT } from 'highland';

type UtcStream = HighlandStreamT<{ isUtc: boolean }>;

describe('tzPicker', () => {
  let root: HTMLElement,
    TzPicker,
    tzPicker: HTMLElement,
    mockDispatch,
    utcRb: HTMLInputElement,
    localRb: HTMLInputElement,
    changeEvent: Event,
    $scope: $scope,
    $compile,
    template: string,
    tzPicker$: UtcStream,
    tzPickerB: () => UtcStream;

  beforeEach(() => {
    mockDispatch = jest.fn();
    tzPicker$ = highland();
    tzPickerB = jest.fn(() => tzPicker$);

    jest.mock('../../../../source/iml/store/get-store.js', () => ({
      dispatch: mockDispatch
    }));

    TzPicker = require('../../../../source/iml/tz-picker/tz-picker.js').tzPickerComponent;
  });

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.component('tzPicker', TzPicker);
    })
  );

  beforeEach(
    angular.mock.inject((_$compile_, $rootScope) => {
      $scope = $rootScope.$new();
      $scope.stream = tzPickerB;
      $compile = _$compile_;
      template = '<tz-picker stream="stream"></tz-picker>';
    })
  );

  beforeEach(() => {
    changeEvent = new Event('change');
    tzPicker$.write({ isUtc: false });

    root = $compile(template)($scope)[0];
    querySelector(document, 'body').appendChild(root);
    tzPicker = querySelector(root, '.detail-panel');
    localRb = (querySelector(tzPicker, '#local'): any);
    utcRb = (querySelector(tzPicker, '#utc'): any);

    mockDispatch.mockImplementation(({ payload }) => {
      if (payload) tzPicker$.write({ isUtc: true });
      else tzPicker$.write({ isUtc: false });
    });
  });

  afterEach(() => {
    querySelector(document, 'body').removeChild(root);
  });

  it('should create the component markup', () => {
    expect(tzPicker).toMatchSnapshot();
  });

  it('should select the local radio button', () => {
    expect(localRb.checked).toBe(true);
  });

  it('should not select the utc radio button', () => {
    expect(utcRb.checked).toBe(false);
  });

  describe('selecting UTC', () => {
    beforeEach(() => {
      utcRb.dispatchEvent(changeEvent);
    });

    it('should notify the store that UTC is seleccted', () => {
      expect(mockDispatch).toHaveBeenCalledOnceWith({
        type: 'SET_TIME_ZONE',
        payload: true
      });
    });

    it('should select the utc button', () => {
      expect(utcRb.checked).toBe(true);
    });

    it('should not select the local button', () => {
      expect(localRb.checked).toBe(false);
    });
  });

  describe('selecting Local', () => {
    beforeEach(() => {
      localRb.dispatchEvent(changeEvent);
    });

    it('should notify the store that Local was seleccted', () => {
      expect(mockDispatch).toHaveBeenCalledOnceWith({
        type: 'SET_TIME_ZONE',
        payload: false
      });
    });

    it('should select the local button', () => {
      expect(localRb.checked).toBe(true);
    });

    it('should not select the utc button', () => {
      expect(utcRb.checked).toBe(false);
    });
  });

  describe('removing', () => {
    it('should no longer render the element', () => {
      $scope.$destroy();
      const removedTzPicker = root.querySelector('.tz-picker');
      expect(removedTzPicker).toBeNull();
    });
  });
});
