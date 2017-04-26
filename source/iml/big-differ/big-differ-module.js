import angular from 'angular';
import diffContainer from './diff-container';
import diffComponent from './diff-component';
import diffModel from './diff-model';
import resetDiff from './reset-diff';
import 'angular-ui-bootstrap';

export default angular
  .module('bigDifferModule', ['ui.bootstrap'])
  .component('differ', diffComponent)
  .component('resetDiff', resetDiff)
  .directive('diffModel', diffModel)
  .directive('diffContainer', diffContainer).name;
