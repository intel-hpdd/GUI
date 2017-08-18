describe('file system states', () => {
  let fileSystemListState, mockGroups, mockGetStore, mockBroadcaster;

  beforeEach(() => {
    mockGroups = {
      SUPERUSERS: 'superusers',
      FS_ADMINS: 'filesystem_administrators',
      FS_USERS: 'filesystem_users'
    };

    mockGetStore = {
      select: jest.fn(name => name)
    };

    mockBroadcaster = jest.fn(name => name);

    jest.mock('../../../../source/iml/store/get-store.js', () => mockGetStore);
    jest.mock('../../../../source/iml/broadcaster.js', () => mockBroadcaster);
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

  describe('controller', () => {
    beforeEach(() => {
      fileSystemListState.controller();
    });

    it('should set the fileSystem stream', () => {
      expect(fileSystemListState.fileSystem$).toEqual('fileSystems');
    });

    it('should call the broadcaster with jobIndicators', () => {
      expect(mockBroadcaster).toHaveBeenCalledWith('jobIndicators');
    });

    it('should set the jobIndicators stream', () => {
      expect(fileSystemListState.jobIndicator$).toEqual('jobIndicators');
    });

    it('should call the broadcaster with alertIndicators', () => {
      expect(mockBroadcaster).toHaveBeenCalledWith('alertIndicators');
    });

    it('should set the alertIndicators stream', () => {
      expect(fileSystemListState.alertIndicator$).toEqual('alertIndicators');
    });
  });
});
