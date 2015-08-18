describe('LNet status directive', function () {
  'use strict';

  beforeEach(module('lnetModule', 'templates'));

  var el, $scope;

  beforeEach(inject(function ($rootScope, $compile) {
    var template = '<lnet-status stream="stream" host-id="hostId"></lnet-status>';

    $scope = $rootScope.$new();
    $scope.stream = highland();
    $scope.hostId = '1';

    el = $compile(template)($scope);
    $scope.$digest();
  }));

  [
    ['LNet Up', 'lnet_up'],
    ['LNet Down', 'lnet_down'],
    ['LNet Unloaded', 'lnet_unloaded'],
    ['Configured', 'configured'],
    ['Unconfigured', 'unconfigured'],
    ['Undeployed', 'undeployed']
  ]
    .forEach(function (state) {
      it('should display state for ' + state, function () {
        $scope.stream.write([{
          host: {
            id: '1'
          },
          state: state[1]
        }]);

        expect(el.find('span span').text().trim())
          .toEqual(state[0]);
      });
    });

  it('should display nothing when there is no data', function () {
    $scope.stream.write([]);

    expect(el.find('span span').text().trim())
      .toEqual('');
  });
});
