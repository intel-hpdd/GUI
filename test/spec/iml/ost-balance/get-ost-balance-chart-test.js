describe('get ost balance chart', function () {
  'use strict';

  var getOstBalanceStream, ostBalanceStream, streams,
    resolveStream, chartCompiler, getTemplatePromise;

  beforeEach(module('ostBalance', function ($provide) {
    getTemplatePromise = jasmine
      .createSpy('getTemplatePromise')
      .andReturn('<table></table>');

    $provide.value('getTemplatePromise', getTemplatePromise);

    resolveStream = jasmine
      .createSpy('resolveStream')
      .andCallFake(_.identity);

    $provide.value('resolveStream', resolveStream);

    streams = [];

    getOstBalanceStream = jasmine.createSpy('getOstBalanceStream')
      .andCallFake(function () {
        ostBalanceStream = highland();
        spyOn(ostBalanceStream, 'destroy');
        streams.push(ostBalanceStream);
        return ostBalanceStream;
      });

    $provide.value('getOstBalanceStream', getOstBalanceStream);

    chartCompiler = jasmine.createSpy('chartCompiler');

    $provide.value('chartCompiler', chartCompiler);
  }));

  var ostBalanceChart, getOstBalanceChart, chart;

  beforeEach(inject(function (_getOstBalanceChart_) {
    getOstBalanceChart = _getOstBalanceChart_;
    ostBalanceChart = getOstBalanceChart({
      qs: {
        filesystem_id: '1'
      }
    });

    chart = chartCompiler.mostRecentCall.args[1];
  }));

  it('should return a factory function', function () {
    expect(getOstBalanceChart).toEqual(jasmine.any(Function));
  });

  it('should setup the OstBalanceChart', function () {
    expect(chartCompiler)
      .toHaveBeenCalledOnceWith('iml/ost-balance/assets/html/ost-balance.html', {
        configure: false,
        percentage: 0,
        stream: ostBalanceStream,
        tooltipTemplate: '<table></table>',
        onSubmit: jasmine.any(Function),
        onCancel: jasmine.any(Function),
        onConfigure: jasmine.any(Function),
        onDestroy: jasmine.any(Function),
        options: {
          setup: jasmine.any(Function)
        }
      });
  });

  it('should destroy the stream on destroy', function () {
    chart.onDestroy();

    expect(ostBalanceStream.destroy).toHaveBeenCalledOnce();
  });

  it('should set configure to false on cancel', function () {
    chart.onCancel();

    expect(chart.configure).toBe(false);
  });

  it('should set configure to true on configure', function () {
    chart.onConfigure();

    expect(chart.configure).toBe(true);
  });

  describe('on submit', function () {
    beforeEach(function () {
      chart.percentage = 10;
      chart.onSubmit();
    });

    it('should create a new stream', function () {
      expect(getOstBalanceStream)
        .toHaveBeenCalledOnceWith(10, {
          qs: {
            filesystem_id: '1'
          }
        });
    });

    it('should destroy the existing stream', function () {
      expect(streams[0].destroy).toHaveBeenCalledOnce();
    });
  });

  describe('setup', function () {
    var d3Chart, d3, formatter;

    beforeEach(function () {
      d3Chart = {
        forceY: jasmine.createSpy('forceY'),
        stacked: jasmine.createSpy('stacked'),
        yAxis: {
          tickFormat: jasmine.createSpy('tickFormat')
        },
        showXAxis: jasmine.createSpy('showXAxis'),
        tooltip: {
          contentGenerator: jasmine.createSpy('contentGenerator')
        }
      };

      formatter = {};

      d3 = {
        format: jasmine.createSpy('format').andReturn(formatter)
      };

      chart.options.setup(d3Chart, d3);
    });

    it('should force Y', function () {
      expect(d3Chart.forceY).toHaveBeenCalledOnceWith([0, 1]);
    });

    it('should set to stacked', function () {
      expect(d3Chart.stacked).toHaveBeenCalledOnceWith(true);
    });

    it('should set tick format on the Y axis', function () {
      expect(d3Chart.yAxis.tickFormat).toHaveBeenCalledOnceWith(formatter);
    });

    it('should generate tooltip content', function () {
      expect(d3Chart.tooltip.contentGenerator)
        .toHaveBeenCalledOnceWith(jasmine.any(Function));
    });
  });
});
