import messageSubstitutionModule from
  '../../../../source/iml/message-substitution/message-substitution-module.js';

describe('message substitution directive', () => {
  var el, $scope, $compile, messageEl, template, CACHE_INITIAL_DATA;

  describe('with authorization', () => {

    beforeEach(module(messageSubstitutionModule, $provide => {
      CACHE_INITIAL_DATA = {
        session: {
          read_enabled: true,
          user: {
            groups: [{name: 'filesystem_administrators'}]
          }
        }
      };

      $provide.constant('CACHE_INITIAL_DATA', CACHE_INITIAL_DATA);
    }));

    beforeEach(inject(function (_$compile_, $rootScope) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      template = '<message-substitution substitutions="substitutions" message="message"></message-substitution>';

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

    beforeEach(() => {
      el = $compile(template)($scope)[0];
      document.body.appendChild(el);
      messageEl = el.querySelector.bind(el, 'div');
      $scope.$digest();
    });

    afterEach(() => document.body.removeChild(el));

    it('should contain the message', () => {
      expect(messageEl().textContent).toEqual('Lustre: 2178:0:(client.c:2048:ptlrpc_expire_one_request()) @@@ Request '
        + 'sent has timed out for slow reply: [sent 1466559632/real 1466559632] req@ffff88007923acc0 '
        + 'x1532239365854720/t0(0) o251->MGC<a href="/api/host/1/">lotus-35vm15.lotus.hpdd.lab.intel.com</a>@0@lo:'
        + '26/25 lens 224/224 e 0 to 1 dl <a href="/api/host/2/">0000</a> ref 2 fl Rpc:XN/0/ffffffff rc 0/-1');
    });

    it('should display the message', () => {
      expect(messageEl().className.indexOf('invisible')).toBe(-1);
    });
  });

  describe('without authorization', () => {
    beforeEach(module(messageSubstitutionModule, $provide => {
      CACHE_INITIAL_DATA = {
        session: {
          read_enabled: true,
          user: {
            groups: [{name: 'filesystem_users'}]
          }
        }
      };

      $provide.constant('CACHE_INITIAL_DATA', CACHE_INITIAL_DATA);
    }));

    beforeEach(inject(function (_$compile_, $rootScope) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      template = '<message-substitution substitutions="substitutions" message="message"></message-substitution>';

      $scope.message = 'Lustre: 2178:0:(client.c:2048:ptlrpc_expire_one_request()) @@@ Request sent has timed out for'
        + ' slow reply: [sent 1466559632/real 1466559632] req@ffff88007923acc0 x1532239365854720/t0(0) o251->MGC10.14.'
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

    beforeEach(() => {
      el = $compile(template)($scope)[0];
      document.body.appendChild(el);
      messageEl = el.querySelector.bind(el, 'div');
      $scope.$digest();
    });

    afterEach(() => document.body.removeChild(el));

    it('should contain the message', () => {
      expect(messageEl().textContent).toEqual('Lustre: 2178:0:(client.c:2048:ptlrpc_expire_one_request()) @@@ Request '
        + 'sent has timed out for slow reply: [sent 1466559632/real 1466559632] req@ffff88007923acc0 '
        + 'x1532239365854720/t0(0) o251->MGC<a href="/api/host/1/">lotus-35vm15.lotus.hpdd.lab.intel.com</a>@0@lo:'
        + '26/25 lens 224/224 e 0 to 1 dl <a href="/api/host/2/">0000</a> ref 2 fl Rpc:XN/0/ffffffff rc 0/-1');
    });

    it('should not display the message', () => {
      expect(messageEl().className.indexOf('invisible') > -1).toEqual(true);
    });
  });
});
