describe('PDSH directive', function () {
  'use strict';

  var $scope, $timeout, element, query, queryAll, inputField, groupAddOn, help, node, inputEvent, clickEvent;

  beforeEach(window.module('pdsh-module', 'templates', 'ui.bootstrap', function initialize ($provide) {
    help = {
      get: jasmine.createSpy('get').andReturn('Enter hostname / hostlist expression.')
    };

    inputEvent = new Event('input');
    clickEvent = new MouseEvent('click');

    $provide.value('help', help);
  }));

  describe('General operation', function () {

    beforeEach(inject(function ($templateCache, $rootScope, $compile, _$timeout_) {
      $timeout = _$timeout_;

      // Create an instance of the element
      element = angular.element($templateCache.get('pdsh.html')).get(0);
      query = element.querySelector.bind(element);
      queryAll = element.querySelectorAll.bind(element);

      $scope = $rootScope.$new();
      $scope.pdshChange = jasmine.createSpy('pdshChange');

      node = $compile(element)($scope);

      // Update the html
      $scope.$digest();

      inputField = query('.form-control');
      groupAddOn = query('.input-group-addon');
    }));

    describe('successful entry', function () {
      var hostnames;

      beforeEach(function () {
        inputField.value = 'hostname[1-3]';
        inputField.dispatchEvent(inputEvent);
        $timeout.flush();
      });

      it('should not show the error tooltip', function () {
        expect(query('.error-tooltip li')).toBeNull();
      });

      it('should call pdshChange', function () {
        expect($scope.pdshChange).toHaveBeenCalled();
      });

      describe('expression popover', function () {
        var popover;
        beforeEach(function () {
          groupAddOn.dispatchEvent(clickEvent);
          $scope.$digest();

          popover = query('.popover li');
          hostnames = queryAll('.popover li span');
        });

        it('should display the popover', function () {
          expect(popover).toBeShown();
        });

        it('should contain one item', function () {
          expect(hostnames.length).toEqual(1);
        });

        it('should contain the hostnames in the popover', function () {
          expect(hostnames.item(0).innerHTML).toEqual('hostname1..3');
        });

        describe('with additional modification', function () {
          beforeEach(function () {
            inputField.value = 'hostname[5-7]';
            inputField.dispatchEvent(inputEvent);
            $timeout.flush();
            $scope.$digest();
            hostnames = queryAll('.popover li span');
          });

          it('should contain one item', function () {
            expect(hostnames.length).toEqual(1);
          });

          it('should contain the updated hostnames in the popover', function () {
            expect(hostnames.item(0).innerHTML).toEqual('hostname5..7');
          });
        });
      });
    });

    describe('unsuccessful entry', function () {

      beforeEach(function () {
        inputField.value = 'hostname[1-]';
        inputField.dispatchEvent(inputEvent);
        groupAddOn.click();
        $timeout.flush();
      });

      describe('group add on', function () {
        it('should not display the popover', function () {
          expect(query('.popover')).toBeHidden();
        });

        it('should show the error tooltip', function () {
          var tooltip = query('.error-tooltip li');
          expect(tooltip.length).not.toBeNull();
        });
      });
    });

    describe('empty entry', function () {
      beforeEach(function () {
        inputField.value = '';
        inputField.dispatchEvent(inputEvent);
        groupAddOn.click();
        $timeout.flush();
      });

      it('should not display the popover', function () {
        expect(query('.popover')).toBeHidden();
      });

      it('should show the error tooltip', function () {
        var tooltip = query('.error-tooltip li');
        expect(tooltip).toBeNull();
      });

      it('should have a placeholder', function () {
        expect(inputField.getAttribute('placeholder')).toEqual('placeholder text');
      });
    });

    describe('initial entry', function () {
      it('should have an initial value of \'invalid[\'', function () {
        expect(node.find('input').val()).toEqual('invalid[');
      });

      it('should display the error tooltip', function () {
        expect(node.find('.error-tooltip')).toBeShown();
      });
    });
  });

  describe('pdsh initial change', function () {

    var initialValue;

    beforeEach(window.module('pdsh-module', 'templates'));

    beforeEach(inject(function ($rootScope, $compile, _$timeout_) {
      $timeout = _$timeout_;
      initialValue = 'storage0.localdomain';

      // Create an instance of the element
      element = angular.element('<form name="pdshForm"><pdsh pdsh-initial="\'' + initialValue + '\'" ' +
        'pdsh-change="pdshChange(pdsh, hostnames)"></pdsh></form>').get(0);
      query = element.querySelector.bind(element);

      $scope = $rootScope.$new();
      $scope.pdshChange = jasmine.createSpy('pdshChange');

      node = $compile(element)($scope);

      // Update the html
      $scope.$digest();

      inputField = query('.form-control');
    }));

    it('should call help.get', function () {
      expect(help.get).toHaveBeenCalledOnceWith('pdsh_placeholder');
    });

    it('should have a placeholder', function () {
      expect(inputField.getAttribute('placeholder')).toEqual('Enter hostname / hostlist expression.');
    });

    it('should trigger a change for the initial value', function () {
      expect($scope.pdshChange).toHaveBeenCalledWith(initialValue, [initialValue]);
    });

    describe('modify existing value', function () {
      beforeEach(function () {
        inputField.value = 'storage[1-10].localdomain';
        inputField.dispatchEvent(inputEvent);
        $timeout.flush();
      });

      it('should call pdshChange with storage[1-10].localdomain', function () {
        expect($scope.pdshChange.calls[$scope.pdshChange.calls.length - 1].args[0])
          .toEqual('storage[1-10].localdomain');
      });
    });
  });
});
