import angular from 'angular';
const {module, inject} = angular.mock;

describe('the sort by date plugin', function () {
  'use strict';

  beforeEach(module('charting'));

  var sortByDate, spy;

  beforeEach(inject(function (_sortByDate_) {
    sortByDate = _sortByDate_;
    spy = jasmine.createSpy('spy');
  }));

  it('should sort items by date', function () {
    highland([
      { ts: '2015-05-10T23:51:50.000Z' },
      { ts: '2015-05-10T23:50:50.000Z' }
    ])
      .through(sortByDate)
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      { ts: '2015-05-10T23:50:50.000Z' },
      { ts: '2015-05-10T23:51:50.000Z' }
    ]);
  });
});
