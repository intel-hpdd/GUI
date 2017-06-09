import 'angular';
import 'angular-mocks';
import extendScopeModule from '../source/iml/extend-scope-module.js';

const angular = window.angular;

beforeEach(angular.mock.module(extendScopeModule));
beforeEach(
  angular.mock.module($provide => {
    const $CoreAnimateQueueProvider = function() {
      this.$get = () => ({
        enabled: () => {},
        on: () => {},
        off: () => {},
        pin: () => {},
        push: (element, event, options, domOperation) => {
          domOperation && domOperation();

          return Promise.resolve();
        }
      });
    };

    $provide.provider('$$animateQueue', $CoreAnimateQueueProvider);
  })
);

export default angular;
