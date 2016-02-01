import {curry} from 'intel-fp';
import authModule from '../../../../source/iml/auth/auth-module';

describe('authorization', () => {
  var data;
  data = [
    {
      sessionGroups: [{name: 'superusers'}],
      group: 'superusers',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [{name: 'filesystem_users'}],
      group: 'superusers',
      visibility: {
        restrictTo: false,
        restricted: true
      }
    },
    {
      sessionGroups: [{name: 'filesystem_administrators'}],
      group: 'superusers',
      visibility: {
        restrictTo: false,
        restricted: true
      }
    },
    {
      sessionGroups: [{name: 'superusers'}],
      group: 'filesystem_users',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [{name: 'filesystem_users'}],
      group: 'filesystem_users',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [{name: 'filesystem_administrators'}],
      group: 'filesystem_users',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [{name: 'superusers'}],
      group: 'filesystem_administrators',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [{name: 'filesystem_administrators'}],
      group: 'filesystem_administrators',
      visibility: {
        restrictTo: true,
        restricted: false
      }
    },
    {
      sessionGroups: [{name: 'filesystem_users'}],
      group: 'filesystem_administrators',
      visibility: {
        restrictTo: false,
        restricted: true
      }
    }
  ];

  data.forEach(function (test) {
    describe('module', function () {
      beforeEach(module(authModule, function ($provide) {
        var CACHE_INITIAL_DATA = {
          session: {
            read_enabled: true,
            user: {
              groups: test.sessionGroups
            }
          }
        };

        $provide.constant('CACHE_INITIAL_DATA', CACHE_INITIAL_DATA);
      }));

      var $scope, genRestrictTo, genRestrict;

      beforeEach(inject(function ($compile, $rootScope) {
        $scope = $rootScope.$new();

        var template = curry(2, function template (attr, val) {
          const str = `<div ${attr}="${val}"></div>`;
          return $compile(str)($scope);
        });

        genRestrictTo = template('restrict-to');
        genRestrict = template('restrict');
      }));

      describe('directive', function () {
        var el;

        describe('of type restrictTo', function () {
          beforeEach(function () {
            el = genRestrictTo(test.group);
            $scope.$digest();
          });

          it(`should be ${test.sessionGroups[0].name} to group ${test.group}`, function () {
            expect(el.hasClass('invisible'))
              .toEqual(!test.visibility.restrictTo);
          });
        });

        describe('of type restrict', function () {
          beforeEach(function () {
            el = genRestrict(test.group);
            $scope.$digest();
          });

          it(`should be ${test.isVisible ? 'visible' : 'invisible'}
 to group ${test.sessionGroups[0].name} when restricted to ${test.group}`, function () {
            expect(el.hasClass('invisible')).toEqual(!test.visibility.restricted);
          });
        });
      });
    });
  });
});
