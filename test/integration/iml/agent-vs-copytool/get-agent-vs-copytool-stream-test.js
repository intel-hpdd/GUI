import highland from 'highland';
import moment from 'moment';

import agentVsCopytoolFixtures from '../../../data-fixtures/agent-vs-copytool-fixtures';

import {
  default as Maybe,
  withDefault
} from 'intel-maybe';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('agent vs copytool stream', () => {

  var revert, getAgentVsCopytoolStream, fixtures, getRequestDuration,
    socketStream, metricStream, bufferDataNewerThan;

  beforeEachAsync(async function () {
    socketStream = jasmine
      .createSpy('socketStream')
      .and
      .callFake(() => (metricStream = highland()));

    var getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2015-12-04T18:40:00+00:00'));

    const bufferDataNewerThanModule = await mock('source/iml/charting/buffer-data-newer-than.js', {
      'source/iml/get-server-moment.js': { default: getServerMoment }
    });
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    const createDate = jasmine.createSpy('createDate')
      .and.callFake(arg => withDefault(
        () => new Date(),
        Maybe.of(arg)
          .map(x => new Date(x))));

    const getTimeParamsModule = await mock('source/iml/charting/get-time-params.js', {
      'source/iml/create-date.js': { default: createDate }
    });
    getRequestDuration = getTimeParamsModule.getRequestDuration;

    const mod = await mock('source/iml/agent-vs-copytool/get-agent-vs-copytool-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getAgentVsCopytoolStream = mod.default;
  });

  afterEach(resetAll);

  beforeEach(() => {
    fixtures = agentVsCopytoolFixtures;
    revert = patchRateLimit();
  });

  afterEach(() => revert());

  it('should return a factory function', () => {
    expect(getAgentVsCopytoolStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    var agentVsCopytoolStream, spy;

    beforeEach(() => {
      var buff = bufferDataNewerThan(10, 'minutes');
      var requestDuration = getRequestDuration({}, 10, 'minutes');

      agentVsCopytoolStream = getAgentVsCopytoolStream(requestDuration, buff);

      spy = jasmine.createSpy('spy');

      agentVsCopytoolStream
        .each(spy);
    });

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
