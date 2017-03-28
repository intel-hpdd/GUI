// @flow

import { mock, resetAll } from '../../../system-mock.js';

import type { $scopeT, $compileT } from 'angular';

describe('tree server item component', () => {
  let mod, toggleItem;

  beforeEachAsync(async function() {
    toggleItem = jasmine.createSpy('toggleItem');

    mod = await mock('source/iml/tree/tree-server-item-component.js', {
      'source/iml/tree/tree-utils': { toggleItem }
    });
  });

  beforeEach(
    module($compileProvider => {
      $compileProvider.component('treeServerItem', mod.default);
    })
  );

  let el, $scope;

  beforeEach(
    inject(($compile: $compileT, $rootScope: $scopeT) => {
      $scope = Object.create($rootScope.$new());

      $scope.record = {
        id: 1,
        fqdn: 'lotus-34vm3.lotus.hpdd.lab.intel.com'
      };

      $scope.parent = {
        treeId: 1,
        opens: {}
      };

      const template = '<tree-server-item parent="parent" record="record"></tree-server-item>';

      el = $compile(template)($scope)[0];
      $scope.$digest();
    })
  );

  afterEach(resetAll);

  it('should link to the server detail page', () => {
    const route = el.querySelector('a').getAttribute('ui-sref');

    expect(route).toBe(
      'app.serverDetail({ id: $ctrl.record.id, resetState: true })'
    );
  });

  it('should link to the server dashboard page', () => {
    const route = el.querySelector('a.dashboard-link').getAttribute('ui-sref');

    expect(route).toBe(
      'app.dashboard.server({ id: $ctrl.record.id, resetState: true })'
    );
  });

  it('should render the fqdn', () => {
    expect(el.querySelector('a').textContent.trim()).toBe(
      'lotus-34vm3.lotus.hpdd.lab.intel.com'
    );
  });

  it('should not render any children', () => {
    expect(el.querySelector('.children')).toBeNull();
  });

  it('should start with arrow pointed right', () => {
    expect(el.querySelector('i.fa-chevron-right')).not.toHaveClass(
      'fa-rotate-90'
    );
  });

  describe('on click', () => {
    beforeEach(() => {
      const chevron = el.querySelector('i.fa-chevron-right');
      chevron.click();
      $scope.parent.opens[1] = true;
      $scope.$digest();
    });

    it('should show the children', () => {
      expect(el.querySelector('.children')).not.toBeNull();
    });

    it('should show the volume collection', () => {
      expect(el.querySelector('tree-volume-collection')).not.toBeNull();
    });

    it('should call the store', () => {
      expect(toggleItem).toHaveBeenCalledOnceWith(1, 1, true);
    });
  });
});
