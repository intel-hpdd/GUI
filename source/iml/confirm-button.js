const Controller = function Controller () {
  'ngInject';

  let ctrl = this;
  const callbacks = {
    confirm: ctrl.onConfirm || (() => {}),
    confirmed: ctrl.onConfirmed
  };

  Object.assign(ctrl, {
    state: 'default',
    click (state) {
      ctrl.state = state;
      callbacks[state]();
    }
  });
};


export default {
  controller: Controller,
  bindings: {
    onConfirm: '&',
    onConfirmed: '&'
  },
  transclude: {
    default: 'defaultButton',
    verify: 'verifyButton'
  },
  template: `
  <div ng-transclude="default" ng-if="$ctrl.state === 'default'" ng-click="$ctrl.click('confirm')"></div>
  <div ng-transclude="verify" ng-if="$ctrl.state === 'confirm'" ng-click="$ctrl.click('confirmed')"></div>
  `
};
