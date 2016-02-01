import λ from 'highland';
import hsmModule from '../../../../source/iml/hsm/hsm-module';

describe('get copytool stream', () => {
  var socketStream, stream;

  beforeEach(module(hsmModule, ($provide) => {
    stream = λ();

    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(stream);
    $provide.value('socketStream', socketStream);
  }));

  var getCopytoolStream;

  beforeEach(inject((_getCopytoolStream_) => {
    getCopytoolStream = _getCopytoolStream_;
  }));

  it('should get a stream', () => {
    getCopytoolStream();

    expect(socketStream)
      .toHaveBeenCalledOnceWith('/copytool', {
        qs: {
          limit: 0
        },
        jsonMask: 'objects(id,label,host/label,archive,state,\
active_operations_count,available_actions,resource_uri,locks)'
      });
  });

  it('should set status to state if not started', () => {
    getCopytoolStream()
      .each(expectToEqual([{
        state: 'finished',
        status: 'finished'
      }
      ]));

    stream.write({
      objects: [
        {
          state: 'finished'
        }
      ]
    });
  });

  it('should set status to idle if no active operations', () => {
    getCopytoolStream()
      .each(expectToEqual([{
        active_operations_count: 0,
        state: 'started',
        status: 'idle'
      }
      ]));

    stream.write({
      objects: [
        {
          state: 'started',
          active_operations_count: 0
        }
      ]
    });
  });

  it('should set status to working', () => {
    getCopytoolStream()
      .each(expectToEqual([{
        active_operations_count: 1,
        state: 'started',
        status: 'working'
      }
      ]));

    stream.write({
      objects: [
        {
          state: 'started',
          active_operations_count: 1
        }
      ]
    });
  });
});
