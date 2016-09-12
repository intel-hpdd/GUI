import {
  mock,
  resetAll
} from '../../system-mock.js';

describe('confirm button', () => {
  let mod, spy1, spy2, defaultButton, verifyButton;
  beforeEachAsync(async function () {
    spy1 = jasmine.createSpy('spy1');
    spy2 = jasmine.createSpy('spy2');
    mod = await mock('source/iml/confirm-button.js', {});
  });

  afterEach(resetAll);

  beforeEach(module($compileProvider => {
    $compileProvider.component('confirmButton', mod.default);
  }));

  let $scope, el;

  beforeEach(inject(($compile, $rootScope) => {
    $scope = $rootScope.$new();
    $scope.spy1 = spy1;
    $scope.spy2 = spy2;

    const template = `
    <confirm-button on-confirm="spy1()" on-confirmed="spy2()">
      <default-button>
        <button>Delete</button>
      </default-button>
      <verify-button>
        <button>Confirm Delete</button>
      </verify-button>
    </confirm-button>
    `;

    el = $compile(template)($scope)[0];
    $scope.$digest();

    defaultButton = el.querySelector.bind(el, 'default-button');
    verifyButton = el.querySelector.bind(el, 'verify-button');
  }));

  describe('default state', () => {
    it('should display the default button', () => {
      expect(defaultButton()).not.toBe(null);
    });

    it('should not display the verify button', () => {
      expect(verifyButton()).toBe(null);
    });

    it('should not call onConfirm', () => {
      expect(spy1).not.toHaveBeenCalled();
    });

    it('should not call onConfirmed', () => {
      expect(spy2).not.toHaveBeenCalled();
    });
  });

  describe('confirm state', () => {
    beforeEach(() => {
      defaultButton().click();
      $scope.$digest();
    });

    it('should not display the default button', () => {
      expect(defaultButton()).toBe(null);
    });

    it('should display the verify button', () => {
      expect(verifyButton()).not.toBe(null);
    });

    it('should call onConfirm', () => {
      expect(spy1).toHaveBeenCalledOnce();
    });

    it('should not call onConfirmed', () => {
      expect(spy2).not.toHaveBeenCalled();
    });

    describe('confirmed state', () => {
      beforeEach(() => {
        verifyButton().click();
        $scope.$digest();
      });

      it('should not display the default button', () => {
        expect(defaultButton()).toBe(null);
      });

      it('should not display the verify button', () => {
        expect(verifyButton()).toBe(null);
      });

      it('should not call onConfirm a second time', () => {
        expect(spy1).toHaveBeenCalledOnce();
      });

      it('should call onConfirmed', () => {
        expect(spy2).toHaveBeenCalledOnce();
      });
    });
  });
});
