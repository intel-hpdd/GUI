import highland from 'highland';
import moment from 'moment';
import * as maybe from 'intel-maybe';

import agentVsCopytoolFixtures
  from '../../../data-fixtures/agent-vs-copytool-fixtures.json!json';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('agent vs copytool stream', () => {
  let getAgentVsCopytoolStream, fixtures, getRequestDuration,
    socketStream, metricStream, bufferDataNewerThan;

  beforeEachAsync(async function () {
    socketStream = jasmine
      .createSpy('socketStream')
      .and
      .callFake(() => (metricStream = highland()));

    const getServerMoment = jasmine.createSpy('getServerMoment')
      .and.returnValue(moment('2015-12-04T18:40:00+00:00'));

    const bufferDataNewerThanModule = await mock('source/iml/charting/buffer-data-newer-than.js', {
      'source/iml/get-server-moment.js': { default: getServerMoment }
    });
    bufferDataNewerThan = bufferDataNewerThanModule.default;

    const createDate = jasmine
      .createSpy('createDate')
      .and
      .callFake(arg => maybe.withDefault(
        () => new Date(),
        maybe.map(
          x => new Date(x),
          maybe.of(arg)
        )
      )
    );

    const getTimeParamsModule = await mock('source/iml/charting/get-time-params.js', {
      'source/iml/create-date.js': { default: createDate }
    });
    getRequestDuration = getTimeParamsModule.getRequestDuration;

    const mod = await mock('source/iml/agent-vs-copytool/get-agent-vs-copytool-stream.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    getAgentVsCopytoolStream = mod.default;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  beforeEach(() => {
    fixtures = agentVsCopytoolFixtures;
  });

  it('should return a factory function', () => {
    expect(getAgentVsCopytoolStream).toEqual(jasmine.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let agentVsCopytoolStream, spy;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({}, 10, 'minutes');

      agentVsCopytoolStream = getAgentVsCopytoolStream(requestDuration, buff);

      spy = jasmine.createSpy('spy');

      agentVsCopytoolStream
        .each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        metricStream.write(fixtures[0].in);
        metricStream.end();
        jasmine.clock().tick(10000);
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
        jasmine.clock().tick(10000);

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        metricStream.write({});
        metricStream.end();
        jasmine.clock().tick(10000);
      });

      it('should return an empty array', () => {
        expect(spy).toHaveBeenCalledOnceWith([]);
      });

      it('should populate if data comes in on next tick', () => {
        metricStream.write(fixtures[0].in);
        metricStream.end();
        jasmine.clock().tick(10000);

        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });
    });
  });
});
