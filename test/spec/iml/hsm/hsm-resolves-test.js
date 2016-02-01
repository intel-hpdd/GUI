import hsmModule from '../../../../source/iml/hsm/hsm-module';
import highland from 'highland';

describe('hsm resolve', () => {
  var s, resolveStream, getCopytoolOperationStream,
    getCopytoolStream, copytoolOperationStream, copytoolStream,
    $route;

  beforeEach(module(hsmModule, ($provide) => {
    s = highland();

    resolveStream = jasmine.createSpy('resolveStream');
    $provide.value('resolveStream', resolveStream);

    getCopytoolOperationStream = jasmine.createSpy('getCopytoolOperationStream');
    $provide.value('getCopytoolOperationStream', getCopytoolOperationStream);

    getCopytoolStream = jasmine.createSpy('getCopytoolStream');
    $provide.value('getCopytoolStream', getCopytoolStream);

    $route = {
      current: {
        params: {
          fsId: 1
        }
      }
    };

    $provide.value('$route', $route);
  }));

  beforeEach(inject((_copytoolOperationStream_, _copytoolStream_) => {
    copytoolOperationStream = _copytoolOperationStream_;
    copytoolStream = _copytoolStream_;
  }));

  describe('copytoolOperationStream', () => {
    beforeEach(() => {
      getCopytoolOperationStream.and.returnValue(s);
    });

    describe('with fsId', () => {
      beforeEach(() => {
        copytoolOperationStream();
      });

      it('should invoke getCopytoolOperationStream with the fsId', () => {
        expect(getCopytoolOperationStream).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: 1
          }
        });
      });
    });

    describe('without fsId', () => {
      beforeEach(() => {
        $route.current = null;
        copytoolOperationStream();
      });

      it('should invoke getCopytoolOperationStream with an empty object', () => {
        expect(getCopytoolOperationStream).toHaveBeenCalledOnceWith({});
      });
    });

    it('should invoke resolveStream with the stream', () => {
      copytoolOperationStream();
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });
  });

  describe('copytoolStream', () => {
    beforeEach(() => {
      getCopytoolStream.and.returnValue(s);
    });

    describe('with fsId', () => {
      beforeEach(() => {
        copytoolStream();
      });

      it('should invoke getCopytoolOperationStream with the fsId', () => {
        expect(getCopytoolStream).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: 1
          }
        });
      });
    });

    describe('without fsId', () => {
      beforeEach(() => {
        $route.current = null;
        copytoolStream();
      });

      it('should invoke getCopytoolOperationStream with an empty object', () => {
        expect(getCopytoolStream).toHaveBeenCalledOnceWith({});
      });
    });

    it('should invoke resolveStream with the stream', () => {
      copytoolStream();
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });
  });
});
