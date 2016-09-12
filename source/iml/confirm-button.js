import global from './global';

const Controller = function Controller ($element, $scope) {
  'ngInject';

  let ctrl = this;
  let removeResetListener, removeComponentListener, removeListeners;
  const resetDefault = () => {
    ctrl.default = true;
    $scope.$digest();
    removeListeners();
  };
  removeResetListener = () => global
    .removeEventListener('mouseup', resetDefault);

  const componentmouseup = (e) => e.stopPropagation();
  removeComponentListener = () => $element[0]
    .removeEventListener('mouseup', componentmouseup, true);

  removeListeners = () => {
    removeResetListener();
    removeComponentListener();
  };

  Object.assign(ctrl, {
    default: true,
    onDefault () {
      ctrl.default = false;
      $element[0].addEventListener('mouseup', componentmouseup, true);
      global.addEventListener('mouseup', resetDefault);
    },
    onConfirm () {
      ctrl.confirmClick();
      removeListeners();
    },
    $onDestroy: removeListeners
  });
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
