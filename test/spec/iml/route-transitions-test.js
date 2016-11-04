import {
  mock,
  resetAll
} from '../../system-mock.js';

describe('route transitions', () => {
  let CACHE_INITIAL_DATA, authorization, mod, $transitions,
    routeTransitions, navigate;
  beforeEachAsync(async function () {
    CACHE_INITIAL_DATA = {
      session: {
        read_enabled: true,
        user: {
          eula_state: 'pass'
        }
      }
    };

    authorization = {
      groupAllowed: jasmine.createSpy('groupAllowed')
    };

    $transitions = {
      onStart: jasmine.createSpy('onStart')
    };

    navigate = jasmine.createSpy('navigate');

    mod = await mock('source/iml/route-transitions.js', {
      'source/iml/environment.js': {CACHE_INITIAL_DATA},
      'source/iml/auth/authorization': {authorization}
    });

    routeTransitions = mod.default;
    routeTransitions($transitions, navigate);
  });

  afterEach(resetAll);

  it('should set an onStart hook for three route processors', () => {
    expect($transitions.onStart).toHaveBeenCalledThriceWith({
      to: jasmine.any(Function)
    }, jasmine.any(Function));
  });

  describe('allow anonymous read', () => {
    let allowAnonymousReadPredicate, processAllowAnonymousRead;
    beforeEach(() => {
      const args = $transitions.onStart.calls.argsFor(0);
      allowAnonymousReadPredicate = args[0];
      processAllowAnonymousRead = args[1];
    });

    describe('predicate', () => {
      it('should return false if flag is not true', () => {
        expect(allowAnonymousReadPredicate.to({
          data: {}
        })).toBe(false);
      });

      it('should return true if flag is true', () => {
        expect(allowAnonymousReadPredicate.to({
          data: {
            anonymousReadProtected: true
          }
        })).toBe(true);
      });
    });

    describe('processor', () => {
      it('should return undefined if session is read enabled', () => {
        expect(processAllowAnonymousRead()).toBe(undefined);
      });

      it('should return a promise if session is not read enabled', () => {
        CACHE_INITIAL_DATA.session.read_enabled = false;
        expect(processAllowAnonymousRead()).toBeAPromise();
      });

      it('should navigate to /login if the session is not read enabled', () => {
        CACHE_INITIAL_DATA.session.read_enabled = false;
        processAllowAnonymousRead();
        expect(navigate).toHaveBeenCalledOnceWith('login');
      });
    });
  });

  describe('eula', () => {
    let eulaPredicate, processEula;
    beforeEach(() => {
      const args = $transitions.onStart.calls.argsFor(1);
      eulaPredicate = args[0];
      processEula = args[1];
    });

    describe('predicate', () => {
      it('should return false if flag is not true', () => {
        expect(eulaPredicate.to({
          data: {}
        })).toBe(false);
      });

      it('should return true if flag is true', () => {
        expect(eulaPredicate.to({
          data: {
            eulaState: true
          }
        })).toBe(true);
      });
    });

    describe('processor', () => {
      it('should return undefined if eula state is set to pass', () => {
        expect(processEula()).toBe(undefined);
      });

      it('should return a promise if eula state is not set to pass', () => {
        CACHE_INITIAL_DATA.session.user.eula_state = 'other';
        expect(processEula()).toBeAPromise();
      });

      it('should navigate to /login if eula state is not set to pass', () => {
        CACHE_INITIAL_DATA.session.user.eula_state = 'other';
        processEula();
        expect(navigate).toHaveBeenCalledOnceWith('login');
      });
    });
  });

  describe('authentication', () => {
    let authenticationPredicate, processAuthentication;
    beforeEach(() => {
      const args = $transitions.onStart.calls.argsFor(2);
      authenticationPredicate = args[0];
      processAuthentication = args[1];
    });

    describe('predicate', () => {
      it('should return false if flag is not true', () => {
        expect(authenticationPredicate.to({
          data: {}
        })).toBe(false);
      });

      it('should return true if flag is true', () => {
        expect(authenticationPredicate.to({
          data: {
            access: 'FS_ADMINS'
          }
        })).toBe(true);
      });
    });

    describe('processor', () => {
      let transition, stateService;
      beforeEach(() => {
        stateService = {
          target: jasmine.createSpy('target')
            .and.returnValue({})
        };

        transition = {
          router: {
            stateService
          },
          to: jasmine.createSpy('to')
            .and.returnValue({
              data: {
                access: 'fs-admin'
              }
            })
        };
      });

      describe('when authenticated', () => {
        it('should return undefined', () => {
          authorization.groupAllowed.and.returnValue(true);
          expect(processAuthentication(transition)).toBe(undefined);
        });
      });

      describe('when not authenticated', () => {
        let result;
        beforeEach(() => {
          authorization.groupAllowed.and.returnValue(false);
          result = processAuthentication(transition);
        });

        it('should call authorization.groupAllowed', () => {
          expect(authorization.groupAllowed)
            .toHaveBeenCalledOnceWith('fs-admin');
        });

        it('should call transition.to', () => {
          expect(transition.to).toHaveBeenCalledOnce();
        });

        it('should return an object if not authenticated', () => {
          expect(result).toEqual({});
        });

        it('should target the app state if not authenticated', () => {
          authorization.groupAllowed.and.returnValue(false);

          expect(stateService.target).toHaveBeenCalledOnceWith(
            'app',
            undefined,
            {location: true}
          );
        });
      });
    });
  });
});
