import {
  fileSystemListState
} from '../../../../source/iml/file-system/file-system-states.js';

import { GROUPS } from '../../../../source/iml/auth/authorization.js';

describe('file system states', () => {
  it('should create the state', () => {
    expect(fileSystemListState).toEqual({
      url: '/configure/filesystem',
      name: 'app.fileSystem',
      controller: jasmine.any(Function),
      controllerAs: '$ctrl',
      params: {
        resetState: {
          dynamic: true
        }
      },
      data: {
        helpPage: 'file_systems_tab.htm',
        access: GROUPS.FS_ADMINS,
        anonymousReadProtected: true,
        eulaState: true,
        kind: 'File Systems',
        icon: 'fa-files-o'
      },
      template: jasmine.any(String)
    });
  });
});
