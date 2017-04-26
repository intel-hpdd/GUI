// @flow

import {
  restrict,
  restrictTo
} from '../../../../source/iml/auth/authorization.js';

import store from '../../../../source/iml/store/get-store.js';

import { setSession } from '../../../../source/iml/session/session-actions.js';

import angular from '../../../angular-mock-setup.js';

describe('authorization', () => {
  const data = [
    {
      sessionGroups: [
        {
          name: 'superusers',
          id: '1',
          resource_uri: '/user'
        }
      ],
      group: 'superusers',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [
        {
          name: 'filesystem_users',
          id: '2',
          resource_uri: '/user'
        }
      ],
      group: 'superusers',
      visibility: {
        restrictTo: false,
        restricted: true
      }
    },
    {
      sessionGroups: [
        {
          name: 'filesystem_administrators',
          id: '3',
          resource_uri: '/user'
        }
      ],
      group: 'superusers',
      visibility: {
        restrictTo: false,
        restricted: true
      }
    },
    {
      sessionGroups: [
        {
          name: 'superusers',
          id: '1',
          resource_uri: '/user'
        }
      ],
      group: 'filesystem_users',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [
        {
          name: 'filesystem_users',
          id: '2',
          resource_uri: '/user'
        }
      ],
      group: 'filesystem_users',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [
        {
          name: 'filesystem_administrators',
          id: '3',
          resource_uri: '/user'
        }
      ],
      group: 'filesystem_users',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [
        {
          name: 'superusers',
          id: '1',
          resource_uri: '/user'
        }
      ],
      group: 'filesystem_administrators',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [
        {
          name: 'filesystem_administrators',
          id: '3',
          resource_uri: '/user'
        }
      ],
      group: 'filesystem_administrators',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [
        {
          name: 'filesystem_users',
          id: '2',
          resource_uri: '/user'
        }
      ],
      group: 'filesystem_administrators',
      visibility: {
        restrictTo: false,
        restricted: true
      }
    }
  ];

  data.forEach(test => {
    describe('module', () => {
      beforeEach(() => {
        store.dispatch(
          setSession({
            read_enabled: false,
            resource_uri: '',
            user: {
              accepted_eula: true,
              alert_subscriptions: [{}],
              email: 'john.doe@intel.com',
              eula_state: 'pass',
              first_name: 'John',
              full_name: 'John Doe',
              groups: test.sessionGroups,
              gui_config: {},
              id: '1',
              is_superuser: true,
              last_name: 'Doe',
              resource_uri: '/user',
              roles: '',
              username: 'johndoe',
              password1: null,
              new_password1: null,
              password2: null,
              new_password2: null
            }
          })
        );
      });

      beforeEach(
        angular.mock.module(($provide, $compileProvider) => {
          $compileProvider.directive('restrict', restrict);
          $compileProvider.directive('restrictTo', restrictTo);
        })
      );

      let $scope, genRestrictTo, genRestrict;
      beforeEach(
        angular.mock.inject(($compile, $rootScope) => {
          $scope = $rootScope.$new();

          const template = attr => val => {
            const str = `<div ${attr}="${val}"></div>`;
            return $compile(str)($scope);
          };

          genRestrictTo = template('restrict-to');
          genRestrict = template('restrict');
        })
      );

      describe('directive', () => {
        let el;

        describe('of type restrictTo', () => {
          beforeEach(() => {
            el = genRestrictTo(test.group);
            $scope.$digest();
          });

          it(`should be ${test.sessionGroups[0]
            .name} to group ${test.group}`, () => {
            expect(el.hasClass('invisible')).toEqual(
              !test.visibility.restrictTo
            );
          });
        });

        describe('of type restrict', () => {
          beforeEach(() => {
            el = genRestrict(test.group);
            $scope.$digest();
          });

          it(`should be ${test.isVisible ? 'visible' : 'invisible'}
 to group ${test.sessionGroups[0]
   .name} when restricted to ${test.group}`, () => {
            expect(el.hasClass('invisible')).toEqual(
              !test.visibility.restricted
            );
          });
        });
      });
    });
  });
});
