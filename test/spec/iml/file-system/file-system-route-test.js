import {
  mock,
  resetAll
} from '../../../system-mock.js';


describe('file-system route', () => {
  let mod, $routeSegmentProvider;

  beforeEachAsync(async function () {
    $routeSegmentProvider = {
      $get: function get () {},
      segment: jasmine.createSpy('$routeSegmentProvider.segment')
        .and.callFake(routeSegementProvider),
      when: jasmine.createSpy('$routeSegmentProvider.when')
        .and.callFake(routeSegementProvider),
      within: jasmine.createSpy('$routeSegmentProvider.within')
        .and.callFake(routeSegementProvider)
    };

    function routeSegementProvider () {
      return $routeSegmentProvider;
    }

    mod = await mock('source/iml/file-system/file-system-route.js', {});

    mod.default($routeSegmentProvider, {
      FS_ADMINS: 'filesystem_administrators'
    });
  });

  afterEach(resetAll);

  it('should register the file system route', () => {
    expect($routeSegmentProvider.when)
      .toHaveBeenCalledOnceWith('/configure/filesystem', 'app.fileSystem');
  });

  it('should go within app', () => {
    expect($routeSegmentProvider.within)
      .toHaveBeenCalledOnceWith('app');
  });

  it('should register the segment', () => {
    expect($routeSegmentProvider.segment)
      .toHaveBeenCalledOnceWith('fileSystem', {
        template: jasmine.any(String),
        controller: jasmine.any(Function),
        controllerAs: '$ctrl',
        access: 'filesystem_administrators',
        untilResolved: {
          templateUrl: '/static/chroma_ui/source/iml/loading/assets/html/loading.js'
        },
        middleware: [
          'allowAnonymousReadMiddleware',
          'eulaStateMiddleware',
          'authenticationMiddleware'
        ]
      });
  });
});
