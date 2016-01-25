import angular from 'angular';
const {module, inject} = angular.mock;

describe('LNet status directive', function () {
  'use strict';

  beforeEach(module('lnetModule', 'templates'));

  var el, $scope;

  beforeEach(inject(function ($rootScope, $compile) {
    var template = '<lnet-status stream="stream"></lnet-status>';

    $scope = $rootScope.$new();
    $scope.stream = highland();
    el = $compile(template)($scope);
    $scope.$digest();
  }));

  [
    ['LNet Up', 'lnet_up'],
    ['LNet Down', 'lnet_down'],
    ['LNet Unloaded', 'lnet_unloaded'],
    ['Configured', 'configured'],
    ['Unconfigured', 'unconfigured'],
    ['Undeployed', 'undeployed'],
    ['Unknown', null]
  ]
    .forEach(function (state) {
      it('should display state for ' + state, function () {
        $scope.stream.write({
          state: state[1]
        });

        expect(el.find('span span').text().trim())
          .toEqual(state[0]);
      });
    });

  it('should display nothing when there is no data', function () {
    $scope.stream.end();

    expect(el.find('span span').text().trim())
      .toEqual('');
  });
});
