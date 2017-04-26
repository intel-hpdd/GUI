import { mock, resetAll } from '../../../system-mock.js';

describe('qs stream', () => {
  let $transitions, qsFromLocation, spy, qsStream, destructor;

  beforeEachAsync(async function() {
    spy = jasmine.createSpy('spy');

    destructor = jasmine.createSpy('destructor');

    $transitions = {
      onSuccess: jasmine.createSpy('onSuccess').and.returnValue(destructor)
    };

    qsFromLocation = jasmine.createSpy('qsFromLocation').and.callFake(obj => {
      return Object.keys(obj).reduce((str, key) => {
        str = str === '' ? str : str + '&';
        str += key + '=' + obj[key];
        return str;
      }, '');
    });

    const mod = await mock('source/iml/qs-stream/qs-stream.js', {});

    qsStream = mod.default($transitions, qsFromLocation);
  });

  afterEach(resetAll);

  it('should be a function', () => {
    expect(qsStream).toEqual(jasmine.any(Function));
  });

  it('should deregister the listener on stream destruction', () => {
    qsStream({}).destroy();

    expect(destructor).toHaveBeenCalledOnce();
  });

  describe('invoking', () => {
    let fn;

    beforeEach(() => {
      qsStream({ foo: 'bar', baz: 'bap' }).each(spy);

      fn = $transitions.onSuccess.calls.mostRecent().args[1];
    });

    it('should push a qs on the stream', () => {
      expect(spy).toHaveBeenCalledOnceWith({
        qs: 'foo=bar&baz=bap'
      });
    });

    it('should push a new qs onSuccess', () => {
      fn({
        params: jasmine.createSpy('params').and.returnValue({ foo: 'baz' })
      });

      expect(spy).toHaveBeenCalledOnceWith({
        qs: 'foo=baz'
      });
    });
  });
});
