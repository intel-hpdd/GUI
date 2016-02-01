import highland from 'highland';

import pacemakerModule from '../../../../source/iml/pacemaker/pacemaker-module';

describe('configure pacemaker', function () {
  beforeEach(module(pacemakerModule, 'highland'));

  var el, $scope, query;

  beforeEach(inject(function ($rootScope, $compile, addProperty) {
    const template = `<configure-pacemaker stream="::stream" alert-stream="::alertStream" job-stream="::jobStream">
</configure-pacemaker>`;

    $scope = $rootScope.$new();
    $scope.stream = highland().through(addProperty);
    $scope.alertStream = highland();
    $scope.jobStream = highland();

    el = $compile(template)($scope)[0];
    query = el.querySelector.bind(el);
    $scope.$digest();
  }));

  it('should not render if stream has no data', function () {
    expect(query('.section-header')).toBeNull();
  });

  it('should not render if stream has falsey data', function () {
    $scope.stream.write(null);

    expect(query('.section-header')).toBeNull();
  });

  it('should render if stream has data', function () {
    $scope.stream.write({});

    expect(query('.section-header')).not.toBeNull();
  });
});
