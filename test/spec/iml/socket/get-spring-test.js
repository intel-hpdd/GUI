import highland from 'highland';
import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('spring module', () => {
  var regenerator, socketStream, getSpring, s;

  beforeEachAsync(async function () {
    s = highland();
    spyOn(s, 'destroy');
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(s);

    regenerator = jasmine.createSpy('regenerator');

    const getSpringDependencies = await mock('source/iml/socket/get-spring.js', {
      'source/iml/regenerator.js': {
        default: regenerator
      },
      'source/iml/socket/socket-stream.js': {
        default: socketStream
      }
    });

    getSpring = getSpringDependencies.default;
    getSpring();
  });

  afterEach(resetAll);

  it('should pass a setup and teardown function to regenerator', function () {
    expect(regenerator)
      .toHaveBeenCalledOnceWith(jasmine.any(Function), jasmine.any(Function));
  });

  it('should setup a socket stream', function () {
    regenerator.calls.mostRecent().args[0]('foo', 'bar');

    expect(socketStream).toHaveBeenCalledOnceWith('foo', 'bar');
  });

  it('should teardown a socket stream', function () {
    regenerator.calls.mostRecent().args[0]('foo', 'bar');
    regenerator.calls.mostRecent().args[1](s);

    expect(s.destroy).toHaveBeenCalledOnce();
  });
});
