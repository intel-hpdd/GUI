import highland from 'highland';
import {
  getCommandAndHost,
  throwIfServerErrors
} from '../../../../source/iml/server/server-transforms.js';

describe('server transforms', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('throw if server errors', () => {
    let inst, handler;

    beforeEach(() => {
      handler = jest.fn();
      inst = throwIfServerErrors(handler);
    });

    it('should throw on error', () => {
      expect(() =>
        inst([
          {
            error: 'fooz'
          }
        ])
      ).toThrow(new Error('["fooz"]'));
    });

    it('should call fn on success', () => {
      const response = [
        {
          error: null
        }
      ];

      inst(response);

      expect(handler).toHaveBeenCalledOnceWith(response);
    });
  });

  describe('get command and host', () => {
    let spy, source$;

    beforeEach(() => {
      spy = jest.fn();
      source$ = highland();
      getCommandAndHost(source$).each(spy);
    });

    it('should get the command and host', () => {
      source$.write({
        objects: [
          {
            command_and_host: {
              host: 'host'
            },
            error: null
          }
        ]
      });
      source$.end();

      jest.runAllTimers();

      expect(spy).toHaveBeenCalledOnceWith([
        {
          host: 'host'
        }
      ]);
    });

    it('should throw on error', () => {
      const shouldThrow = () => {
        source$.write({
          objects: [
            {
              command_and_host: {
                host: 'host'
              },
              error: 'booom!'
            }
          ]
        });
        source$.end();

        jest.runAllTimers();
      };

      expect(shouldThrow).toThrow('["booom!"]');
    });
  });
});
