import * as fp from '@iml/fp';
import angular from '../../../../angular-mock-setup.js';
import angularUiBootstrap from 'angular-ui-bootstrap';
import commonStatusSearchesComponent from '../../../../../source/iml/status/common-status-searches/common-status-searches-component.js';

describe('common status searches', () => {
  let el, $scope, $animate, qs, cleanText, panelTitle, panelCollapse, searches;

  beforeEach(() => {
    if (!window.angular) require('angular');
  });

  beforeEach(
    angular.mock.module(
      angularUiBootstrap,
      'ngAnimateMock',
      $compileProvider => {
        $compileProvider.component(
          'commonStatusSearches',
          commonStatusSearchesComponent
        );
      }
    )
  );

  beforeEach(
    angular.mock.inject(($rootScope, $compile, _$animate_) => {
      const template = '<common-status-searches></common-status-searches>';

      $animate = _$animate_;
      $scope = $rootScope.$new();

      cleanText = fp.flow(fp.view(fp.lensProp('textContent')), x => x.trim());

      el = $compile(template)($scope)[0];
      qs = el.querySelector.bind(el);
      panelTitle = qs.bind(el, '.panel-title');
      panelCollapse = qs.bind(el, '.panel-collapse');
      searches = el.querySelectorAll.bind(el, 'ul li a');
      $scope.$digest();
      $animate.flush();
    })
  );

  it('should display the title', () => {
    expect(cleanText(panelTitle())).toBe('Common Searches');
  });

  it('should start collapsed', () => {
    expect(panelCollapse().classList.contains('in')).not.toBe(true);
  });

  describe('searches', () => {
    it('should have a search active alerts', () => {
      expect(cleanText(searches()[0])).toBe('Search active alerts');
    });

    it('should link to active alerts query', () => {
      expect(searches()[0].getAttribute('href')).toBe(
        '/ui/status/?severity__in=WARNING,ERROR&active=true'
      );
    });

    it('should have a search alerts', () => {
      expect(cleanText(searches()[1])).toBe('Search alerts');
    });

    it('should link to alerts query', () => {
      expect(searches()[1].getAttribute('href')).toBe(
        '/ui/status/?record_type__endswith=Alert'
      );
    });

    it('should have search commands', () => {
      expect(cleanText(searches()[2])).toBe('Search commands');
    });

    it('should link to commands query', () => {
      expect(searches()[2].getAttribute('href')).toBe(
        '/ui/status/?record_type__contains=Command'
      );
    });

    it('should have search events', () => {
      expect(cleanText(searches()[3])).toBe('Search events');
    });

    it('should link to events query', () => {
      expect(searches()[3].getAttribute('href')).toBe(
        '/ui/status/?record_type__contains=Event'
      );
    });
  });
});
