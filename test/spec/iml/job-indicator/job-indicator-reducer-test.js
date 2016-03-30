import jobIndicatorModule from '../../../../source/iml/job-indicator/job-indicator-module.js';
import deepFreeze from 'intel-deep-freeze';

describe('job indicator reducer', () => {
  beforeEach(module(jobIndicatorModule));

  var jobIndicatorReducer;

  beforeEach(inject(_jobIndicatorReducer_ => {
    jobIndicatorReducer = _jobIndicatorReducer_;
  }));

  it('should be a function', () => {
    expect(jobIndicatorReducer).toEqual(jasmine.any(Function));
  });

  it('should return the payload on ADD_JOB_INDICATOR_ITEMS', () => {
    expect(jobIndicatorReducer(deepFreeze([]), {
      type: 'ADD_JOB_INDICATOR_ITEMS',
      payload: [{}]
    })).toEqual([{}]);
  });

  it('should return state on non-matching type', () => {
    expect(jobIndicatorReducer(deepFreeze([]), {
      type: 'FOO',
      payload: [{bar: 'baz'}]
    })).toEqual([]);
  });
});
