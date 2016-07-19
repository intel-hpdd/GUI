import {
  loginState
} from '../../../../source/iml/login/login-states.js';

describe('login states', () => {
  it('should create the state', () => {
    expect(loginState)
      .toEqual({
        name: 'login',
        url: '/login',
        controller: 'LoginCtrl',
        controllerAs: 'login',
        templateUrl: '/static/chroma_ui/source/iml/login/assets/html/login.js'
      });
  });
});
