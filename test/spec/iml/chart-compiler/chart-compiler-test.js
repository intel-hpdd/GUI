import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('chart compiler', () => {
  let chartCompiler,
    compilerPromise,
    s,
    chartFn;

  beforeEachAsync(async function () {
    const mod = await mock(
      'source/iml/chart-compiler/chart-compiler.js',
      {}
    );

    chartCompiler = mod.default;
  });

  afterEach(resetAll);

  beforeEach(() => {
    s = highland();

    chartFn = jasmine
      .createSpy('chartFn')
      .and
      .returnValue('chartObj');

    compilerPromise = chartCompiler('template/path', s, chartFn);
  });

  it('should be a function', () => {
    expect(chartCompiler)
      .toEqual(jasmine.any(Function));
  });

  it('should return back a promise', () => {
    expect(compilerPromise)
      .toBeAPromise();
  });

  itAsync('should resolve to the expected values', async function () {
    s.write('foo');

    const obj = await compilerPromise;

    expect(obj)
      .toEqual({
        template: 'template/path',
        stream: jasmine.any(Object),
        chartFn
      });
  });
});
