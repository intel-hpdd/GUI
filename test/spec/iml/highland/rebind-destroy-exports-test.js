import {__, identity} from 'intel-fp/fp';
import λ from 'highland';

import rebindDestroy from
  '../../../../source/chroma_ui/iml/highland/rebind-destroy-exports';

describe('rebind destroy', function () {
  var s, s2, throughSpy, destroySpy;

  beforeEach(() => {
    throughSpy = jasmine.createSpy('throughSpy')
      .andCallFake(identity);
    destroySpy = jasmine.createSpy('destroySpy');
    s = λ();
    s._destructors.push(destroySpy);
    s2 = rebindDestroy(throughSpy, s);
  });

  it('should be curried', () => {
    expect(rebindDestroy(__, __)).toEqual(jasmine.any(Function));
  });

  it('should destroy the original stream', () => {
    s2.destroy();

    expect(destroySpy)
      .toHaveBeenCalledOnceWith();
  });

  it('should call throughSpy', () => {
    expect(throughSpy)
      .toHaveBeenCalledOnceWith(s);
  });
});
