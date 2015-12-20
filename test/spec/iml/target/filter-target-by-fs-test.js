import angular from 'angular';
const {module, inject} = angular.mock;

describe('filter target by fs', function () {
  'use strict';

  beforeEach(module('target'));

  var filterTargetByFs, data;

  beforeEach(inject(function (_filterTargetByFs_) {
    filterTargetByFs = _filterTargetByFs_;

    data = [
      [
        {
          target: 'foo',
          filesystems: [{
            id: 1
          }
          ]
        },
        {
          target: 'bar',
          filesystems: [{
            id: 2
          }
          ]
        },
        {
          target: 'baz',
          filesystem_id: 1
        }
      ]
    ];
  }));

  it('should return the targets with the matching fs', function () {
    var result;

    highland(data)
      .through(filterTargetByFs('1'))
      .each(function (x) {
        result = x;
      });

    expect(result).toEqual([
      {
        target: 'foo',
        filesystems: [
          {
            id: 1
          }
        ]
      },
      {
        target: 'baz',
        filesystem_id: 1
      }
    ]);
  });

  it('should return nothing if id does not match', function () {
    var result = filterTargetByFs('4')(data);

    expect(result).toEqual([[]]);
  });
});
