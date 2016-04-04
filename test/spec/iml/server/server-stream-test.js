import serverModule from '../../../../source/iml/server/server-module';
import highlandModule from '../../../../source/iml/highland/highland-module';
import highland from 'highland';

describe('server stream', () => {
  var serverStream, socketStream, s, spy;

  beforeEach(module(serverModule, highlandModule, $provide => {
    s = highland();
    spy = jasmine.createSpy('spy');
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(s);

    $provide.value('socketStream', socketStream);
  }));

  beforeEach(inject((_serverStream_) => {
    serverStream = _serverStream_;

    s.write({
      meta: 'meta',
      objects: [
        {
          id: 1
        }, {
          id: 2
        }
      ]
    });
  }));

  it('should invoke the socket stream', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/host', {
      qs: { limit: 0 }
    });
  });

  it('should write the objects to the stream', () => {
    serverStream.each(spy);
    expect(spy).toHaveBeenCalledOnceWith([
      {
        id: 1
      }, {
        id: 2
      }
    ]);
  });
});
