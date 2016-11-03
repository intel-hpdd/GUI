import lnetModule from '../../../../source/iml/lnet/lnet-module';
import highland from 'highland';

describe('LNet status directive', () => {
  beforeEach(module(lnetModule));

  let el,
    $scope;

  beforeEach(inject(($rootScope, $compile) => {
    const template = '<lnet-status stream="stream"></lnet-status>';

    $scope = $rootScope.$new();
    $scope.stream = highland();
    el = $compile(template)($scope)[0];
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
    .forEach(state => {
      it(`should display state for ${state[0]}`, () => {
        $scope.stream.write({
          state: state[1]
        });

        expect(el.querySelector('span').textContent.trim())
          .toEqual(state[0]);
      });
    });

  it('should display nothing when there is no data', () => {
    $scope.stream.write();

    expect(el.querySelector('span'))
      .toBeNull();
  });
});
