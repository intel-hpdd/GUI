// @flow

import { querySelector } from '../../../../source/iml/dom-utils.js';
import { renderToSnapshot } from '../../../test-utils.js';

import Inferno from 'inferno';

describe('date type', () => {
  let root, DateType, dateType: HTMLElement, mockDispatch, utcRb, localRb, changeEvent;

  beforeEach(() => {
    changeEvent = new Event('change');
    mockDispatch = jest.fn();

    jest.mock('../../../../source/iml/store/get-store.js', () => ({
      dispatch: mockDispatch
    }));

    DateType = require('../../../../source/iml/date/date.js').DateType;

    root = document.createElement('div');
    querySelector(document, 'body').appendChild(root);
    Inferno.render(<DateType isUtc={false} />, root);
    dateType = querySelector(root, '.date-type');
    localRb = querySelector(dateType, '#local');
    utcRb = querySelector(dateType, '#utc');

    mockDispatch.mockImplementation(({ payload }) => {
      if (payload) utcRb.checked = true;
      else localRb.checked = true;
    });
  });

  it('should create the component markup', () => {
    expect(renderToSnapshot(<DateType isUtc={false} />)).toMatchSnapshot();
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
});
