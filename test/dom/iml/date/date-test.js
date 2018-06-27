// @flow

import { querySelector } from '../../../../source/iml/dom-utils.js';
import angular from '../../../angular-mock-setup.js';
import highland from 'highland';

import Inferno from 'inferno';

import type { HighlandStreamT } from 'highland';

describe('date type', () => {
  let root: HTMLElement,
    DateType,
    dateType: HTMLElement,
    mockDispatch,
    mockSelect,
    utcRb: HTMLInputElement,
    localRb: HTMLInputElement,
    changeEvent: Event,
    $scope: $scope,
    $compile,
    template: string,
    dateType$: HighlandStreamT<{ isUtc: boolean }>;

  beforeEach(() => {
    mockDispatch = jest.fn();
    dateType$ = highland();
    mockSelect = jest.fn(() => dateType$);

    jest.mock('../../../../source/iml/store/get-store.js', () => ({
      dispatch: mockDispatch,
      select: mockSelect
    }));

    DateType = require('../../../../source/iml/date/date.js').dateComponent;
  });

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.component('dateType', DateType);
    })
  );

  beforeEach(
    angular.mock.inject((_$compile_, $rootScope) => {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      template = '<date-type></date-type>';
    })
  );

  beforeEach(() => {
    changeEvent = new Event('change');
    dateType$.write({ isUtc: false });

    root = $compile(template)($scope)[0];
    querySelector(document, 'body').appendChild(root);
    dateType = querySelector(root, '.date-type');
    localRb = (querySelector(dateType, '#local'): any);
    utcRb = (querySelector(dateType, '#utc'): any);

    mockDispatch.mockImplementation(({ payload }) => {
      if (payload) dateType$.write({ isUtc: true });
      else dateType$.write({ isUtc: false });
    });
  });

  afterEach(() => {
    querySelector(document, 'body').removeChild(root);
  });

  it('should create the component markup', () => {
    expect(dateType).toMatchSnapshot();
  });

  it('should select the dateType stream', () => {
    expect(mockSelect).toHaveBeenCalledOnceWith('dateType');
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
        type: 'SET_DATE_TYPE',
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
        type: 'SET_DATE_TYPE',
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
      const removedDateType = root.querySelector('.date-type');
      expect(removedDateType).toBeNull();
    });
  });
});
