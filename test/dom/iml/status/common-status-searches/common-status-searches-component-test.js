import angular from 'angular';
const {module, inject} = angular.mock;
import {flow, lensProp, invokeMethod} from 'intel-fp/dist/fp';

describe('common status searches', () => {
  beforeEach(module('commonStatusSearches', 'templates',
    'ui.bootstrap.accordion', 'ui.bootstrap.tpls', 'ngAnimateMock'));

  var el, $scope, $animate, qs, cleanText,
    panelTitle, panelCollapse, searches;

  beforeEach(inject(($rootScope, $compile, _$animate_) => {
    const template = '<common-status-searches></common-status-searches>';

    $animate = _$animate_;
    $scope = $rootScope.$new();

    cleanText = flow(
      lensProp('textContent'),
      invokeMethod('trim', [])
    );

    el = $compile(template)($scope)[0];
    qs = el.querySelector.bind(el);
    panelTitle = qs.bind(el, '.panel-title');
    panelCollapse = qs.bind(el, '.panel-collapse');
    searches = el.querySelectorAll.bind(el, 'ul li a');
    $scope.$digest();
    $animate.flush();
  }));

  it('should display the title', () => {
    expect(cleanText(panelTitle())).toBe('Common Searches');
  });

  it('should start collapsed', () => {
    expect(panelCollapse().classList.contains('in'))
      .not.toBe(true);
  });

  describe('searches', () => {
    it('should have a search active alerts', () => {
      expect(cleanText(searches()[0])).toBe('Search active alerts');
    });

    it('should link to active alerts query', function () {
      expect(searches()[0].getAttribute('href'))
        .toBe('/ui/status/?severity__in=WARNING&severity__in=ERROR&active=true');
    });

    it('should have search commands', () => {
      expect(cleanText(searches()[1])).toBe('Search commands');
    });

    it('should link to commands query', function () {
      expect(searches()[1].getAttribute('href'))
        .toBe('/ui/status/?record_type__in=CommandSuccessfulAlert&\
record_type__in=CommandCancelledAlert&record_type__in=CommandErroredAlert&record_type__in=CommandRunningAlert');
    });

    it('should have search events', () => {
      expect(cleanText(searches()[2])).toBe('Search events');
    });

    it('should link to events query', function () {
      expect(searches()[2].getAttribute('href'))
        .toBe('/ui/status/?record_type=AlertEvent');
    });
  });
});
