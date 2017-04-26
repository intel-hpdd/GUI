import qsStreamFactory from '../../../../source/iml/qs-stream/qs-stream.js';

describe('qs stream', () => {
  let $transitions, qsFromLocation, spy, qsStream, destructor;

  beforeEach(() => {
    spy = jest.fn();

    destructor = jest.fn();

    $transitions = {
      onSuccess: jest.fn(() => destructor)
    };

    qsFromLocation = jest.fn(obj => {
      return Object.keys(obj).reduce((str, key) => {
        str = str === '' ? str : str + '&';
        str += key + '=' + obj[key];
        return str;
      }, '');
    });

    qsStream = qsStreamFactory($transitions, qsFromLocation);
  });

  it('should be a function', () => {
    expect(qsStream).toEqual(expect.any(Function));
  });

  it('should deregister the listener on stream destruction', () => {
    qsStream({}).destroy();

    expect(destructor).toHaveBeenCalledTimes(1);
  });

  describe('invoking', () => {
    let fn;

    beforeEach(() => {
      qsStream({ foo: 'bar', baz: 'bap' }).each(spy);

      fn = $transitions.onSuccess.mock.calls[0][1];
    });

    it('should push a qs on the stream', () => {
      expect(spy).toHaveBeenCalledOnceWith({
        qs: 'foo=bar&baz=bap'
      });
    });

    it('should push a new qs onSuccess', () => {
      fn({
        params: jest.fn(() => ({ foo: 'baz' }))
      });

      expect(spy).toHaveBeenCalledOnceWith({
        qs: 'foo=baz'
      });
    });
  });
});
