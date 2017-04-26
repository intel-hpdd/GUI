import multiTogglerContainerComponent from '../../../../source/iml/multi-toggler/multi-toggler-container-component.js';
import multiTogglerComponent from '../../../../source/iml/multi-toggler/multi-toggler-component.js';
import multiTogglerModel from '../../../../source/iml/multi-toggler/multi-toggler-model-directive.js';
import angular from '../../../angular-mock-setup.js';

import angularUiBootstrap from 'angular-ui-bootstrap';

describe('multi toggler', () => {
  beforeEach(() => {
    if (!window.angular) require('angular');
  });

  beforeEach(
    angular.mock.module(angularUiBootstrap, $compileProvider => {
      $compileProvider.component(
        'multiTogglerContainer',
        multiTogglerContainerComponent
      );
      $compileProvider.component('multiToggler', multiTogglerComponent);
      $compileProvider.directive('multiTogglerModel', multiTogglerModel);
    })
  );

  let $scope, el;
  beforeEach(
    angular.mock.inject(($rootScope, $compile) => {
      $scope = $rootScope.$new();
      Object.assign($scope, { selected1: true, selected2: false });
      const template = ` <multi-toggler-container> <button class="btn" ng-model="selected1" uib-btn-checkbox multi-toggler-model >Foo</button> <button class="btn" ng-model="selected2" uib-btn-checkbox multi-toggler-model >Bar</button> <multi-toggler on-save="onSave()" on-cancel="onCancel()" ></multi-toggler> </multi-toggler-container> `;
      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );
  it('should select the state on all', () => {
    el.querySelector('multi-toggler .btn-group a').click();
    expect(
      el.querySelectorAll('multi-toggler-container > button.active').length
    ).toBe(2);
  });
  it('should invert the state on all', () => {
    el.querySelectorAll('multi-toggler .btn-group a')[2].click();
    expect(
      el.querySelectorAll('multi-toggler-container > button.active').length
    ).toBe(1);
  });
  it('should de-select the state on all', () => {
    el.querySelectorAll('multi-toggler .btn-group a')[1].click();
    expect(
      el.querySelectorAll('multi-toggler-container > button.active').length
    ).toBe(0);
  });
});
