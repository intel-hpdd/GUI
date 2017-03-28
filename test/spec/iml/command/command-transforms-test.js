import { mock, resetAll } from '../../../system-mock.js';

describe('command transform', () => {
  let mod;

  beforeEachAsync(async function() {
    mod = await mock('source/iml/command/command-transforms.js', {});
  });

  afterEach(resetAll);

  describe('set state', () => {
    it('should indicate a cancelled command', () => {
      expect(
        mod.setState({
          cancelled: true
        })
      ).toEqual({
        cancelled: true,
        state: 'cancelled'
      });
    });

    it('should indicate a failed command', () => {
      expect(
        mod.setState({
          errored: true
        })
      ).toEqual({
        errored: true,
        state: 'failed'
      });
    });

    it('should indicate a success command', () => {
      expect(
        mod.setState({
          complete: true
        })
      ).toEqual({
        complete: true,
        state: 'succeeded'
      });
    });

    it('should indicate a pending command', () => {
      expect(mod.setState({})).toEqual({
        state: 'pending'
      });
    });
  });

  describe('trim logs', () => {
    it('should trim logs', () => {
      expect(
        mod.trimLogs({
          logs: ' foo bar  '
        })
      ).toEqual({
        logs: 'foo bar'
      });
    });
  });

  describe('is finished', () => {
    it('should indicate if command has finished', () => {
      expect(
        mod.isFinished({
          complete: true
        })
      ).toBe(true);
    });

    it('should indicate if command has not finished', () => {
      expect(mod.isFinished({})).toBe(false);
    });
  });
});
