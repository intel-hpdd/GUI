// @flow

import {
  mock,
  resetAll
} from '../../system-mock.js';

describe('angular exec', () => {
  let result$, mod, angularExec, injector, angular;
  beforeEachAsync(async () => {
    injector = {
      has: jasmine.createSpy('has'),
      get: jasmine.createSpy('get')
    };

    angular = {
      injector: jasmine.createSpy('injector')
        .and
        .returnValue(injector)
    };

    mod = await mock('source/iml/angular-exec.js', {
      'angular': { default: angular }
    });

    angularExec = mod.default;
  });

  afterEach(resetAll);

  describe('invoking the service', () => {
    let service;
    beforeEach(() => {
      injector
        .has
        .and
        .returnValues(false, true);

      injector
        .has
        .and
        .returnValue(true);

      service = {
        go: jasmine.createSpy('go')
          .and
          .returnValue('x')
      };

      injector
        .get
        .and
        .returnValue(service);
    });

    describe('without error', () => {
      beforeEach(() => {
        result$ = angularExec('$state', 'go', 'app.dashboard.overview');
      });

      it('should return a stream', () => {
        expect(result$.__HighlandStream__).toBe(true);
      });

      it('should call the injector', (done) => {
        result$
          .each(() => {
            expect(angular.injector)
              .toHaveBeenCalledOnce();
            done();
          });
      });

      it('should call inj.has', (done) => {
        result$
          .each(() => {
            expect(injector.has)
              .toHaveBeenCalledOnceWith('$state');
            done();
          });
      });

      it('should pass the value being returned', (done) => {
        result$
          .each((x) => {
            expect(x).toEqual('x');
            done();
          });
      });
    });

    describe('with error', () => {
      beforeEach(() => {
        service = {};
        injector
          .get
          .and
          .returnValue(service);
      });

      it('should throw an error', (done) => {
        angularExec('$state', 'go', 'app.dashboard.overview')
          .errors((e) => {
            expect(e).toEqual(new Error('Could not execute go on $state service.'));
            done();
          })
          .each(() => {});
      });
    });
  });
});
