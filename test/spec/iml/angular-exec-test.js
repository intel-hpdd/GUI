// @flow

import { mock, resetAll } from '../../system-mock.js';

describe('angular exec', () => {
  let result$, mod, element, injector, angular, angularExec;

  beforeEachAsync(async () => {
    injector = {
      has: jasmine.createSpy('has'),
      get: jasmine.createSpy('get')
    };

    element = {
      injector: jasmine.createSpy('injector').and.returnValue(injector)
    };

    angular = {
      element: jasmine.createSpy('element').and.returnValue(element)
    };

    mod = await mock('source/iml/angular-exec.js', {
      angular: { default: angular }
    });

    angularExec = mod.default;
  });

  afterEach(resetAll);

  describe('invoking the service', () => {
    let service;
    beforeEach(() => {
      injector.has.and.returnValues(false, true, true);

      service = {
        go: jasmine.createSpy('go').and.returnValue('x')
      };

      injector.get.and.returnValue(service);
    });

    describe('on first request', () => {
      beforeEach(() => {
        result$ = angularExec('$state', 'go', 'app.dashboard.overview');
      });

      it('should return a stream', () => {
        expect(result$.__HighlandStream__).toBe(true);
      });

      it('should call the element', done => {
        result$.each(() => {
          expect(angular.element).toHaveBeenCalledOnceWith(document.body);
          done();
        });
      });

      it('should invoke the injector', done => {
        result$.each(() => {
          expect(element.injector).toHaveBeenCalledOnce();
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
          result$ = angularExec('$state', 'go', 'app.servers');
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
