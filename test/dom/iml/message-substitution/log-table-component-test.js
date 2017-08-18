import logModule from '../../../../source/iml/logs/log-module.js';
import highland from 'highland';
import store from '../../../../source/iml/store/get-store.js';

import { setSession } from '../../../../source/iml/session/session-actions.js';

import angular from '../../../angular-mock-setup.js';

describe('log table component', () => {
  let $scope,
    template,
    el,
    log$,
    table,
    dateField,
    fqdnLink,
    fqdnSpan,
    fqdnRestricted,
    tag,
    message,
    messageLink;

  beforeEach(() => {
    log$ = highland([
      {
        meta: {
          total_count: 1
        },
        objects: [
          {
            resource_uri: '/api/host/1/',
            datetime: '2016-06-23T19:11:40.568729+00:00',
            host_id: 1,
            fqdn: 'test001.localdomain',
            tag: 'cluster_sim',
            message:
              'Lustre: Cluster simulator syslog session start test001.localdomain 2016-06-24 14:53:33.208454',
            substitutions: [
              {
                start: 48,
                end: 67,
                resource_uri: '/api/host/1',
                label: 'test001.localdomain'
              }
            ]
          }
        ]
      }
    ]);
  });

  beforeEach(angular.mock.module(logModule));

  describe('with authorization', () => {
    beforeEach(
      angular.mock.inject(($rootScope, $compile) => {
        store.dispatch(
          setSession({
            read_enabled: true,
            resource_uri: '/session',
            user: {
              alert_subscriptions: [{}],
              email: 'john.doe@intel.com',
              first_name: 'John',
              full_name: 'John Doe',
              groups: [
                { id: '1', name: 'superusers', resource_uri: '/api/group/1/' },
                {
                  id: '2',
                  name: 'filesystem_administrators',
                  resource_uri: '/api/group/1/'
                },
                {
                  id: '3',
                  name: 'filesystem_users',
                  resource_uri: '/api/group/1/'
                }
              ],
              gui_config: {},
              id: '1',
              is_superuser: true,
              last_name: 'Doe',
              resource_uri: '/session',
              roles: '',
              username: 'johndoe'
            }
          })
        );

        $scope = $rootScope.$new();
        $scope.log$ = log$;
        template = '<log-table log$="::log$"></log-table>';
        el = $compile(template)($scope)[0];
        $scope.$digest();

        table = el.querySelector.bind(el, 'table');
        dateField = el.querySelector.bind(
          el,
          'table tr td:nth-of-type(1) span'
        );
        fqdnLink = el.querySelector.bind(el, 'table tr td:nth-of-type(2) a');
        fqdnSpan = el.querySelector.bind(el, 'table tr td:nth-of-type(2) span');
        fqdnRestricted = el.querySelector.bind(
          el,
          'table tr td:nth-of-type(3)'
        );
        tag = el.querySelector.bind(el, 'table tr td:nth-of-type(4)');
        message = el.querySelector.bind(el, 'table tr td:nth-of-type(5)');
        messageLink = el.querySelector.bind(el, 'table tr td:nth-of-type(5) a');
      })
    );

    it('should contain a table', () => {
      expect(table()).not.toBeNull();
    });

    it('should contain a date in the first column', () => {
      expect(dateField().textContent.trim()).toEqual('2016-06-23 19:11:40');
    });

    it('should link to the fqdn in the second column', () => {
      expect(fqdnLink().getAttribute('route-to')).toEqual('configure/server/1');
    });

    it('should display the fqdn label in the second column', () => {
      expect(fqdnLink().textContent.trim()).toEqual('test001.localdomain');
    });

    it('should not display the fqdn span in the second column', () => {
      expect(fqdnSpan()).toBeNull();
    });

    it('should set the restricted fqdn to be invisible in the third column', () => {
      expect(fqdnRestricted().className.indexOf('invisible') > -1).toBe(true);
    });

    it('should display the tag in the fourth column', () => {
      expect(tag().textContent.trim()).toEqual('cluster_sim');
    });

    it('should display the message in the fifth column', () => {
      expect(message().textContent.trim()).toEqual(
        'Lustre: Cluster simulator syslog session start test001.localdomain' +
          ' 2016-06-24 14:53:33.208454'
      );
    });

    it('should link to the fqdn in the message column', () => {
      expect(messageLink().getAttribute('route-to')).toEqual(
        'configure/server/1/'
      );
    });
  });

  describe('without authorization', () => {
    beforeEach(
      angular.mock.inject(($rootScope, $compile) => {
        store.dispatch(
          setSession({
            read_enabled: true,
            resource_uri: '/session',
            user: {
              alert_subscriptions: [{}],
              email: 'john.doe@intel.com',
              first_name: 'John',
              full_name: 'John Doe',
              groups: [
                {
                  id: '3',
                  name: 'filesystem_users',
                  resource_uri: '/api/group/1/'
                }
              ],
              gui_config: {},
              id: '1',
              is_superuser: true,
              last_name: 'Doe',
              resource_uri: '/session',
              roles: '',
              username: 'johndoe'
            }
          })
        );

        $scope = $rootScope.$new();
        $scope.log$ = log$;
        template = '<log-table log$="::log$"></log-table>';
        el = $compile(template)($scope)[0];
        $scope.$digest();

        table = el.querySelector.bind(el, 'table');
        dateField = el.querySelector.bind(
          el,
          'table tr td:nth-of-type(1) span'
        );
        fqdnLink = el.querySelector.bind(el, 'table tr td:nth-of-type(2)');
        fqdnSpan = el.querySelector.bind(el, 'table tr td:nth-of-type(2) span');
        fqdnRestricted = el.querySelector.bind(
          el,
          'table tr td:nth-of-type(3)'
        );
        tag = el.querySelector.bind(el, 'table tr td:nth-of-type(4)');
        message = el.querySelector.bind(el, 'table tr td:nth-of-type(5)');
        messageLink = el.querySelector.bind(el, 'table tr td:nth-of-type(5) a');
      })
    );

    it('should contain a table', () => {
      expect(table()).not.toBeNull();
    });

    it('should contain a date in the first column', () => {
      expect(dateField().textContent.trim()).toEqual('2016-06-23 19:11:40');
    });

    it('should not display the second column', () => {
      expect(fqdnLink().className.indexOf('invisible') > -1).toBe(true);
    });

    it('should display the fqdn in the third column', () => {
      expect(fqdnRestricted().textContent.trim()).toEqual(
        'test001.localdomain'
      );
    });

    it('should display the tag in the fourth column', () => {
      expect(tag().textContent.trim()).toEqual('cluster_sim');
    });

    it('should display the message in the fifth column', () => {
      expect(message().textContent.trim()).toEqual(
        'Lustre: Cluster simulator syslog session start test001.localdomain' +
          ' 2016-06-24 14:53:33.208454'
      );
    });

    it('should not link to the fqdn in the message column', () => {
      expect(messageLink()).toBeNull();
    });
  });
});
