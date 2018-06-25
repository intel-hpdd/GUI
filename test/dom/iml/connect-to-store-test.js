// @flow

import Inferno from 'inferno';
import { addErrors } from '../../../source/iml/login/login-form-actions.js';

describe('connect to store', () => {
  let root, LoginForm, connectToStore, store;
  beforeEach(() => {
    const worker = {
      addEventListener: jest.fn()
    };

    const mockGetWebWorker = jest.fn(() => worker);

    jest.mock('../../../source/iml/socket-worker/get-web-worker.js', () => mockGetWebWorker);

    store = require('../../../source/iml/store/get-store.js').default;

    connectToStore = require('../../../source/iml/connect-to-store').default;

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
