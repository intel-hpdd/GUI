import parselyBoxModule
  from '../../../../source/iml/parsely-box/parsely-box-module';

describe('parsely box', () => {
  beforeEach(module(parselyBoxModule));

  let el,
    $scope,
    qs,
    searchButton,
    indicator,
    tooltip,
    form,
    input,
    completionistDropdown;

  beforeEach(
    inject(($rootScope, $compile) => {
      const template = `
<parsely-box
  on-submit="::onSubmit(qs)"
  query="::initialQuery"
  parser-formatter="::parserFormatter"
  completer="::completer(value)"
>
</parsely-box>`;

      $scope = $rootScope.$new();
      Object.assign($scope, {
        parserFormatter: {
          parser(str) {
            if (str === '') return '';

            if (str === '1') return 1;

            return new Error('str was not string 1');
          },
          formatter(num) {
            if (num == null || num === '') return '';

            if (num === 1) return '1';

            throw new Error('num was not number 1');
          }
        },
        completer(str) {
          if (str === '') return '';

          if (str === '1')
            return [
              {
                start: 0,
                end: 0,
                suggestion: '+'
              }
            ];
        },
        onSubmit: jasmine.createSpy('onSubmit'),
        initialQuery: ''
      });

      el = $compile(template)($scope)[0];
      qs = el.querySelector.bind(el);
      searchButton = qs.bind(el, '.btn-primary');
      indicator = qs.bind(el, '.status-indicator i');
      tooltip = qs.bind(el, '.tooltip');
      form = qs.bind(el, 'form');
      input = qs.bind(el, 'input');
      completionistDropdown = qs.bind(el, 'completionist-dropdown');
      $scope.$digest();
    })
  );

  describe('when valid', () => {
    beforeEach(() => {
      input().value = '1';
      input().dispatchEvent(new Event('input'));
    });

    it('should enable the search box', () => {
      expect(searchButton().disabled).toBe(false);
    });

    it('should show the green check icon', () => {
      expect(indicator().classList.contains('fa-check-circle')).toBe(true);
    });

    it('should not show the error tooltip', () => {
      expect(tooltip().classList.contains('in')).toBe(false);
    });

    it('should show the autocomplete suggestion', () => {
      expect(completionistDropdown().querySelector('li')).toHaveText('+');
    });

    it('should call onSubmit when searching', () => {
      const event = new MouseEvent('click', {
        bubbles: true
      });
      searchButton().dispatchEvent(event);

      expect($scope.onSubmit).toHaveBeenCalledOnceWith(1);
    });

    it('should call onSubmit form submission', () => {
      const event = new Event('submit', {
        bubbles: true
      });

      form().dispatchEvent(event);

      expect($scope.onSubmit).toHaveBeenCalledOnceWith(1);
    });
  });

  describe('when invalid', () => {
    beforeEach(() => {
      input().value = '2';
      input().dispatchEvent(new Event('input'));
    });

    it('should disable the search box', () => {
      expect(searchButton().disabled).toBe(true);
    });

    it('should show the red x icon', () => {
      expect(indicator().classList.contains('fa-times-circle')).toBe(true);
    });

    it('should show the error tooltip', () => {
      expect(tooltip().classList.contains('in')).toBe(true);
    });

    it('should show the parse error', () => {
      const value = tooltip()
        .querySelector('.tooltip-inner span')
        .innerHTML.trim();

      expect(value).toEqual('str was not string 1');
    });
  });
});
