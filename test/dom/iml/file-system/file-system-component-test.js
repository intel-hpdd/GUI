import highland from 'highland';
import broadcaster from '../../../../source/iml/broadcaster.js';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('file system component', () => {
  let mod;

  beforeEachAsync(async function () {
    mod = await mock('source/iml/file-system/file-system-component.js', {});
  });

  afterEach(resetAll);

  beforeEach(module('asValue', 'asStream', 'extractApiFilter', $compileProvider => {
    $compileProvider.component('fileSystem', mod.default);
  }));

  let el, $scope;

  beforeEach(inject(($rootScope, $compile) => {
    $scope = $rootScope.$new();
    $scope.fileSystem$ = highland();
    $scope.alertIndicator$ = broadcaster(highland());
    $scope.jobIndicator$ = broadcaster(highland());

    const template = `
    <file-system file-system-$="fileSystem$" alert-indicator-$="alertIndicator$"
         job-indicator-$="jobIndicator$"></file-system>
    `;

    el = $compile(template)($scope)[0];
    $scope.$digest();
  }));

  describe('without data', () => {
    beforeEach(() => {
      $scope.fileSystem$.write([]);
    });

    it('should render no data message', () => {
      expect(el.querySelector('.no-fs h1'))
        .toHaveText('No File Systems are configured');
    });

    it('should render a create file system button', () => {
      expect(el.querySelector('.no-fs a').getAttribute('route-to'))
        .toBe('configure/filesystem/create/');
    });
  });

  describe('with data', () => {
    beforeEach(() => {
      $scope.fileSystem$.write([
        {
          id: 1,
          resource_uri: '/api/filesystem/1',
          label: 'fs1',
          locks: [],
          name: 'fs1',
          client_count: 2,
          bytes_total: 10000,
          bytes_free: 10000,
          available_actions: [],
          mgt: {
            primary_server_name: 'test001',
            primary_server: '/api/host/1'
          },
          mdts: [
            {
              resource_uri: '/api/target/3'
            }
          ]
        }
      ]);
    });

    it('should render the title', () => {
      expect(el.querySelector('.section-header')).toHaveText('File Systems');
    });

    it('should render the fs name', () => {
      expect(el.querySelector('td')).toHaveText('fs1');
    });

    it('should link to the fs detail page', () => {
      expect(el.querySelector('td a').getAttribute('route-to'))
        .toBe('configure/filesystem/1');
    });

    it('should link to the server detail page', () => {
      expect(el.querySelectorAll('td a')[1].getAttribute('route-to'))
        .toBe('configure/server/1');
    });

    it('should render the primary management server', () => {
      expect(el.querySelectorAll('td a')[1])
        .toHaveText('test001');
    });

    it('should render the metadata server count', () => {
      expect(el.querySelectorAll('td')[3])
        .toHaveText('1');
    });

    it('should render the connected clients', () => {
      expect(el.querySelectorAll('td')[4])
        .toHaveText('2');
    });

    it('should include the action dropdown', () => {
      expect(el.querySelector('action-dropdown'))
        .not
        .toBeNull();
    });
  });
});
