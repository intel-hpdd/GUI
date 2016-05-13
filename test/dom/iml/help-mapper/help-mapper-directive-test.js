import helpMapperModule from '../../../../source/iml/help-mapper/help-mapper-module.js';
import highland from 'highland';

describe('help mapper', () => {
  var routeStream;

  beforeEach(module(helpMapperModule, $provide => {
    routeStream = highland();
    $provide.value('routeStream', () => routeStream);
  }));

  var el;

  beforeEach(inject(($compile, $rootScope) => {
    const $scope = $rootScope.$new();

    const template = '<li help-mapper></li>';
    el = $compile(template)($scope)[0];
    $rootScope.$digest();
  }));

  it('should append an anchor', () => {
    expect(el.querySelector('a'))
      .not.toBeNull();
  });

  it('should not end with a qs', () => {
    expect(el.querySelector('a').getAttribute('ng-href'))
      .toBe('/static/webhelp/help_wrapper.html');
  });

  it('should end with a qs on matching route change', () => {
    routeStream.write({
      contains: x => x === 'server'
    });

    expect(el.querySelector('a').getAttribute('ng-href'))
    .toBe('/static/webhelp/help_wrapper.html?server_tab.htm');
  });
});
