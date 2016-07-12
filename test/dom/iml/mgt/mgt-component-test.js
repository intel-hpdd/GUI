import highland from 'highland';

import broadcaster from '../../../../source/iml/broadcaster.js';
import mgtModule from '../../../../source/iml/mgt/mgt-module.js';


describe('mgt component', () => {
  beforeEach(module(mgtModule, $provide => {
    $provide.value('socketStream', jasmine.createSpy('socketStream'));
  }));

  var el, $scope;

  beforeEach(inject(($rootScope, $compile) => {
    const template = `
      <mgt mgt-$="mgtStream" alert-indicator-b="mgtAlertIndicatorStream"
         job-indicator-b="mgtJobIndicatorStream"></mgt>
    `;

    $scope = $rootScope.$new();
    $scope.mgtStream = highland();
    $scope.mgtAlertIndicatorStream = broadcaster(highland());
    $scope.mgtJobIndicatorStream = broadcaster(highland());
    el = $compile(template)($scope)[0];
    $scope.$digest();
  }));

  describe('with data', () => {
    beforeEach(() => {
      $scope.mgtStream.write([
        {
          id: 1,
          ha_label: 'MGS_49c000',
          resource_uri: '/api/target/1',
          volume_name: 'FAKEDEVICE000',
          filesystems: [
            {
              id: 1,
              name: 'fs'
            },
            {
              id: 2,
              name: 'fs2'
            }
          ],
          primary_server: '/api/host/3',
          primary_server_name: 'test000',
          active_host_name: 'test000',
          failover_server_name: 'test001',
          available_actions: []
        }
      ]);
    });

    it('should render the title', () => {
      expect(el.querySelector('.section-header')).toHaveText('MGTs');
    });

    it('should render the ha_label', () => {
      expect(el.querySelector('td')).toHaveText('MGS_49c000');
    });

    it('should link to the mgt detail page', () => {
      expect(el.querySelector('td a').getAttribute('route-to'))
        .toBe('configure/mgt/1');
    });

    it('should render the first filesystem', () => {
      expect(el.querySelector('td.comma-list a')).toHaveText('fs');
    });

    it('should render the second filesystem', () => {
      expect(el.querySelectorAll('td.comma-list a')[1]).toHaveText('fs2');
    });

    it('should render the first filesystem link', () => {
      expect(el.querySelector('td.comma-list a').getAttribute('route-to'))
        .toBe('configure/filesystem/1');
    });

    it('should render the second filesystem link', () => {
      expect(el.querySelectorAll('td.comma-list a')[1].getAttribute('route-to'))
        .toBe('configure/filesystem/2');
    });

    it('should render the volume name', () => {
      expect(el.querySelectorAll('td')[3])
        .toHaveText('FAKEDEVICE000');
    });

    it('should render the primary server name', () => {
      expect(el.querySelectorAll('td')[4])
        .toHaveText('test000');
    });

    it('should render the primary server link', () => {
      const route = el
        .querySelectorAll('td')[4]
        .querySelector('a')
        .getAttribute('route-to');

      expect(route)
        .toBe('configure/server/3');
    });

    it('should render the failover server name', () => {
      expect(el.querySelectorAll('td')[5])
        .toHaveText('test001');
    });

    it('should render the active server name', () => {
      expect(el.querySelectorAll('td')[6])
        .toHaveText('test000');
    });
  });

  describe('without data', () => {
    it('should render nothing', () => {
      expect(el.querySelector('.mgt-component')).toBe(null);
    });
  });
});
