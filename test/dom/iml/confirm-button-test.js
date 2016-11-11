import {
  mock,
  resetAll
} from '../../system-mock.js';

describe('confirm button', () => {
  let mod,
    spy,
    defaultButton,
    verifyButton,
    waitingButton,
    global;

  beforeEachAsync(async function () {
    spy = jasmine.createSpy('spy');
    global = document;
    spyOn(global, 'addEventListener').and.callThrough();
    spyOn(global, 'removeEventListener').and.callThrough();

    mod = await mock('source/iml/confirm-button.js', {
      'source/iml/global.js': { default: global }
    });
  });

  afterEach(resetAll);

  beforeEach(module('extendScope', $compileProvider => {
    $compileProvider.component('confirmButton', mod.default);
  }));

  let $scope, el;

  beforeEach(inject(($compile, $rootScope) => {
    $scope = $rootScope.$new();
    $scope.spy = spy;

    const template = `
    <confirm-button confirm-click="spy()">
      <default-button>
        <button>Delete</button>
      </default-button>
      <verify-button>
        <button>Confirm Delete</button>
      </verify-button>
      <waiting-button>
        <button>Waiting</button>
      </waiting-button>
    </confirm-button>
    `;

    el = $compile(template)($scope)[0];
    spyOn(el, 'addEventListener')
      .and
      .callThrough();

    spyOn(el, 'removeEventListener')
      .and
      .callThrough();

    $scope.$digest();

    defaultButton = el.querySelector.bind(el, 'default-button');
    verifyButton = el.querySelector.bind(el, 'verify-button');
    waitingButton = el.querySelector.bind(el, 'waiting-button');
  }));

  describe('default state', () => {
    it('should display the default button', () => {
      expect(defaultButton()).not.toBe(null);
    });

    it('should not display the verify button', () => {
      expect(verifyButton()).toBe(null);
    });

    it('should not display the waiting button', () => {
      expect(waitingButton()).toBe(null);
    });

    it('should not call confirmClick', () => {
      expect(spy).not.toHaveBeenCalled();
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

    it('should not display the waiting button', () => {
      expect(waitingButton()).toBe(null);
    });

    it('should not call confirmClick', () => {
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call addEventListener', () => {
      expect(global.addEventListener)
        .toHaveBeenCalledOnceWith('click', jasmine.any(Function), false);
    });

    describe('cancel confirm', () => {
      beforeEach(() => {
        document.dispatchEvent(new MouseEvent('click'));
        $scope.$digest();
      });

      it('should call removeEventListener', () => {
        expect(global.removeEventListener)
          .toHaveBeenCalledOnceWith('click', jasmine.any(Function), false);
      });

      it('should display the default button', () => {
        expect(defaultButton()).not.toBe(null);
      });

      it('should not display the verify button', () => {
        expect(verifyButton()).toBe(null);
      });

      it('should not display the waiting button', () => {
        expect(waitingButton()).toBe(null);
      });

      it('should not call confirmClick', () => {
        expect(spy).not.toHaveBeenCalled();
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

      it('should not display the verify button', () => {
        expect(verifyButton()).toBe(null);
      });

      it('should display the waiting button', () => {
        expect(waitingButton()).not.toBe(null);
      });

      it('should call confirmClick', () => {
        expect(spy).toHaveBeenCalledOnce();
      });

      it('should remove the event listener', () => {
        expect(global.removeEventListener)
          .toHaveBeenCalledOnceWith('click', jasmine.any(Function), false);
      });
    });
  });

  describe('destroy', () => {
    it('should remove the event listener from global', () => {
      $scope.$destroy();
      expect(global.removeEventListener)
        .toHaveBeenCalledOnceWith('click', jasmine.any(Function), false);
    });
  });
});
