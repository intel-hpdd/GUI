import angular from '../../../angular-mock-setup.js';
import pdsh from '../../../../source/iml/pdsh/pdsh.js';
import Position from '../../../../source/iml/position.js';
import imlPopover from '../../../../source/iml/iml-popover.js';
import { imlTooltip } from '../../../../source/iml/tooltip/tooltip.js';

describe('PDSH directive', () => {
  let $scope,
    $timeout,
    element,
    query,
    queryAll,
    inputField,
    groupAddOn,
    help,
    node,
    inputEvent,
    clickEvent;

  beforeEach(
    angular.mock.module(($provide, $compileProvider) => {
      help = {
        get: jest.fn(() => 'Enter hostname / hostlist expression.')
      };

      inputEvent = new Event('input');
      clickEvent = new MouseEvent('click');

      $provide.value('help', help);
      $compileProvider.directive('imlPopover', imlPopover);
      $compileProvider.directive('imlTooltip', imlTooltip);
      $provide.service('position', Position);

      $compileProvider.directive('pdsh', pdsh);
    })
  );

  describe('General operation', () => {
    beforeEach(
      inject(($rootScope, $compile, _$timeout_) => {
        $timeout = _$timeout_;

        const template = `<form name="pdshForm">
        <pdsh pdsh-initial="'invalid['" pdsh-change="pdshChange(pdsh, hostnames, hostnamesHash)"
        pdsh-placeholder="placeholder text"></pdsh>
      </form>`;

        $scope = $rootScope.$new();
        $scope.pdshChange = jasmine.createSpy('pdshChange');

        node = $compile(template)($scope);
        element = node[0];
        query = element.querySelector.bind(element);
        queryAll = element.querySelectorAll.bind(element);

        // Update the html
        $scope.$digest();

        inputField = query('.form-control');
        groupAddOn = query('.input-group-addon');
      })
    );

    describe('successful entry', () => {
      let hostnames;

      beforeEach(() => {
        inputField.value = 'hostname[1-3]';
        inputField.dispatchEvent(inputEvent);
        $timeout.flush();
      });

      it('should not show the error tooltip', () => {
        expect(query('.error-tooltip li')).toBeNull();
      });

      it('should call pdshChange', () => {
        expect($scope.pdshChange).toHaveBeenCalled();
      });

      describe('expression popover', () => {
        let popover;
        beforeEach(() => {
          groupAddOn.dispatchEvent(clickEvent);
          $scope.$digest();

          popover = query('.popover li');
          hostnames = queryAll('.popover li span');
        });

        it('should display the popover', () => {
          expect(popover).toBeShown();
        });

        it('should contain one item', () => {
          expect(hostnames.length).toEqual(1);
        });

        it('should contain the hostnames in the popover', () => {
          expect(hostnames.item(0).innerHTML).toEqual('hostname1..3');
        });

        describe('with additional modification', () => {
          beforeEach(() => {
            inputField.value = 'hostname[5-7]';
            inputField.dispatchEvent(inputEvent);
            $timeout.flush();
            $scope.$digest();
            hostnames = queryAll('.popover li span');
          });

          it('should contain one item', () => {
            expect(hostnames.length).toEqual(1);
          });

          it('should contain the updated hostnames in the popover', () => {
            expect(hostnames.item(0).innerHTML).toEqual('hostname5..7');
          });
        });
      });
    });

    describe('unsuccessful entry', () => {
      beforeEach(() => {
        inputField.value = 'hostname[1-]';
        inputField.dispatchEvent(inputEvent);
        groupAddOn.click();
        $timeout.flush();
      });

      describe('group add on', () => {
        it('should not display the popover', () => {
          expect(query('.popover')).toBeNull();
        });

        it('should show the error tooltip', () => {
          const tooltip = query('.error-tooltip li');
          expect(tooltip).not.toBeNull();
        });
      });
    });

    describe('empty entry', () => {
      beforeEach(() => {
        inputField.value = '';
        inputField.dispatchEvent(inputEvent);
        groupAddOn.click();
        $timeout.flush();
      });

      it('should not display the popover', () => {
        expect(query('.popover')).toBeNull();
      });

      it('should show the error tooltip', () => {
        const tooltip = query('.error-tooltip li');
        expect(tooltip).toBeNull();
      });

      it('should have a placeholder', () => {
        expect(inputField.getAttribute('placeholder')).toEqual(
          'placeholder text'
        );
      });
    });

    describe('initial entry', () => {
      it("should have an initial value of 'invalid['", () => {
        expect(element.querySelector('input').value).toBe('invalid[');
      });

      it('should display the error tooltip', () => {
        expect(element.querySelector('.error-tooltip')).toBeShown();
      });
    });
  });

  describe('pdsh initial change', () => {
    let initialValue;

    beforeEach(
      inject(($rootScope, $compile, _$timeout_) => {
        $timeout = _$timeout_;
        initialValue = 'storage0.localdomain';

        const template = `<form name="pdshForm">
        <pdsh pdsh-initial="'${initialValue}'" pdsh-change="pdshChange(pdsh, hostnames)"></pdsh>
      </form>`;

        $scope = $rootScope.$new();
        $scope.pdshChange = jest.fn();

        node = $compile(template)($scope);
        element = node[0];
        query = element.querySelector.bind(element);

        // Update the html
        $scope.$digest();

        inputField = query('.form-control');
      })
    );

    it('should call help.get', () => {
      expect(help.get).toHaveBeenCalledOnceWith('pdsh_placeholder');
    });

    it('should have a placeholder', () => {
      expect(inputField.getAttribute('placeholder')).toEqual(
        'Enter hostname / hostlist expression.'
      );
    });

    it('should trigger a change for the initial value', () => {
      expect($scope.pdshChange).toHaveBeenCalledWith(initialValue, [
        initialValue
      ]);
    });

    describe('modify existing value', () => {
      beforeEach(() => {
        inputField.value = 'storage[1-10].localdomain';
        inputField.dispatchEvent(inputEvent);
        $timeout.flush();
      });

      it('should call pdshChange with storage[1-10].localdomain', () => {
        expect($scope.pdshChange.mock.calls[2][0]).toEqual(
          'storage[1-10].localdomain'
        );
      });
    });
  });
});
