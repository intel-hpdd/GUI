// @flow

import { mock, resetAll } from '../../../system-mock.js';

import type { $scopeT, $compileT } from 'angular';

describe('tree target item component', () => {
  let mod, toggleItem;

  beforeEachAsync(async function() {
    toggleItem = jasmine.createSpy('toggleItem');

    mod = await mock('source/iml/tree/tree-target-item-component.js', {
      'source/iml/tree/tree-utils': { toggleItem }
    });
  });

  beforeEach(
    module($compileProvider => {
      $compileProvider.component('treeTargetItem', mod.default);
    })
  );

  let el, $scope;

  beforeEach(
    inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = Object.create($rootScope.$new());

      $scope.record = {
        id: 1,
        label: 'target1'
      };

      const template = '<tree-target-item fs-id="\'1\'" kind="\'ost\'" record="record"></tree-target-item>';

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  afterEach(resetAll);

  it('should link to the target detail page', () => {
    const route = el.querySelector('a').getAttribute('ui-sref');

    expect(route).toBe(
      'app.oldTarget({ id: $ctrl.record.id, resetState: true })'
    );
  });

  it('should link to the target dashboard page', () => {
    const route = el.querySelector('a.dashboard-link').getAttribute('ui-sref');

    expect(route).toBe(
      'app.dashboard.ost({ id: $ctrl.record.id, resetState: true })'
    );
  });

  it('should render the label', () => {
    expect(el.querySelector('a').textContent.trim()).toBe('target1');
  });
});
