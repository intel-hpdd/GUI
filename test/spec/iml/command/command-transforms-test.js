import {
  setState,
  trimLogs,
  isFinished
} from '../../../../source/iml/command/command-transforms.js';

describe('command transform', () => {
  describe('set state', () => {
    it('should indicate a cancelled command', () => {
      expect(
        setState({
          cancelled: true
        })
      ).toEqual({
        cancelled: true,
        state: 'cancelled'
      });
    });

    it('should indicate a failed command', () => {
      expect(
        setState({
          errored: true
        })
      ).toEqual({
        errored: true,
        state: 'failed'
      });
    });

    it('should indicate a success command', () => {
      expect(
        setState({
          complete: true
        })
      ).toEqual({
        complete: true,
        state: 'succeeded'
      });
    });

    it('should indicate a pending command', () => {
      expect(setState({})).toEqual({
        state: 'pending'
      });
    });
  });

  describe('trim logs', () => {
    it('should trim logs', () => {
      expect(
        trimLogs({
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
        isFinished({
          complete: true
        })
      ).toBe(true);
    });

    it('should indicate if command has not finished', () => {
      expect(isFinished({})).toBe(false);
    });
  });
});
