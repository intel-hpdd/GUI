// @flow

import {
  mock,
  resetAll
} from '../../../system-mock.js';

import highland from 'highland';
import store from '../../../../source/iml/store/get-store.js';

describe('session dispatch source', () => {
  let socketStream, session$, spy, CACHE_INITIAL_DATA;
  beforeEachAsync(async () => {
    CACHE_INITIAL_DATA = {
      session: {
        read_enabled: false,
        resource_uri: '',
        user: null
      }
    };

    spy = jasmine.createSpy('spy');
    session$ = highland();

    socketStream = jasmine.createSpy('socketStream')
      .and
      .returnValue(session$);

    await mock('source/iml/session/session-dispatch-source.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream },
      'source/iml/environment.js': { CACHE_INITIAL_DATA }
    });
  });

  afterEach(resetAll);

  it('should push the initial session through the session store', () => {
    store
      .select('session')
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith({
      session: CACHE_INITIAL_DATA.session
    });
  });

  it('should call socketStream', () => {
    expect(socketStream).toHaveBeenCalledOnceWith('/session', {});
  });

  it('should dispatch session changes to the store', () => {
    const session = {
      read_enabled: true,
      resource_uri: '/',
      user:   {
        accepted_eula: true,
        alert_subscriptions: [{}],
        email: 'john.doe@intel.com',
        eula_state: 'pass',
        first_name: 'John',
        full_name: 'John Doe',
        groups: [],
        gui_config: {},
        id: '1',
        is_superuser: true,
        last_name: 'Doe',
        resource_uri: '/session',
        roles: '',
        username: 'johndoe'
      }
    };

    store
      .select('session')
      .each(spy);

    session$.write(session);

    expect(spy).toHaveBeenCalledOnceWith({session});
  });
});
