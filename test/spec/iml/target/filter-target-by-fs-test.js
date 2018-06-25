import highland from 'highland';
import filterTargetByFs from '../../../../source/iml/target/filter-target-by-fs.js';

describe('filter target by fs', () => {
  let data;

  beforeEach(() => {
    data = [
      [
        {
          target: 'foo',
          filesystems: [
            {
              id: 1
            }
          ]
        },
        {
          target: 'bar',
          filesystems: [
            {
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
  });

  it('should return the targets with the matching fs', function() {
    let result;

    highland(data)
      .through(filterTargetByFs(1))
      .each(function(x) {
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

  it('should return nothing if id does not match', function() {
    const result = filterTargetByFs('4')(data);

    expect(result).toEqual([[]]);
  });
});
