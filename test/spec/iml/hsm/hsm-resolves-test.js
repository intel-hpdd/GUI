describe('hsm fs resolve', function () {

  var s, resolveStream, getCopytoolOperationStream, getCopytoolStream, copytoolOperationStream, copytoolStream,
    $route;

  beforeEach(module('hsm', function ($provide) {
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

  beforeEach(inject(function (_copytoolOperationStream_, _copytoolStream_) {
    copytoolOperationStream = _copytoolOperationStream_;
    copytoolStream = _copytoolStream_;
  }));

  describe('copytoolOperationStream', function () {
    beforeEach(function () {
      getCopytoolOperationStream.andReturn(s);
    });

    describe('with fsId', function () {
      beforeEach(function () {
        copytoolOperationStream();
      });

      it('should invoke getCopytoolOperationStream with the fsId', function () {
        expect(getCopytoolOperationStream).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: 1
          }
        });
      });
    });

    describe('without fsId', function () {
      beforeEach(function () {
        $route.current = null;
        copytoolOperationStream();
      });

      it('should invoke getCopytoolOperationStream with an empty object', function () {
        expect(getCopytoolOperationStream).toHaveBeenCalledOnceWith({});
      });
    });

    it('should invoke resolveStream with the stream', function () {
      copytoolOperationStream();
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });
  });

  describe('copytoolStream', function () {
    beforeEach(function () {
      getCopytoolStream.andReturn(s);
    });

    describe('with fsId', function () {
      beforeEach(function () {
        copytoolStream();
      });

      it('should invoke getCopytoolOperationStream with the fsId', function () {
        expect(getCopytoolStream).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: 1
          }
        });
      });
    });

    describe('without fsId', function () {
      beforeEach(function () {
        $route.current = null;
        copytoolStream();
      });

      it('should invoke getCopytoolOperationStream with an empty object', function () {
        expect(getCopytoolStream).toHaveBeenCalledOnceWith({});
      });
    });

    it('should invoke resolveStream with the stream', function () {
      copytoolStream();
      expect(resolveStream).toHaveBeenCalledOnceWith(s);
    });
  });

});
