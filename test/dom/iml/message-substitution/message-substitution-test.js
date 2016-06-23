import messageSubstitutionModule from
  '../../../../source/iml/message-substitution/message-substitution-module.js';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('message substitution directive', () => {
  var el, $scope, $compile, messageEl, template, Authorization,
    mod, groupAllowed;

  beforeEachAsync(async function () {
    groupAllowed = jasmine.createSpy('groupAllowed');
    Authorization = jasmine.createSpy('Authorization')
      .and.returnValue({
        groupAllowed: groupAllowed
      });

    mod = await mock('source/iml/message-substitution/message-substitution.js', {
      'source/iml/auth/authorization.js': {
        Authorization: Authorization,
        GROUPS: {
          SUPERUSERS: 'superusers',
          FS_ADMINS: 'filesystem_administrators',
          FS_USERS: 'filesystem_users'
        }
      }
    });
  });

  afterEach(resetAll);

  beforeEach(module(messageSubstitutionModule, $controllerProvider => {
    $controllerProvider.register('MessageSubstitutionCtrl', mod.MessageSubstitutionCtrl);
  }));

  beforeEach(inject(function (_$compile_, $rootScope) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    template = '<message-substitution substitutions="::substitutions" message="::message"></message-substitution>';

    $scope.message = 'Lustre: 2178:0:(client.c:2048:ptlrpc_expire_one_request()) @@@ Request sent has timed out for '
      + 'slow reply: [sent 1466559632/real 1466559632] req@ffff88007923acc0 x1532239365854720/t0(0) o251->MGC10.14.'
      + '82.24@tcp@0@lo:26/25 lens 224/224 e 0 to 1 dl 1466559638 ref 2 fl Rpc:XN/0/ffffffff rc 0/-1';

    $scope.substitutions = [
      {
        end: 257,
        label: '0000',
        resource_uri: '/api/host/2/',
        start: 247
      },
      {
        end: 210,
        label: 'lotus-35vm15.lotus.hpdd.lab.intel.com',
        resource_uri: '/api/host/1/',
        start: 195
      }
    ];
  }));

  describe('with authorization', () => {
    beforeEach(() => {
      groupAllowed
        .and.returnValue(true);
      el = $compile(template)($scope)[0];
      document.body.appendChild(el);
      messageEl = el.querySelector.bind(el, 'div');
      $scope.$digest();
    });

    it('should contain the message', () => {
      expect(messageEl().textContent).toEqual('Lustre: 2178:0:(client.c:2048:ptlrpc_expire_one_request()) @@@ Request '
        + 'sent has timed out for slow reply: [sent 1466559632/real 1466559632] req@ffff88007923acc0 '
        + 'x1532239365854720/t0(0) o251->MGClotus-35vm15.lotus.hpdd.lab.intel.com@0@lo:'
        + '26/25 lens 224/224 e 0 to 1 dl 0000 ref 2 fl Rpc:XN/0/ffffffff rc 0/-1');
    });

    describe('message', () => {
      var links;
      beforeEach(() => {
        links = messageEl().querySelectorAll('a');
      });

      it('should link to the lotus server', () => {
        expect(links.item(0).getAttribute('href')).toEqual('/ui/configure/server/1/');
      });

      it('should display the lotus server label', () => {
        expect(links.item(0).textContent).toEqual('lotus-35vm15.lotus.hpdd.lab.intel.com');
      });

      it('should link to the second server', () => {
        expect(links.item(1).getAttribute('href')).toEqual('/ui/configure/server/2/');
      });

      it('should display the second server label', () => {
        expect(links.item(1).textContent).toEqual('0000');
      });
    });
  });

  describe('without authorization', () => {
    beforeEach(() => {
      groupAllowed
        .and.returnValue(false);
      el = $compile(template)($scope)[0];
      document.body.appendChild(el);
      messageEl = el.querySelector.bind(el, 'div');
      $scope.$digest();
    });

    it('should contain the message', () => {
      expect(messageEl().textContent).toEqual('Lustre: 2178:0:(client.c:2048:ptlrpc_expire_one_request()) @@@ Request '
        + 'sent has timed out for slow reply: [sent 1466559632/real 1466559632] req@ffff88007923acc0 '
        + 'x1532239365854720/t0(0) o251->MGClotus-35vm15.lotus.hpdd.lab.intel.com@0@lo:'
        + '26/25 lens 224/224 e 0 to 1 dl 0000 ref 2 fl Rpc:XN/0/ffffffff rc 0/-1');
    });

    it('should not contain any links', () => {
      expect(messageEl().querySelectorAll('a').length).toEqual(0);
    });
  });
});
