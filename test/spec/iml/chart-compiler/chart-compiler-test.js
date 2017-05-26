import highland from 'highland';
import chartCompiler
  from '../../../../source/iml/chart-compiler/chart-compiler.js';

describe('chart compiler', () => {
  let compilerPromise, s, chartFn;

  beforeEach(() => {
    s = highland();

    chartFn = jasmine.createSpy('chartFn').and.returnValue('chartObj');

    compilerPromise = chartCompiler('template/path', s, chartFn);
  });

  it('should be a function', () => {
    expect(chartCompiler).toEqual(expect.any(Function));
  });

  it('should return back a promise', () => {
    expect(compilerPromise).toBeAPromise();
  });

  it('should resolve to the expected values', async () => {
    s.write('foo');

    const obj = await compilerPromise;

    expect(obj).toEqual({
      template: 'template/path',
      stream: expect.any(Object),
      chartFn
    });
  });
});
