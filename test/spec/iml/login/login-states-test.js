import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('login states', () => {
  let loginState;

  beforeEachAsync(async function () {
    const mod = await mock('source/iml/login/login-states.js', {
      'source/iml/login/assets/html/login.html!text': { default: 'loginTemplate' }
    });

    loginState = mod.loginState;
  });

  afterEach(resetAll);

  it('should create the state', () => {
    expect(loginState)
      .toEqual({
        name: 'login',
        url: '/login',
        controller: 'LoginCtrl',
        controllerAs: 'login',
        template: 'loginTemplate'
      });
  });
});
