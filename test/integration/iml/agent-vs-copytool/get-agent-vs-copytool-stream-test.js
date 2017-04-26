import highland from 'highland';
import moment from 'moment';
import { getRequestDuration } from '../../../../source/iml/charting/get-time-params.js';

import fixtures from '../../../data-fixtures/agent-vs-copytool-fixtures.json';

describe('agent vs copytool stream', () => {
  let mockSocketStream,
    bufferDataNewerThan,
    getAgentVsCopytoolStream,
    endAndRunTimers,
    spy;

  beforeEach(() => {
    const mockCreateMoment = () => moment('2015-12-04T18:40:00+00:00');

    jest.mock(
      '../../../../source/iml/get-server-moment.js',
      () => mockCreateMoment
    );

    const mockCreateStream = () => {
      mockSocketStream = highland();

      endAndRunTimers = x => {
        mockSocketStream.write(x);
        mockSocketStream.end();
        jest.runAllTimers();
      };

      return mockSocketStream;
    };

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockCreateStream
    );

    bufferDataNewerThan = require('../../../../source/iml/charting/buffer-data-newer-than.js')
      .default;

    getAgentVsCopytoolStream = require('../../../../source/iml/agent-vs-copytool/get-agent-vs-copytool-stream.js')
      .default;

    spy = jest.fn();

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should return a factory function', () => {
    expect(getAgentVsCopytoolStream).toEqual(expect.any(Function));
  });

  describe('fetching 10 minutes ago', () => {
    let agentVsCopytoolStream;

    beforeEach(() => {
      const buff = bufferDataNewerThan(10, 'minutes');
      const requestDuration = getRequestDuration({})(10, 'minutes');

      agentVsCopytoolStream = getAgentVsCopytoolStream(requestDuration, buff);

      agentVsCopytoolStream.each(spy);
    });

    describe('when there is data', () => {
      beforeEach(() => {
        endAndRunTimers(fixtures[0].in);
      });

      it('should return a stream', () => {
        expect(highland.isStream(agentVsCopytoolStream)).toBe(true);
      });

      it('should return computed data', () => {
        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });

      it('should be idempotent', () => {
        endAndRunTimers(fixtures[0].in);

        expect(spy).toHaveBeenCalledTwiceWith(fixtures[0].out);
      });
    });

    describe('when there is no initial data', () => {
      beforeEach(() => {
        endAndRunTimers({});
      });

      it('should return an empty array', () => {
        expect(spy).toHaveBeenCalledOnceWith([]);
      });

      it('should populate if data comes in on next tick', () => {
        endAndRunTimers(fixtures[0].in);

        expect(spy).toHaveBeenCalledOnceWith(fixtures[0].out);
      });
    });
  });
});
