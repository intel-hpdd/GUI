import highland from 'highland';
import removeDups from '../../../../source/iml/charting/remove-dups.js';

describe('the remove dups plugin', function() {
  let spy;

  beforeEach(() => {
    spy = jest.fn();
  });

  it('should remove dups', function() {
    highland([{ ts: 1 }, { ts: 2 }, { ts: 1 }])
      .through(removeDups)
      .collect()
      .each(spy);

    expect(spy).toHaveBeenCalledOnceWith([{ ts: 1 }, { ts: 2 }]);
  });
});
