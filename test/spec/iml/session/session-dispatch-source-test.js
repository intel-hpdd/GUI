// @flow

import highland from 'highland';

describe('session dispatch source', () => {
  let mockSocketStream, session$, spy, mockCacheInitialData, store;
  beforeEach(() => {
    mockCacheInitialData = {
      session: {
        read_enabled: false,
        resource_uri: '',
        user: null
      }
    };

    spy = jest.fn();
    session$ = highland();

    mockSocketStream = jest.fn(() => session$);

    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    jest.mock('../../../../source/iml/environment.js', () => ({
      CACHE_INITIAL_DATA: mockCacheInitialData
    }));

    store = require('../../../../source/iml/store/get-store.js').default;
    require('../../../../source/iml/session/session-dispatch-source.js');
  });

  it('should push the initial session through the session store', () => {
    store.select('session').each(spy);

    expect(spy).toHaveBeenCalledOnceWith({
      session: mockCacheInitialData.session
    });
  });

  it('should call socketStream', () => {
    expect(mockSocketStream).toHaveBeenCalledOnceWith('/session', {});
  });

  it('should dispatch session changes to the store', () => {
    const session = {
      read_enabled: true,
      resource_uri: '/',
      user: {
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

    store.select('session').each(spy);

    session$.write(session);

    expect(spy).toHaveBeenCalledOnceWith({ session });
  });
});
