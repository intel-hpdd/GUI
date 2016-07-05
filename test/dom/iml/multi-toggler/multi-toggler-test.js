import multiTogglerModule from '../../../../source/iml/multi-toggler/multi-toggler-module.js';


describe('multi toggler', () => {
  beforeEach(module(multiTogglerModule, 'ui.bootstrap'));

  let $scope, el;

  beforeEach(inject(($rootScope, $compile) => {
    $scope = $rootScope.$new();

    Object.assign($scope, {
      selected1: true,
      selected2: false
    });

    const template = `
      <multi-toggler-container>
        <button
          class="btn"
          ng-model="selected1"
          uib-btn-checkbox
          multi-toggler-model
        >Foo</button>
        <button
          class="btn"
          ng-model="selected2"
          uib-btn-checkbox
          multi-toggler-model
        >Bar</button>
        <multi-toggler
          on-save="onSave()"
          on-cancel="onCancel()"
        ></multi-toggler>
      </multi-toggler-container>
    `;

    el = $compile(template)($scope)[0];
    $scope.$digest();
  }));

  it('should select the state on all', () => {
    el.querySelector('multi-toggler .btn-group a').click();

    expect(
      el
        .querySelectorAll('multi-toggler-container > button.active')
        .length
    ).toBe(2);
  });

  it('should invert the state on all', () => {
    el.querySelectorAll('multi-toggler .btn-group a')[2].click();

    expect(
      el
        .querySelectorAll('multi-toggler-container > button.active')
        .length
    ).toBe(1);
  });

  it('should de-select the state on all', () => {
    el.querySelectorAll('multi-toggler .btn-group a')[1].click();

    expect(
      el
        .querySelectorAll('multi-toggler-container > button.active')
        .length
    ).toBe(0);
  });
});
