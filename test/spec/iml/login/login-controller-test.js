// @flow

describe('login controller', () => {
  let mockAuthorization,
    mockEnvironment,
    mockGlobal,
    navigate,
    json,
    fetchPromise,
    finishFetch,
    ctrl;
  beforeEach(() => {
    mockAuthorization = {
      getCSRFToken: jest.fn(() => ({
        'X-CSRFToken': 'qqo4KXV34frTf0mzlKlEK7FaTffEoqqb'
      }))
    };

    jest.mock(
      '../../../../source/iml/auth/authorization.js',
      () => mockAuthorization
    );

    mockEnvironment = {
      ALLOW_ANONYMOUS_READ: true
    };

    jest.mock('../../../../source/iml/environment.js', () => mockEnvironment);

    json = jest.fn(() => Promise.resolve({ __all__: 'User Unauthorized' }));
    fetchPromise = new Promise(res => {
      finishFetch = code => {
        switch (code) {
          case 201:
            res({ status: code });
            break;
          default:
            res({
              json
            });
        }
      };
    });

    mockGlobal = {
      fetch: jest.fn(() => fetchPromise)
    };
    jest.mock('../../../../source/iml/global.js', () => mockGlobal);

    navigate = jest.fn(() => 'navigate');

    ctrl = {
      inProgress: null,
      submitLogin: () => {},
      validate: () => {},
      ALLOW_ANONYMOUS_READ: null,
      goToIndex: null,
      username: 'johnsonw',
      password: 'abc123'
    };
    require('../../../../source/iml/login/login-controller.js').default.bind(
      ctrl
    )(navigate);
  });

  it('should set ALLOW_ANONYMOUS_READ', () => {
    expect(ctrl.ALLOW_ANONYMOUS_READ).toEqual(true);
  });

  it('should set goToIndex', () => {
    expect(ctrl.goToIndex).toEqual(navigate);
  });

  describe('logging in', () => {
    beforeEach(() => {
      ctrl.submitLogin();
    });

    it('should set the form to inProgress', () => {
      expect(ctrl.inProgress).toBe(true);
    });

    it('should post to the session api', () => {
      expect(mockGlobal.fetch).toHaveBeenCalledWith('/api/session/', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
          'X-CSRFToken': 'qqo4KXV34frTf0mzlKlEK7FaTffEoqqb'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: 'johnsonw',
          password: 'abc123'
        })
      });
    });

    describe('after successful session creation', () => {
      beforeEach(async () => {
        finishFetch(201);
        await ctrl.validate;
      });

      it('should set inProgress to false', () => {
        expect(ctrl.inProgress).toBe(false);
      });

      it('should navigate to the dashboard', () => {
        expect(navigate).toHaveBeenCalledWith();
        expect(navigate).toHaveBeenCalledTimes(1);
      });
    });

    describe('after unsuccessful session creation', () => {
      let spy;
      beforeEach(async () => {
        finishFetch(403);
        spy = jest.fn(() => 'spy');

        try {
          await ctrl.validate;
        } catch (e) {
          spy(e);
        }
      });

      it('should invoke the json message', () => {
        expect(json).toHaveBeenCalledWith();
        expect(json).toHaveBeenCalledTimes(1);
      });

      it('should set inProgress to false', () => {
        expect(ctrl.inProgress).toBe(false);
      });

      it('should return a reason why the session was not created', () => {
        expect(spy).toHaveBeenCalledWith({
          data: {
            __all__: 'User Unauthorized'
          }
        });
      });
    });
  });
});
