describe('authorization', function () {
  'use strict';

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
      beforeEach(module('auth', function ($provide) {
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

      var $scope, genRestrictTo, genRestrict, authorization;

      beforeEach(inject(function ($compile, $rootScope, _authorization_) {
        $scope = $rootScope.$new();
        authorization = _authorization_;

        var template = _.curry(function template (attr, val) {
          var str = '<div %s="%s"></div>'.sprintf(attr, val);
          return $compile(str)($scope);
        });

        genRestrictTo = template('restrict-to');
        genRestrict = template('restrict');
      }));

      describe('directive', function () {
        var el, visibility;

        describe('of type restrictTo', function () {
          beforeEach(function () {
            el = genRestrictTo(test.group);
            $scope.$digest();
          });

          it('should be %s to group %s when restricted to %s'.sprintf(
            visibility = (test.isVisible ? 'visible' : 'invisible'),
            test.sessionGroups[0].name,
            test.group), function () {
            expect(el.hasClass('invisible')).toEqual(!test.visibility.restrictTo);
          });
        });

        describe('of type restrict', function () {
          beforeEach(function () {
            el = genRestrict(test.group);
            $scope.$digest();
          });

          it('should be %s to group %s when restricted to %s'.sprintf(
            (test.isVisible ? 'visible' : 'invisible'),
            test.sessionGroups[0].name,
            test.group), function () {
            expect(el.hasClass('invisible')).toEqual(!test.visibility.restricted);
          });
        });
      });
    });
  });
});
