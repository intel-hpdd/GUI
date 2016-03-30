import highland from 'highland';
import alertIndicatorModule from
  '../../../../source/iml/alert-indicator/alert-indicator-module';

describe('alert indicator stream', () => {
  beforeEach(module(alertIndicatorModule));

  var socketStream, stream;

  beforeEach(module($provide => {
    stream = highland();
    spyOn(stream, 'destroy');

    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(stream);

    $provide.value('socketStream', socketStream);
  }));

  var alertIndicatorStream;

  beforeEach(inject(_alertIndicatorStream_ => {
    alertIndicatorStream = _alertIndicatorStream_;
  }));

  it('should request alerts', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/alert/', {
      jsonMask: 'objects(affected,message)',
      qs: {
        limit: 0,
        active: true
      }
    });
  });

  it('should pluck objects', () => {
    const spy = jasmine.createSpy('spy');

    alertIndicatorStream.each(spy);

    stream.write({
      objects: [{ foo: 'bar' }]
    });

    expect(spy).toHaveBeenCalledOnceWith([{ foo: 'bar' }]);
  });

  it('should destroy the source', () => {
    alertIndicatorStream.destroy();

    expect(stream.destroy).toHaveBeenCalledOnce();
  });
});
