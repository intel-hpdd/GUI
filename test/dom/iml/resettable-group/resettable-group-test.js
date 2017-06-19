import resettableGroupModule from '../../../../source/iml/resettable-group/resettable-group-module.js';
import angular from '../../../angular-mock-setup.js';

describe('resettable group', () => {
  let $scope, qs, el, entry1, entry2, month, yourName, yourEmail, resetButton;

  beforeEach(angular.mock.module(resettableGroupModule));

  beforeEach(
    inject(($rootScope, $compile) => {
      const template = `<form name="testForm">
  <resettable-group>
    <ng-form name="subForm1">
      <label for="entry1">Entry 1</label>
      <input type="text" name="entry1" ng-model="entry1" placeholder="entry1" />
    </ng-form>
    <ng-form name="subForm2">
      <label for="entry2">Entry 2</label>
      <input type="text" name="entry2" ng-model="entry2" placeholder="entry2" />
      <select name="month" ng-model="month">
        <option value="january">January</option>
        <option value="february">February</option>
        <option value="march">March</option>
        <option value="april">April</option>
        <option value="may" selected>May</option>
        <option value="june">June</option>
        <option value="july">July</option>
        <option value="august">August</option>
        <option value="september">September</option>
        <option value="october">October</option>
        <option value="november">November</option>
        <option value="december">December</option>
      </select>
    </ng-form>
    <label for="yourName">Name</label>
    <input type="text" name="yourName" ng-model="yourName" placeholder="Name" />
    <label for="yourEmail">Email</label>
    <input type="text" name="yourEmail" ng-model="yourEmail" placeholder="Email" />
    <button type="submit">Submit</button>
    <button type="button" resetter>Reset</button>
  </resettable-group>
</form>`;

      $scope = $rootScope.$new();
      $scope.entry1 = 'entry 1';
      $scope.entry2 = 'entry 2';
      $scope.month = 'may';
      $scope.yourName = 'John Doe';
      $scope.yourEmail = 'someone@someplace.com';

      el = $compile(template)($scope)[0];

      $scope.$digest();

      qs = el.querySelector.bind(el);
      entry1 = qs('[name="entry1"]');
      entry2 = qs('[name="entry2"]');
      month = qs('[name="month"]');
      yourName = qs('[name="yourName"]');
      yourEmail = qs('[name="yourEmail"]');
      resetButton = qs('button[resetter]');
    })
  );

  describe('initial form values', () => {
    it('should have default entry 1', () => {
      expect(entry1.value).toEqual('entry 1');
    });

    it('should have default entry 2', () => {
      expect(entry2.value).toEqual('entry 2');
    });

    it('should have default month of may', () => {
      expect(month.value).toEqual('may');
    });

    it('should have default name', () => {
      expect(yourName.value).toEqual('John Doe');
    });

    it('should have default email', () => {
      expect(yourEmail.value).toEqual('someone@someplace.com');
    });
  });

  describe('verify controls', () => {
    it('should contain entry1 on subForm1', () => {
      expect($scope.subForm1.entry1).not.toBe(undefined);
    });

    it('should contain entry2 on subForm2', () => {
      expect($scope.subForm2.entry2).not.toBe(undefined);
    });

    it('should contain yourName on testForm', () => {
      expect($scope.testForm.yourName).not.toBe(undefined);
    });

    it('should contain yourEmail on testForm', () => {
      expect($scope.testForm.yourEmail).not.toBe(undefined);
    });

    describe('in subforms', () => {
      it('should not contain entry1 on testForm', () => {
        expect($scope.testForm.entry1).toBe(undefined);
      });

      it('should not contain entry2 on testForm', () => {
        expect($scope.testForm.entry2).toBe(undefined);
      });
    });
  });

  describe('setting new values on all forms and their elements', () => {
    beforeEach(() => {
      entry1.value = 'new entry 1';
      entry1.dispatchEvent(new Event('input'));
      entry2.value = 'new entry 2';
      entry2.dispatchEvent(new Event('input'));
      month.value = 'september';
      month.dispatchEvent(new Event('change'));
      yourName.value = 'Jane Doe';
      yourName.dispatchEvent(new Event('input'));
      yourEmail.value = 'newguy@newplace.com';
      yourEmail.dispatchEvent(new Event('input'));
    });

    it('should have the new entry 1 value', () => {
      expect($scope.entry1).toEqual('new entry 1');
    });

    it('should have the new entry 2 value', () => {
      expect($scope.entry2).toEqual('new entry 2');
    });

    it('should have the new month value', () => {
      expect($scope.month).toEqual('september');
    });

    it('should have the new name value', () => {
      expect($scope.yourName).toEqual('Jane Doe');
    });

    it('should have the new email value', () => {
      expect($scope.yourEmail).toEqual('newguy@newplace.com');
    });

    describe('resetting the top level form', () => {
      beforeEach(() => {
        resetButton.click();
      });

      it('should have the original entry 1 value', () => {
        expect(entry1.value).toEqual('entry 1');
      });

      it('should have the original entry 2 value', () => {
        expect(entry2.value).toEqual('entry 2');
      });

      it('should have the original month value', () => {
        expect(month.value).toEqual('may');
      });

      it('should have the original name value', () => {
        expect(yourName.value).toEqual('John Doe');
      });

      it('should have the original email value', () => {
        expect(yourEmail.value).toEqual('someone@someplace.com');
      });

      it('should put entry1 in pristine state', () => {
        expect(entry1.classList.contains('ng-pristine')).toEqual(true);
      });

      it('should put entry2 in pristine state', () => {
        expect(entry2.classList.contains('ng-pristine')).toEqual(true);
      });

      it('should put month in pristine state', () => {
        expect(month.classList.contains('ng-pristine')).toEqual(true);
      });

      it('should put yourName in pristine state', () => {
        expect(yourName.classList.contains('ng-pristine')).toEqual(true);
      });

      it('should put yourEmail in pristine state', () => {
        expect(yourEmail.classList.contains('ng-pristine')).toEqual(true);
      });

      it('should indicate entry1 is not touched', () => {
        expect(entry1.classList.contains('ng-touched')).toEqual(false);
      });

      it('should indicate entry2 is not touched', () => {
        expect(entry2.classList.contains('ng-touched')).toEqual(false);
      });

      it('should indicate month is not touched', () => {
        expect(month.classList.contains('ng-touched')).toEqual(false);
      });

      it('should indicate yourName is not touched', () => {
        expect(yourName.classList.contains('ng-touched')).toEqual(false);
      });

      it('should indicate yourEmail is not touched', () => {
        expect(yourEmail.classList.contains('ng-touched')).toEqual(false);
      });
    });
  });
});
