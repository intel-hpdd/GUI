// @flow

describe('mockAngular exec', () => {
  let result$, mod, element, injector, mockAngular, mockAngularExec;

  beforeEach(() => {
    jest.resetModules();
    injector = {
      has: jest.fn(),
      get: jest.fn()
    };

    element = {
      injector: jest.fn(() => injector)
    };

    mockAngular = {
      element: jest.fn(() => element)
    };

    jest.mock('angular', () => mockAngular);

    mod = require('../../../source/iml/angular-exec.js');

    mockAngularExec = mod.default;
  });

  describe('invoking the service', () => {
    let service;
    beforeEach(() => {
      injector.has.mockReturnValueOnce(false);
      injector.has.mockReturnValueOnce(true);
      injector.has.mockReturnValueOnce(true);

      service = {
        go: jest.fn(() => 'x')
      };

      injector.get.mockReturnValue(service);
    });

    describe('on first request', () => {
      beforeEach(() => {
        result$ = mockAngularExec('$state', 'go', 'app.dashboard.overview');
      });

      it('should return a stream', () => {
        expect(result$.__HighlandStream__).toBe(true);
      });

      it('should call the element', done => {
        result$.each(() => {
          expect(mockAngular.element).toHaveBeenCalledOnceWith(document.body);
          done();
        });
      });

      it('should invoke the injector', done => {
        result$.each(() => {
          expect(element.injector).toHaveBeenCalledTimes(1);
          done();
        });
      });

      it('should call inj.has', done => {
        result$.each(() => {
          expect(injector.has).toHaveBeenCalledTwiceWith('$state');
          done();
        });
      });

      it('should pass the value being returned', done => {
        result$.each(x => {
          expect(x).toEqual('x');
          done();
        });
      });

      it('should end the stream', done => {
        result$.done(done);
      });

      describe('on subsequent requests', () => {
        beforeEach(() => {
          result$ = mockAngularExec('$state', 'go', 'app.servers');
        });

        it('should retrieve the service from cache', done => {
          result$.each(() => {
            expect(injector.get).toHaveBeenCalledOnceWith('$state');
            done();
          });
        });
      });
    });
  });
});
