describe('label directive', () => {
  beforeEach(window.module('label', 'chart', 'templates'));

  var $scope, el, qs, label, spy;

  beforeEach(inject(($rootScope, $compile) => {
    const template = `
      <div charter stream="stream">
        <g label on-data="onData" on-update="onUpdate"></g>
      </div>
    `;

    spy = jasmine.createSpy('spy');
    $scope = $rootScope.$new();
    $scope.stream = highland([[1, 2, 3, 4]]);
    $scope.onData = () => ['data'];
    $scope.onUpdate = [spy];

    el = $compile(template)($scope)[0];
    d3.select(el)
      .style({
        display: 'inline-block',
        width: '200px',
        height: '200px'
      });
    qs = fp.flow(
      fp.arrayWrap,
      fp.invokeMethod('querySelector', fp.__, el)
    );
    label = qs.bind(null, '.label-group');
    document.body.appendChild(el);
    $scope.$digest();
  }));

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should append a label group', () => {
    expect(label()).not.toBeNull();
  });

  it('should append text', () => {
    expect(qs('.label-text').textContent).toBe('data');
  });

  it('should call onUpdate', () => {
    expect(spy)
      .toHaveBeenCalledOnceWith({
        label: jasmine.any(Function),
        node: jasmine.any(Object),
        svg: jasmine.any(Object),
        width: 120,
        height: 140,
        xs: [1, 2, 3, 4]
      });
  });
});
