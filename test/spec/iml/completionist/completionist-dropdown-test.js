import completionistModule from '../../../../source/iml/completionist/completionist-module.js';

describe('completionist dropdown', () => {
  let completionistDropdown, completionist, localApply, $scope;

  beforeEach(module(completionistModule, $provide => {
    localApply = jasmine.createSpy('localApply');

    $provide.value('localApply', localApply);
  }));

  beforeEach(inject(($componentController, $rootScope) => {
    $scope = $rootScope.$new();
    completionist = {
      register: jasmine.createSpy('register'),
      deregister: jasmine.createSpy('deregister'),
      emit: jasmine.createSpy('emit')
    };

    completionistDropdown = $componentController(
      'completionistDropdown',
      {
        $scope
      },
      {
        completionist
      }
    );
    completionistDropdown.$onInit();
  }));

  it('should emit a value on select', () => {
    completionistDropdown.onSelect('foo');

    expect(completionist.emit)
      .toHaveBeenCalledOnceWith('VALUE', 'foo');
  });

  it('should set an active index', () => {
    completionistDropdown.setActive(5);

    expect(completionistDropdown.index).toEqual(5);
  });

  describe('on destroy', () => {
    beforeEach(() => {
      completionistDropdown.$onDestroy();
    });

    it('should deregister key presses', () => {
      expect(completionist.deregister)
        .toHaveBeenCalledOnceWith('KEY_PRESS', jasmine.any(Function));
    });

    it('should deregister values', () => {
      expect(completionist.deregister)
        .toHaveBeenCalledOnceWith('VALUES', jasmine.any(Function));
    });
  });

  describe('on key press', () => {
    let onKeyPress, data;

    beforeEach(() => {
      data = {
        event: {
          preventDefault: jasmine.createSpy('preventDefault')
        }
      };

      completionistDropdown.values = [1];

      onKeyPress = completionist
        .register
        .calls
        .first()
        .args[1];
    });

    describe('escape', () => {
      beforeEach(() => {
        data.name = 'escape';

        onKeyPress(data);
      });

      it('should empty values', () => {
        expect(completionist.emit)
          .toHaveBeenCalledOnceWith('VALUES', []);
      });

      it('should prevent default', () => {
        expect(data.event.preventDefault)
          .toHaveBeenCalledOnce();
      });
    });

    describe('up', () => {
      beforeEach(() => {
        data.name = 'up';
        onKeyPress(data);
      });

      it('should reset the index', () => {
        expect(completionistDropdown.index)
          .toBe(0);
      });

      it('should call localApply', () => {
        expect(localApply).toHaveBeenCalledOnceWith($scope);
      });

      it('should prevent default', () => {
        expect(data.event.preventDefault)
          .toHaveBeenCalledOnce();
      });
    });

    describe('down', () => {
      beforeEach(() => {
        data.name = 'down';
        onKeyPress(data);
      });

      it('should reset the index', () => {
        expect(completionistDropdown.index)
          .toBe(0);
      });

      it('should call localApply', () => {
        expect(localApply).toHaveBeenCalledOnceWith($scope);
      });

      it('should prevent default', () => {
        expect(data.event.preventDefault)
          .toHaveBeenCalledOnce();
      });
    });

    describe('enter', () => {
      beforeEach(() => {
        completionistDropdown.index = 0;
        data.name = 'enter';
        onKeyPress(data);
      });

      it('should emit the new value', () => {
        expect(completionist.emit).toHaveBeenCalledOnceWith('VALUE', 1);
      });

      it('should prevent default', () => {
        expect(data.event.preventDefault)
          .toHaveBeenCalledOnce();
      });
    });
  });

  describe('on values', () => {
    beforeEach(() => {
      completionistDropdown.index = 3;
      completionist
        .register
        .calls
        .mostRecent()
        .args[1]([1, 2, 3]);
    });

    it('should set index to -1', () => {
      expect(completionistDropdown.index).toBe(-1);
    });

    it('should set new values', () => {
      expect(completionistDropdown.values)
        .toEqual([1, 2, 3]);
    });

    it('should call localApply', () => {
      expect(localApply).toHaveBeenCalledOnceWith($scope);
    });
  });
});
