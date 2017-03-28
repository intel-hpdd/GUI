// @flow

import connectToStore from '../../../source/iml/connect-to-store.js';
import Inferno from 'inferno';
import store from '../../../source/iml/store/get-store.js';
import { addErrors } from '../../../source/iml/login/login-form-actions.js';

describe('connect to store', () => {
  let root, LoginForm;
  beforeEach(() => {
    root = document.createElement('div');

    LoginForm = connectToStore('loginForm', ({ loginForm, foo }) => (
      <div>
        <h1>{loginForm.__all__}</h1>
        <p id="username">{loginForm.username[0]}</p>
        <p id="password">{loginForm.password[0]}</p>
        <p id="foo">{foo}</p>
      </div>
    ));

    store.dispatch(
      addErrors({
        __all__: 'uh-oh',
        username: ['problem'],
        password: ['oh noes']
      })
    );

    Inferno.render(<LoginForm foo="bar" />, root);
  });

  it('should have the header error', () => {
    expect(root.querySelector('h1')).toHaveText('uh-oh');
  });

  it('should display the username error', () => {
    expect(root.querySelector('#username')).toHaveText('problem');
  });

  it('should display the password error', () => {
    expect(root.querySelector('#password')).toHaveText('oh noes');
  });

  it('should display foo', () => {
    expect(root.querySelector('#foo')).toHaveText('bar');
  });
});
