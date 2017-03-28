import completionistModule
  from '../../../../source/iml/completionist/completionist-module.js';

describe('completionist', () => {
  let $scope, el, qs, qsa, input, keydownEvent;

  beforeEach(module(completionistModule));

  beforeEach(
    inject(($rootScope, $compile) => {
      keydownEvent = key => {
        const event = new Event('keydown');
        event.keyCode = key;

        return event;
      };

      const template = `
      <div>
        <completionist completer="completer({ value: value, cursorPosition: cursorPosition })">
          <input completionist-model-hook ng-model="query" />
          <completionist-dropdown></completionist-dropdown>
        </completionist>
      </div>
    `;

      $scope = $rootScope.$new();
      $scope.query = '';
      $scope.completer = () => [
        {
          suggestion: 'foo'
        },
        {
          suggestion: 'bar'
        }
      ];

      el = $compile(template)($scope)[0];
      document.body.appendChild(el);
      qs = el.querySelector.bind(el);
      qsa = el.querySelectorAll.bind(el);
      input = qs('input');
      $scope.$digest();
    })
  );

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should have no items when unfocused', () => {
    expect(qs('completionist-dropdown li')).toBeNull();
  });

  describe('active', () => {
    beforeEach(() => {
      input.dispatchEvent(new Event('focus'));
    });

    it('should render choices', () => {
      const texts = Array.from(qsa('li')).map(x => x.textContent.trim());

      expect(texts).toEqual(['foo', 'bar']);
    });

    it('should not activate any choices', () => {
      expect(qs('li.active')).toBeNull();
    });

    it('should activate a choice on mouseover', () => {
      const event = new MouseEvent('mouseover', {
        clientX: 50,
        clientY: 50,
        bubbles: true
      });

      const li = qs('li');
      li.dispatchEvent(event);
      $scope.$digest();
      expect(li).toHaveClass('active');
    });

    it('should activate a choice on down arrow', () => {
      input.dispatchEvent(keydownEvent(40));
      $scope.$digest();
      expect(qs('li')).toHaveClass('active');
    });

    it('should populate the model on click', () => {
      input.dispatchEvent(keydownEvent(40));

      $scope.$digest();

      qs('li').dispatchEvent(new MouseEvent('click'));
      $scope.$digest();

      expect($scope.query).toBe('foo');
    });

    it('should populate the model on enter', () => {
      input.dispatchEvent(keydownEvent(38));
      $scope.$digest();

      input.dispatchEvent(keydownEvent(13));
      $scope.$digest();

      expect($scope.query).toBe('bar');
    });
  });
});
