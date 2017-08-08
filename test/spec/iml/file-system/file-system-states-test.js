describe('file system states', () => {
  let fileSystemListState, mockGroups, mockGetStore;

  beforeEach(() => {
    mockGroups = {
      SUPERUSERS: 'superusers',
      FS_ADMINS: 'filesystem_administrators',
      FS_USERS: 'filesystem_users'
    };
    mockGetStore = jest.fn();

    jest.mock('../../../../source/iml/store/get-store.js', () => mockGetStore);
    jest.mock('../../../../source/iml/auth/authorization.js', () => ({
      GROUPS: mockGroups
    }));

    fileSystemListState = require('../../../../source/iml/file-system/file-system-states.js')
      .fileSystemListState;
  });

  it('should create the state', () => {
    expect(fileSystemListState).toEqual({
      url: '/configure/filesystem',
      name: 'app.fileSystem',
      controller: expect.any(Function),
      controllerAs: '$ctrl',
      params: {
        resetState: {
          dynamic: true
        }
      },
      data: {
        helpPage: 'Graphical_User_Interface_9_0.html#9.3.3',
        access: mockGroups.FS_ADMINS,
        anonymousReadProtected: true,
        eulaState: true,
        kind: 'File Systems',
        icon: 'fa-files-o'
      },
      template: `<div class="container container-full">
<file-system file-system-$="$ctrl.fileSystem$" alert-indicator-$="$ctrl.alertIndicator$"
   job-indicator-$="$ctrl.jobIndicator$"></file-system>
</div>
`
    });
  });
});
