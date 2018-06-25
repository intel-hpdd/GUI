import highland from 'highland';

describe('route transitions', () => {
  let mockGroupAllowed, mod, $transitions: any, routeTransitions, mockStore, $state: any;
  beforeEach(() => {
    mockStore = {
      select: jest.fn()
    };

    mockGroupAllowed = jest.fn();

    $transitions = {
      onStart: jest.fn()
    };

    $state = {
      target: jest.fn()
    };

    jest.mock('../../../source/iml/store/get-store', () => mockStore);
    jest.mock('../../../source/iml/auth/authorization', () => ({
      groupAllowed: mockGroupAllowed
    }));

    mod = require('../../../source/iml/route-transitions.js');

    routeTransitions = mod.default;
    routeTransitions($transitions, $state);
  });

  it('should set an onStart hook for three route processors', () => {
    expect($transitions.onStart).toHaveBeenCalledTwiceWith(
      {
        to: expect.any(Function)
      },
      expect.any(Function)
    );
  });

  describe('allow anonymous read', () => {
    let allowAnonymousReadPredicate, processAllowAnonymousRead;
    beforeEach(() => {
      const args = $transitions.onStart.mock.calls[0];
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
          mockStore.select.mockReturnValue(
            highland([
              {
                session: {
                  read_enabled: true
                }
              }
            ])
          );
        });

        it('should select the session store', async () => {
          await processAllowAnonymousRead();
          expect(mockStore.select).toHaveBeenCalledOnceWith('session');
        });

        it('should return undefined if session is read enabled', async () => {
          expect(await processAllowAnonymousRead()).toBe(undefined);
        });
      });

      describe('with read not enabled', () => {
        beforeEach(() => {
          mockStore.select.mockReturnValue(
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

        it('should navigate to /login if the session is not read enabled', async () => {
          await processAllowAnonymousRead();
          expect($state.target).toHaveBeenCalledOnceWith('login');
        });
      });
    });
  });

  describe('authentication', () => {
    let authenticationPredicate, processAuthentication;
    beforeEach(() => {
      const args = $transitions.onStart.mock.calls[1];
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
        $state.target.mockReturnValue({});

        transition = {
          router: {
            $state
          },
          to: jest.fn(() => ({
            data: {
              access: 'fs-admin'
            }
          }))
        };
      });

      describe('when authenticated', () => {
        it('should return undefined', () => {
          mockGroupAllowed.mockReturnValue(true);
          expect(processAuthentication(transition)).toBe(undefined);
        });
      });

      describe('when not authenticated', () => {
        let result;
        beforeEach(() => {
          mockGroupAllowed.mockReturnValue(false);
          result = processAuthentication(transition);
        });

        it('should call authorization.groupAllowed', () => {
          expect(mockGroupAllowed).toHaveBeenCalledOnceWith('fs-admin');
        });

        it('should call transition.to', () => {
          expect(transition.to).toHaveBeenCalledTimes(1);
        });

        it('should return an object if not authenticated', () => {
          expect(result).toEqual({});
        });

        it('should target the app state if not authenticated', () => {
          mockGroupAllowed.mockReturnValue(false);

          expect($state.target).toHaveBeenCalledOnceWith('app', undefined, {
            location: true
          });
        });
      });
    });
  });
});
