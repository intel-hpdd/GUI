import global from './global';

const Controller = function Controller ($scope) {
  'ngInject';

  let ctrl = this;
  const resetDefault = () => {
    ctrl.default = true;
    global.removeEventListener('click', resetDefault, true);
  };

  Object.assign(ctrl, {
    default: true,
    onDefaultClicked () {
      ctrl.default = false;
      ctrl.defaultClick();
      global.addEventListener('click', resetDefault, true);
    },
    onConfirmClicked () {
      ctrl.confirmClick();
      global.removeEventListener('click', resetDefault, true);
    }
  });

  $scope.$on('$destroy', resetDefault);
};


export default {
  controller: Controller,
  bindings: {
    defaultClick: '&',
    confirmClick: '&'
  },
  transclude: {
    default: 'defaultButton',
    verify: 'verifyButton'
  },
  template: `
  <div ng-transclude="default" ng-if="$ctrl.default" ng-click="$ctrl.onDefaultClicked()"></div>
  <div ng-transclude="verify" ng-if="!$ctrl.default" ng-click="$ctrl.onConfirmClicked()"></div>
  `
};
