import { DiffModelCtrl } from './diff-model';

describe('diff model', () => {
  let diffModelCtrl;

  beforeEach(() => {
    diffModelCtrl = new DiffModelCtrl();
    diffModelCtrl.modelCtrl = {
      $formatters: [],
      $viewChangeListeners: [],
      $viewValue: '',
      $setViewValue: jest.fn(),
      $render: jest.fn()
    };

    diffModelCtrl.diffCtrl = {
      remoteChange: jest.fn(),
      localChange: jest.fn(),
      subscribe: jest.fn()
    };

    diffModelCtrl.$onInit();
  });

  it('should push a formatter', () => {
    expect(diffModelCtrl.modelCtrl.$formatters).toEqual([diffModelCtrl.diffCtrl.remoteChange]);
  });

  it('should push a view change listener', () => {
    expect(diffModelCtrl.modelCtrl.$viewChangeListeners).toEqual([expect.any(Function)]);
  });

  it('should send a local change when view changes', () => {
    const fn = diffModelCtrl.modelCtrl.$viewChangeListeners[0];
    fn();

    expect(diffModelCtrl.diffCtrl.localChange).toHaveBeenCalledOnceWith('');
  });

  it('should subscribe to diffCtrl', () => {
    expect(diffModelCtrl.diffCtrl.subscribe).toHaveBeenCalledOnceWith(expect.any(Function));
  });

  describe('subscribing', () => {
    let fn;

    beforeEach(() => {
      fn = diffModelCtrl.diffCtrl.subscribe.mock.calls[0][0];
    });

    it('should set view value with new local', () => {
      fn({
        local: 'foo'
      });

      expect(diffModelCtrl.modelCtrl.$setViewValue).toHaveBeenCalledOnceWith('foo');
    });

    it('should call $render', () => {
      fn({
        local: 'foo'
      });

      expect(diffModelCtrl.modelCtrl.$render).toHaveBeenCalledTimes(1);
    });

    it('should return early if local is null', () => {
      fn({
        local: null
      });

      expect(diffModelCtrl.modelCtrl.$render).not.toHaveBeenCalled();
    });

    it('should return early if local === $viewValue', () => {
      fn({
        local: ''
      });

      expect(diffModelCtrl.modelCtrl.$render).not.toHaveBeenCalled();
    });
  });
});
