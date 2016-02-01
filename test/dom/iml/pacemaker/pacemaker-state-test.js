import highland from 'highland';
import pacemakerModule from '../../../../source/iml/pacemaker/pacemaker-module';


describe('pacemaker state directive', function () {
  beforeEach(module(pacemakerModule));

  var el, $scope, $compile;

  beforeEach(inject(function ($rootScope, _$compile_) {
    $compile = _$compile_;

    var template = '<pacemaker-state stream="stream"></pacemaker-state>';

    $scope = $rootScope.$new();
    $scope.stream = highland();
    spyOn($scope.stream, 'destroy');

    el = $compile(template)($scope);
    $scope.$digest();
  }));

  var states = [
    ['Pacemaker Started', 'started'],
    ['Pacemaker Stopped', 'stopped'],
    ['Pacemaker Unconfigured', 'unconfigured']
  ];

  states.forEach(function (state) {
    it('should display state for ' + state[0] + ' with no host id', function () {
      $scope.stream.write({
        state: state[1]
      });

      expect(el.find('span span').text().trim())
        .toEqual(state[0]);
    });
  });

  it('should display nothing when there is no data', function () {
    $scope.stream.write([]);

    expect(el.find('span span').text().trim())
      .toEqual('');
  });

  it('should display nothing when there is bad data', function () {
    $scope.stream.write([null]);

    expect(el.find('span span').text().trim())
      .toEqual('');
  });

  it('should destroy the stream when the scope is destroyed', function () {
    $scope.$destroy();

    expect($scope.stream.destroy).toHaveBeenCalledOnce();
  });
});
