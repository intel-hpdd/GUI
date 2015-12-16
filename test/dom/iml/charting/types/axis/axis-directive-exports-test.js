describe('axis directive', () => {
  beforeEach(module('axis', 'chart', 'templates'));

  var $scope, el, qs, axis;

  beforeEach(inject(($rootScope, $compile) => {
    const template = `
      <div charter stream="stream" on-update="onUpdate">
        <g axis scale="scale" orient="'bottom'"></g>
      </div>
    `;

    $scope = $rootScope.$new();
    $scope.stream = highland([1, 2, 3, 4]);
    $scope.onUpdate = [];
    $scope.scale = d3.scale.linear()
      .domain([0, 4])
      .range([0, 200]);

    el = $compile(template)($scope)[0];
    qs = fp.flow(
      fp.arrayWrap,
      fp.invokeMethod('querySelector', fp.__, el)
    );
    axis = qs.bind(null, '.axis');

    d3.select(el)
      .style({
        display: 'inline-block',
        width: '200px',
        height: '200px'
      });

    document.body.appendChild(el);
    $scope.$digest();
  }));

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('should append an axis group', () => {
    expect(axis()).not.toBeNull();
  });

  it('should set transform on axis', () => {
    expect(axis().getAttribute('transform'))
      .toBe('translate(0,120)');
  });

  it('should have a lower tick', function () {
    expect(qs('.tick text').textContent).toEqual('0.0');
  });

  it('should have an upper tick', function () {
    expect(fp.tail([].slice.call(el.querySelectorAll('.tick text'))).textContent)
      .toEqual('4.0');
  });

  it('should update on new data', function () {
    $scope.scale.domain([0, 3]);
    $scope.stream.write([0, 1, 2, 3]);

    flushD3Transitions();

    expect(fp.tail([].slice.call(el.querySelectorAll('.tick text'))).textContent)
      .toEqual('3.0');
  });
});
