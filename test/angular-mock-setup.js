import 'angular';
import 'angular-mocks';
import extendScopeModule from '../source/iml/extend-scope-module.js';

const angular = window.angular;

beforeEach(angular.mock.module(extendScopeModule));

export default angular;
