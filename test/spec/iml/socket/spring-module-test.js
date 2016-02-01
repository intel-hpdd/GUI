import highland from 'highland';
import socketModule from '../../../../source/iml/socket/socket-module';

describe('spring module', () => {
  var regenerator, socketStream, s;

  beforeEach(module(socketModule, $provide => {

    regenerator = jasmine.createSpy('regenerator');
    $provide.value('regenerator', regenerator);

    s = highland();
    spyOn(s, 'destroy');
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(s);
    $provide.value('socketStream', socketStream);
  }));

  beforeEach(inject(function (getSpring) {
    getSpring();
  }));

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
