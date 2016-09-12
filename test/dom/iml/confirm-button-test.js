import {
  mock,
  resetAll
} from '../../system-mock.js';

describe('confirm button', () => {
  let mod, spy1, spy2, defaultButton, verifyButton, global;
  beforeEachAsync(async function () {
    spy1 = jasmine.createSpy('spy1');
    spy2 = jasmine.createSpy('spy2');
    global = document;
    spyOn(global, 'addEventListener').and.callThrough();
    spyOn(global, 'removeEventListener').and.callThrough();

    mod = await mock('source/iml/confirm-button.js', {
      'source/iml/global.js': { default: global }
    });
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
    <confirm-button default-click="spy1()" confirm-click="spy2()">
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

    it('should not call defaultClick', () => {
      expect(spy1).not.toHaveBeenCalled();
    });

    it('should not call confirmClick', () => {
      expect(spy2).not.toHaveBeenCalled();
    });

    it('should not have added an event listener', () => {
      expect(global.addEventListener).not.toHaveBeenCalled();
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

    it('should call defaultClick', () => {
      expect(spy1).toHaveBeenCalledOnce();
    });

    it('should not call confirmClick', () => {
      expect(spy2).not.toHaveBeenCalled();
    });

    it('should call addEventListener', () => {
      expect(global.addEventListener)
        .toHaveBeenCalledOnceWith('click', jasmine.any(Function), true);
    });

    describe('cancel confirm', () => {
      beforeEach(() => {
        document.body.click();
        $scope.$digest();
      });

      it('should call removeEventListener', () => {
        expect(global.removeEventListener)
          .toHaveBeenCalledOnceWith('click', jasmine.any(Function), true);
      });

      it('should display the default button', () => {
        expect(defaultButton()).not.toBe(null);
      });

      it('should not display the verify button', () => {
        expect(verifyButton()).toBe(null);
      });
    });

    describe('confirmed state', () => {
      beforeEach(() => {
        verifyButton().click();
        $scope.$digest();
      });

      it('should not display the default button', () => {
        expect(defaultButton()).toBe(null);
      });

      it('should not call defaultClick a second time', () => {
        expect(spy1).toHaveBeenCalledOnce();
      });

      it('should call confirmClick', () => {
        expect(spy2).toHaveBeenCalledOnce();
      });

      it('should remove the event listener', () => {
        expect(global.removeEventListener)
          .toHaveBeenCalledOnceWith('click', jasmine.any(Function), true);
      });
    });
  });

  describe('destroy', () => {
    it('should remove the event listener', () => {
      $scope.$destroy();
      expect(global.removeEventListener)
        .toHaveBeenCalledOnceWith('click', jasmine.any(Function), true);
    });
  });
});
