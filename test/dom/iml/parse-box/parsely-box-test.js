describe('parsely box', function () {
  beforeEach(window.module('parselyBox', 'templates'));

  var el, $scope, qs, searchButton,
    indicator, tooltip, form, input;

  beforeEach(inject(function ($rootScope, $compile) {
    var template = '<parsely-box on-submit="::onSubmit(qs)" \
query="::initialQuery" parser-formatter="::parserFormatter"></parsely-box>';

    $scope = $rootScope.$new();
    $scope.parserFormatter = {
      parser: function match1 (str) {
        if (str === '')
          return '';

        if (str === '1')
          return 1;

        return new Error('str was not string 1');
      },
      formatter: function match1 (num) {
        if (num == null || num === '')
          return '';

        if (num === 1)
          return '1';

        throw new Error('num was not number 1')
      }
    };
    $scope.onSubmit = jasmine.createSpy('onSubmit');
    $scope.initialQuery = '';

    el = $compile(template)($scope)[0];
    qs = el.querySelector.bind(el);
    searchButton = qs.bind(el, '.btn-primary');
    indicator = qs.bind(el, '.status-indicator i');
    tooltip = qs.bind(el, '.tooltip');
    form = qs.bind(el, 'form');
    input = qs.bind(el, 'input');
    $scope.$digest();
  }));

  describe('when valid', function () {
    beforeEach(function () {
      input().value = '1';
      input().dispatchEvent(new Event('input'));
    });

    it('should enable the search box', function () {
      expect(searchButton().disabled).toBe(false);
    });

    it('should show the green check icon', function () {
      expect(indicator().classList.contains('fa-check-circle')).toBe(true);
    });

    it('should not show the error tooltip', function () {
      expect(tooltip().classList.contains('in')).toBe(false);
    });

    it('should call onSubmit when searching', function () {
      var event = new MouseEvent('click', {
        bubbles: true
      });
      searchButton().dispatchEvent(event);

      expect($scope.onSubmit).toHaveBeenCalledOnceWith(1);
    });

    it('should call onSubmit form submission', function () {
      var event = new Event('submit', {
        bubbles: true
      });

      form().dispatchEvent(event);

      expect($scope.onSubmit).toHaveBeenCalledOnceWith(1);
    });
  });

  describe('when invalid', function () {
    beforeEach(function () {
      input().value = '2';
      input().dispatchEvent(new Event('input'));
    });

    it('should disable the search box', function () {
      expect(searchButton().disabled).toBe(true);
    });

    it('should show the red x icon', function () {
      expect(indicator().classList.contains('fa-times-circle')).toBe(true);
    });

    it('should not show the error tooltip', function () {
      expect(tooltip().classList.contains('in')).toBe(false);
    });

    it('should show the parse error', function () {
      var value = tooltip()
        .querySelector('.tooltip-inner span').innerHTML.trim();

      expect(value).toEqual('str was not string 1');
    });
  });
});
