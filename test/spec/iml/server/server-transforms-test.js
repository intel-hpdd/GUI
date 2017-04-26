import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('server transforms', () => {
  let getCommandAndHost, throwIfServerErrors;

  beforeEachAsync(async function() {
    const mod = await mock('source/iml/server/server-transforms.js', {});

    ({ getCommandAndHost, throwIfServerErrors } = mod);

    jasmine.clock().install();
  });

  afterEach(resetAll);

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('throw if server errors', () => {
    let inst, handler;

    beforeEach(() => {
      handler = jasmine.createSpy('handler');
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
      spy = jasmine.createSpy('spy');
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

      jasmine.clock().tick();

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

        jasmine.clock().tick();
      };

      expect(shouldThrow).toThrow(new Error('["booom!"]'));
    });
  });
});
