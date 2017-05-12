// @flow

import { mock, resetAll } from '../../system-mock.js';

import highland from 'highland';

describe('route transitions', () => {
  let groupAllowed, mod, $transitions, routeTransitions, store, $state;
  beforeEachAsync(async function() {
    store = {
      select: jasmine.createSpy('select')
    };

    groupAllowed = jasmine.createSpy('groupAllowed');

    $transitions = {
      onStart: jasmine.createSpy('onStart')
    };

    $state = {
      target: jasmine.createSpy('target')
    };

    mod = await mock('source/iml/route-transitions.js', {
      'source/iml/store/get-store': { default: store },
      'source/iml/auth/authorization': { groupAllowed }
    });

    routeTransitions = mod.default;
    routeTransitions($transitions, $state);
  });

  afterEach(resetAll);

  it('should set an onStart hook for three route processors', () => {
    expect($transitions.onStart).toHaveBeenCalledThriceWith(
      {
        to: jasmine.any(Function)
      },
      jasmine.any(Function)
    );
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
        expect(
          allowAnonymousReadPredicate.to({
            data: {}
          })
        ).toBe(false);
      });

      it('should return true if flag is true', () => {
        expect(
          allowAnonymousReadPredicate.to({
            data: {
              anonymousReadProtected: true
            }
          })
        ).toBe(true);
      });
    });

    describe('processor', () => {
      describe('with read enabled', () => {
        beforeEach(() => {
          store.select.and.returnValue(
            highland([
              {
                session: {
                  read_enabled: true
                }
              }
            ])
          );
        });

        itAsync('should select the session store', async () => {
          await processAllowAnonymousRead();
          expect(store.select).toHaveBeenCalledOnceWith('session');
        });

        itAsync(
          'should return undefined if session is read enabled',
          async () => {
            expect(await processAllowAnonymousRead()).toBe(undefined);
          }
        );
      });

      describe('with read not enabled', () => {
        beforeEach(() => {
          store.select.and.returnValue(
            highland([
              {
                session: {
                  read_enabled: false
                }
              }
            ])
          );
        });

        it('should return a promise if session is not read enabled', () => {
          expect(processAllowAnonymousRead()).toBeAPromise();
        });

        itAsync(
          'should navigate to /login if the session is not read enabled',
          async () => {
            await processAllowAnonymousRead();
            expect($state.target).toHaveBeenCalledOnceWith('login');
          }
        );
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
        expect(
          eulaPredicate.to({
            data: {}
          })
        ).toBe(false);
      });

      it('should return true if flag is true', () => {
        expect(
          eulaPredicate.to({
            data: {
              eulaState: true
            }
          })
        ).toBe(true);
      });
    });

    describe('processor', () => {
      describe('set to pass', () => {
        beforeEach(() => {
          store.select.and.returnValue(
            highland([
              {
                session: {
                  user: {
                    eula_state: 'pass'
                  }
                }
              }
            ])
          );
        });

        itAsync('should select the session store', async () => {
          await processEula();
          expect(store.select).toHaveBeenCalledOnceWith('session');
        });

        itAsync(
          'should return undefined if eula state is set to pass',
          async () => {
            expect(await processEula()).toBe(undefined);
          }
        );
      });

      describe('not set to pass', () => {
        beforeEach(() => {
          store.select.and.returnValue(
            highland([
              {
                session: {
                  user: {
                    eula_state: 'other'
                  }
                }
              }
            ])
          );
        });

        it('should return a promise if eula state is not set to pass', () => {
          expect(processEula()).toBeAPromise();
        });

        itAsync(
          'should navigate to /login if eula state is not set to pass',
          async () => {
            await processEula();
            expect($state.target).toHaveBeenCalledOnceWith('login');
          }
        );
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
        expect(
          authenticationPredicate.to({
            data: {}
          })
        ).toBe(false);
      });

      it('should return true if flag is true', () => {
        expect(
          authenticationPredicate.to({
            data: {
              access: 'FS_ADMINS'
            }
          })
        ).toBe(true);
      });
    });

    describe('processor', () => {
      let transition;
      beforeEach(() => {
        $state.target.and.returnValue({});

        transition = {
          router: {
            $state
          },
          to: jasmine.createSpy('to').and.returnValue({
            data: {
              access: 'fs-admin'
            }
          })
        };
      });

      describe('when authenticated', () => {
        it('should return undefined', () => {
          groupAllowed.and.returnValue(true);
          expect(processAuthentication(transition)).toBe(undefined);
        });
      });

      describe('when not authenticated', () => {
        let result;
        beforeEach(() => {
          groupAllowed.and.returnValue(false);
          result = processAuthentication(transition);
        });

        it('should call authorization.groupAllowed', () => {
          expect(groupAllowed).toHaveBeenCalledOnceWith('fs-admin');
        });

        it('should call transition.to', () => {
          expect(transition.to).toHaveBeenCalledTimes(1);
        });

        it('should return an object if not authenticated', () => {
          expect(result).toEqual({});
        });

        it('should target the app state if not authenticated', () => {
          groupAllowed.and.returnValue(false);

          expect($state.target).toHaveBeenCalledOnceWith('app', undefined, {
            location: true
          });
        });
      });
    });
  });
});
