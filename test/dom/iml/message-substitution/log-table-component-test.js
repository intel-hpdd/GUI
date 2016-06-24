import logModule from '../../../../source/iml/logs/log-module.js';

import highland from 'highland';

describe('log table component', () => {
  var $scope, template, el, log$;

  beforeEach(module(logModule));

  beforeEach(inject(($rootScope, $compile) => {
    log$ = highland();
    $scope = $rootScope.$new();
    $scope.log$ = log$;
    template = '<log-table log$="::log$"></log-table>';
    el = $compile(template)($scope)[0];
    document.body.appendChild(el);
    $scope.$digest();
  }));

  var table, dateField, fqdnLink, fqdnSpan, fqdnRestricted, tag, message, messageLink;
  beforeEach(() => {
    log$.write(
      {
        meta: {
          total_count: 1
        },
        objects: [
          {
            resource_uri: '/api/host/1/',
            datetime: new Date('2015-05-05 00:00:00Z'),
            host_id: 1,
            fqdn: 'test001.localdomain',
            tag: 'cluster_sim',
            message: 'Lustre: Cluster simulator syslog session start test001.localdomain 2016-06-24 14:53:33.208454',
            substitutions: [
              {
                start: 48,
                end: 67,
                resource_uri: '/api/host/1',
                label: 'test001.localdomain'
              }
            ]
          }
        ]
      }
    );

    table = el.querySelector.bind(el, 'table');
    dateField = el.querySelector.bind(el, 'table tr td:nth-of-type(1) span');
    fqdnLink = el.querySelector.bind(el, 'table tr td:nth-of-type(2) a');
    fqdnSpan = el.querySelector.bind(el, 'table tr td:nth-of-type(2) span');
    fqdnRestricted = el.querySelector.bind(el, 'table tr td.invisible:nth-of-type(3)');
    tag = el.querySelector.bind(el, 'table tr td:nth-of-type(4)');
    message = el.querySelector.bind(el, 'table tr td:nth-of-type(5)');
    messageLink = el.querySelector.bind(el, 'table tr td:nth-of-type(5) a');
  });

  afterEach(() => log$.destroy());

  it('should contain a table', () => {
    expect(table()).not.toBeNull();
  });

  it('should contain a date in the first column', () => {
    expect(dateField().textContent.trim()).toEqual('2015-05-05 00:00:00');
  });

  it('should link to the fqdn in the second column', () => {
    expect(fqdnLink().getAttribute('route-to')).toEqual('configure/server/1');
  });

  it('should display the fqdn label in the second column', () => {
    expect(fqdnLink().textContent.trim()).toEqual('test001.localdomain');
  });

  it('should not display the fqdn span in the second column', () => {
    expect(fqdnSpan()).toBeNull();
  });

  it('should set the restricted fqdn to be invisible in the third column', () => {
    expect(fqdnRestricted().textContent.trim()).toEqual('test001.localdomain');
  });

  it('should display the tag in the fourth column', () => {
    expect(tag().textContent.trim()).toEqual('cluster_sim');
  });

  it('should display the message in the fifth column', () => {
    expect(message().textContent.trim()).toEqual('Lustre: Cluster simulator syslog session start test001.localdomain'
      + ' 2016-06-24 14:53:33.208454');
  });

  it('should link to the fqdn in the message column', () => {
    expect(messageLink().getAttribute('href')).toEqual('configure/server/1/');
  });
});
