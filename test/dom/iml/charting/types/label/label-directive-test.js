import highland from 'highland';
import d3 from 'd3';
import { charterDirective } from '../../../../../../source/iml/charting/types/chart/chart-directive.js';
import { labelDirective } from '../../../../../../source/iml/charting/types/label/label-directive.js';
import angular from '../../../../../angular-mock-setup.js';

describe('label directive', () => {
  let $scope, el, qs, label, spy;

  beforeEach(
    angular.mock.module($compileProvider => {
      $compileProvider.directive('charter', charterDirective);
      $compileProvider.directive('label', labelDirective);
    })
  );

  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      const template = `
      <div charter stream="stream">
        <g label on-data="onData" on-update="onUpdate"></g>
      </div>
    `;

      spy = jest.fn();
      $scope = $rootScope.$new();
      $scope.stream = highland([[1, 2, 3, 4]]);
      $scope.onData = () => ['data'];
      $scope.onUpdate = [spy];

      el = angular.element(template)[0];
      document.body.appendChild(el);
      d3.select(el).style({
        display: 'inline-block',
        width: '200px',
        height: '200px'
      });

      $compile(el)($scope)[0];

      qs = expr => el.querySelector(expr);
      label = qs.bind(null, '.label-group');
      $scope.$digest();
    })
  );

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should append a label group', () => {
    expect(label()).not.toBeNull();
  });

  it('should append text', () => {
    expect(qs('.label-text').textContent).toBe('data');
  });

  it('should call onUpdate', () => {
    expect(spy).toHaveBeenCalledOnceWith({
      label: expect.any(Function),
      node: expect.any(Object),
      svg: expect.any(Object),
      width: 120,
      height: 140,
      xs: [1, 2, 3, 4]
    });
  });
});
