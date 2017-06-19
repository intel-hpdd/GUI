import highland from 'highland';

describe('hsm resolve', () => {
  let s,
    mockResolveStream,
    mockGetCopytoolOperationStream,
    mockGetCopytoolStream,
    copytoolOperationStream,
    copytoolStream,
    $stateParams;

  beforeEach(() => {
    mockResolveStream = jest.fn();
    mockGetCopytoolOperationStream = jest.fn(() => s);
    mockGetCopytoolStream = jest.fn(() => s);

    jest.mock('../../../../source/iml/promise-transforms.js', () => ({
      resolveStream: mockResolveStream
    }));
    jest.mock(
      '../../../../source/iml/hsm/get-copytool-operation-stream.js',
      () => mockGetCopytoolOperationStream
    );
    jest.mock(
      '../../../../source/iml/hsm/get-copytool-stream.js',
      () => mockGetCopytoolStream
    );

    const mod = require('../../../../source/iml/hsm/hsm-resolves.js');

    s = highland();

    $stateParams = {
      fsId: 1
    };

    copytoolOperationStream = mod.copytoolOperationStream.bind(
      null,
      $stateParams
    );
    copytoolStream = mod.copytoolStream.bind(null, $stateParams);
  });

  describe('copytoolOperationStream', () => {
    describe('with fsId', () => {
      beforeEach(() => {
        copytoolOperationStream();
      });

      it('should invoke getCopytoolOperationStream with the fsId', () => {
        expect(mockGetCopytoolOperationStream).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: 1
          }
        });
      });
    });

    describe('without fsId', () => {
      beforeEach(() => {
        $stateParams.fsId = '';
        copytoolOperationStream();
      });

      it('should invoke getCopytoolOperationStream with an empty object', () => {
        expect(mockGetCopytoolOperationStream).toHaveBeenCalledOnceWith({});
      });
    });

    it('should invoke resolveStream with the stream', () => {
      copytoolOperationStream();
      expect(mockResolveStream).toHaveBeenCalledOnceWith(s);
    });
  });

  describe('copytoolStream', () => {
    describe('with fsId', () => {
      beforeEach(() => {
        copytoolStream();
      });

      it('should invoke getCopytoolOperationStream with the fsId', () => {
        expect(mockGetCopytoolStream).toHaveBeenCalledOnceWith({
          qs: {
            filesystem_id: 1
          }
        });
      });
    });

    describe('without fsId', () => {
      beforeEach(() => {
        $stateParams.fsId = '';
        copytoolStream();
      });

      it('should invoke getCopytoolOperationStream with an empty object', () => {
        expect(mockGetCopytoolStream).toHaveBeenCalledOnceWith({});
      });
    });

    it('should invoke resolveStream with the stream', () => {
      copytoolStream();
      expect(mockResolveStream).toHaveBeenCalledOnceWith(s);
    });
  });
});
