import global from './global';

const Controller = function Controller ($element, $scope) {
  'ngInject';

  let ctrl = this;
  let removeResetListener;
  const resetDefault = () => {
    ctrl.default = true;
    $scope.$digest();
    removeResetListener();
  };
  removeResetListener = () => global
    .removeEventListener('mouseup', resetDefault);

  const componentmouseup = (e) => e.stopPropagation();
  $element[0].addEventListener('mouseup', componentmouseup, true);
  const removeComponentListener = () => $element[0]
    .removeEventListener('mouseup', componentmouseup, true);

  Object.assign(ctrl, {
    default: true,
    onDefault () {
      ctrl.default = false;
      global.addEventListener('mouseup', resetDefault);
    },
    onConfirm () {
      ctrl.confirmClick();
      removeResetListener();
      removeComponentListener();
    }
  });

  ctrl.$onDestroy = () => {
    removeResetListener();
    removeComponentListener();
  };
};


export default {
  controller: Controller,
  bindings: {
    confirmClick: '&'
  },
  transclude: {
    default: 'defaultButton',
    verify: 'verifyButton'
  },
  template: `
  <span ng-transclude="default" ng-if="$ctrl.default" ng-click="$ctrl.onDefault()"></span>
  <span ng-transclude="verify" ng-if="!$ctrl.default" ng-click="$ctrl.onConfirm()"></span>
  `
};
