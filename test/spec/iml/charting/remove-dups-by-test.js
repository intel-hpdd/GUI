import highland from 'highland';
import _ from '@iml/lodash-mixins';
import removeDupsBy from '../../../../source/iml/charting/remove-dups-by.js';

describe('the remove dups plugin', function() {
  let spy;

  beforeEach(() => {
    spy = jest.fn();
  });

  it('should remove dups by a comparator and timestamp', () => {
    highland([
      { ts: 1, x: 1 },
      { ts: 2, x: 3 },
      { ts: 1, x: 2 },
      { ts: 1, x: 1 }
    ])
      .through(removeDupsBy(_.eqProp('x')))
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([
      { ts: 1, x: 1 },
      { ts: 2, x: 3 },
      { ts: 1, x: 2 }
    ]);
  });
});
