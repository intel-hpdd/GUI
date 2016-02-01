import hsmFsModule from
  '../../../../source/iml/hsm/hsm-fs-module';

import λ from 'highland';
import {identity} from 'intel-fp';

describe('hsm fs resolve', () => {
  var socketStream, s, resolveStream, fsCollStream,
    addProperty, $q, $rootScope;

  beforeEach(module(hsmFsModule, ($provide) => {
    s = λ();
    socketStream = jasmine.createSpy('socketStream')
      .and.returnValue(s);
    $provide.value('socketStream', socketStream);

    resolveStream = jasmine.createSpy('resolveStream');
    $provide.value('resolveStream', resolveStream);

    addProperty = jasmine.createSpy('addProperty')
      .and.callFake(identity);

    $provide.value('addProperty', addProperty);
  }));

  beforeEach(inject((_hsmFsCollStream_, _$q_, _$rootScope_) => {
    fsCollStream = _hsmFsCollStream_;
    $q = _$q_;
    $rootScope = _$rootScope_;

    resolveStream.and.returnValue($q.when(s));
  }));

  describe('fsCollStream', () => {
    beforeEach(() => {
      fsCollStream();
      $rootScope.$digest();
    });

    it('should invoke socketStream with a call to filesystem', () => {
      expect(socketStream).toHaveBeenCalledOnceWith('/filesystem', {
        jsonMask: 'objects(id,label,cdt_status,hsm_control_params,locks)'
      });
    });

    it('should resolve the stream', () => {
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });

    it('should send the stream through addProperty', () => {
      expect(addProperty).toHaveBeenCalledOnce();
    });
  });
});
