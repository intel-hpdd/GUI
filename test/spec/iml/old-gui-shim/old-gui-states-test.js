import * as fp from '@iml/fp';
import * as maybe from '@iml/maybe';

describe('old gui states', () => {
  let oldGuiStates,
    mockGroups,
    resolve,
    mockResolves,
    oldFilesystemDetailResolve,
    oldUserDetailResolve,
    oldTargetResolve;

  beforeEach(() => {
    resolve = {
      resolve: {
        getData: expect.any(Function)
      }
    };

    const generateResolveData = () => {
      return {
        resolve: {
          getData: () => {}
        }
      };
    };

    mockGroups = {
      SUPERUSERS: 'superusers',
      FS_ADMINS: 'filesystem_administrators',
      FS_USERS: 'filesystem_users'
    };

    oldFilesystemDetailResolve = generateResolveData();
    oldUserDetailResolve = generateResolveData();
    oldTargetResolve = generateResolveData();

    mockResolves = {
      oldFilesystemDetailResolve,
      oldUserDetailResolve,
      oldTargetResolve
    };

    jest.mock(
      '../../../../source/iml/old-gui-shim/old-gui-resolves.js',
      () => mockResolves
    );

    jest.mock('../../../../source/iml/auth/authorization.js', () => ({
      GROUPS: mockGroups
    }));

    const mod = require('../../../../source/iml/old-gui-shim/old-gui-states.js');

    oldGuiStates = mod.default;
  });

  it('should contain the app.oldVolume state', () => {
    const state = fp.find(x => x.name === 'app.oldVolume')(oldGuiStates);
    expect(state).toEqual(
      maybe.ofJust(
        generateState(
          '/configure/volume',
          'app.oldVolume',
          'configureold/volume',
          'Graphical_User_Interface_9_0.html#9.3.7',
          'Volumes',
          'fa-th',
          {}
        )
      )
    );
  });

  it('should contain the app.oldPower state', () => {
    const state = fp.find(x => x.name === 'app.oldPower')(oldGuiStates);
    expect(state).toEqual(
      maybe.ofJust(
        generateState(
          '/configure/power',
          'app.oldPower',
          'configureold/power',
          'Graphical_User_Interface_9_0.html#9.3.2',
          'Power Control',
          'fa-bolt',
          {}
        )
      )
    );
  });

  it('should contain the app.oldFilesystemCreate state', () => {
    const state = fp.find(x => x.name === 'app.oldFilesystemCreate')(
      oldGuiStates
    );
    expect(state).toEqual(
      maybe.ofJust(
        generateState(
          '/configure/filesystem/create',
          'app.oldFilesystemCreate',
          'configureold/filesystem/create',
          'Graphical_User_Interface_9_0.html#9.3.3',
          'Create File System',
          'fa-files-o',
          {}
        )
      )
    );
  });

  it('should contain the app.oldFilesystemDetail state', () => {
    const state = fp.find(x => x.name === 'app.oldFilesystemDetail')(
      oldGuiStates
    );
    expect(state).toEqual(
      maybe.ofJust(
        generateState(
          '/configure/filesystem/:id',
          'app.oldFilesystemDetail',
          'configureold/filesystem/detail',
          'Graphical_User_Interface_9_0.html#9.1.1',
          'File System Detail',
          'fa-files-o',
          resolve
        )
      )
    );
  });

  it('should contain the app.oldUser state', () => {
    const state = fp.find(x => x.name === 'app.oldUser')(oldGuiStates);
    expect(state).toEqual(
      maybe.ofJust(
        generateState(
          '/configure/user',
          'app.oldUser',
          '/configureold/user',
          'Graphical_User_Interface_9_0.html#9.3.6',
          'Users',
          'fa-users',
          {}
        )
      )
    );
  });

  it('should contain the app.oldUserDetail state', () => {
    const state = fp.find(x => x.name === 'app.oldUserDetail')(oldGuiStates);
    expect(state).toEqual(
      maybe.ofJust(
        generateState(
          '/configure/user/:id',
          'app.oldUserDetail',
          '/userold',
          'Graphical_User_Interface_9_0.html#9.3.6',
          'User detail',
          'fa-user',
          resolve
        )
      )
    );
  });

  it('should contain the app.oldTarget state', () => {
    const state = fp.find(x => x.name === 'app.oldTarget')(oldGuiStates);
    expect(state).toEqual(
      maybe.ofJust(
        generateState(
          '/target/:id',
          'app.oldTarget',
          '/targetold',
          '',
          'Target Detail',
          'fa-bullseye',
          resolve
        )
      )
    );
  });

  it('should contain the app.oldSystemStatus state', () => {
    const state = fp.find(x => x.name === 'app.oldSystemStatus')(oldGuiStates);
    expect(state).toEqual(
      maybe.ofJust(
        generateState(
          '/system_status',
          'app.oldSystemStatus',
          '/system_statusold',
          '',
          'System status',
          'fa-database',
          {}
        )
      )
    );
  });
});

function generateState(url, name, path, helpPage, kind, icon, resolve) {
  return {
    url,
    name,
    controller: expect.any(Function),
    controllerAs: '$ctrl',
    template: `
      <iframe-shim params="::$ctrl.params" path="${path}"></iframe-shim>
      `,
    params: {
      resetState: {
        dynamic: true
      }
    },
    data: {
      helpPage,
      access: 'filesystem_administrators',
      anonymousReadProtected: true,
      kind,
      icon,
      noSpinner: true
    },
    ...resolve
  };
}
