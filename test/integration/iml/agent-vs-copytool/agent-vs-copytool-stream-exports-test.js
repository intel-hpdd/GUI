import {getAgentVsCopytoolStreamFactory} from
  '../../../../source/chroma_ui/iml/agent-vs-copytool/agent-vs-copytool-stream-exports';

describe('agent vs copytool stream', () => {
  var socketStream, metricStream;

  beforeEach(window.module('hsm', 'dataFixtures', ($provide) => {
    var getServerMoment = jasmine.createSpy('getServerMoment')
      .andReturn(moment('2015-12-04T18:40:00+00:00'));

    $provide.value('getServerMoment', getServerMoment);

    socketStream = jasmine.createSpy('socketStream')
      .andCallFake(() => (metricStream = highland()));

    $provide.value('socketStream', socketStream);
  }));

  var revert, getAgentVsCopytoolStream, fixtures;

  beforeEach(inject((chartPlugins, agentVsCopytoolFixtures) => {
    fixtures = agentVsCopytoolFixtures;

    getAgentVsCopytoolStream = getAgentVsCopytoolStreamFactory(highland, socketStream, chartPlugins);

    revert = patchRateLimit();
  }));

  afterEach(() => {
    revert();
  });

  it('should return a factory function', () => {
    expect(getAgentVsCopytoolStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var agentVsCopytoolStream, spy;

    beforeEach(inject((getRequestDuration, bufferDataNewerThan) => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      agentVsCopytoolStream = getAgentVsCopytoolStream(requestDuration, buff);

      spy = jasmine.createSpy('spy');

      agentVsCopytoolStream
        .each(spy);
    }));

    describe('when there is data', () => {
      beforeEach(() => {
        metricStream.write(fixtures[0].in);
        metricStream.end();
      });

      it('should return a stream', () => {
        expect(highland.isStream(agentVsCopytoolStream)).toBe(true);
      });

      it('should return computed data', () => {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should be idempotent', () => {
        metricStream.write(fixtures[0].in);
        metricStream.end();

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        metricStream.write({});
        metricStream.end();
      });

      it('should return an empty array', () => {
        expect(spy).toHaveBeenCalledOnceWith([]);
      });

      it('should populate if data comes in on next tick', () => {
        metricStream.write(fixtures[0].in);
        metricStream.end();

        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });
    });
  });
});
