import jobIndicatorModule from '../../../../source/iml/job-indicator/job-indicator-module.js';
import highland from 'highland';

describe('job indicator stream', () => {
  var jobIndicatorStream, socketStream, stream;

  beforeEach(module(jobIndicatorModule, $provide => {
    stream = highland();

    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(stream);

    $provide.value('socketStream', socketStream);
  }));

  beforeEach(inject(_jobIndicatorStream_ => {
    jobIndicatorStream = _jobIndicatorStream_;
  }));

  it('should be a stream', () => {
    expect(highland.isStream(jobIndicatorStream)).toBe(true);
  });

  it('should request pending and tasked jobs', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/job/', {
      jsonMask: 'objects(write_locks,read_locks,description)',
      qs: {
        limit: 0,
        state__in: ['pending', 'tasked']
      }
    });
  });

  it('should pluck objects out of the stream', () => {
    const spy = jasmine.createSpy('spy');

    jobIndicatorStream
      .each(spy);

    stream.write({
      objects: [{ foo: 'bar' }]
    });

    expect(spy).toHaveBeenCalledOnceWith([{ foo: 'bar' }]);
  });
});
