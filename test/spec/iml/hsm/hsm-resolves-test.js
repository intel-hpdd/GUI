import highland from 'highland';

import { mock, resetAll } from '../../../system-mock.js';

describe('hsm resolve', () => {
  let s,
    resolveStream,
    getCopytoolOperationStream,
    getCopytoolStream,
    copytoolOperationStream,
    copytoolStream,
    $stateParams;

  beforeEachAsync(async function() {
    resolveStream = jasmine.createSpy('resolveStream');

    getCopytoolOperationStream = jasmine.createSpy(
      'getCopytoolOperationStream'
    );
    getCopytoolStream = jasmine.createSpy('getCopytoolStream');

    const mod = await mock('source/iml/hsm/hsm-resolves.js', {
      'source/iml/promise-transforms.js': { resolveStream },
      'source/iml/hsm/get-copytool-operation-stream.js': {
        default: getCopytoolOperationStream
      },
      'source/iml/hsm/get-copytool-stream.js': { default: getCopytoolStream }
    });

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

  afterEach(resetAll);

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
        $stateParams.fsId = '';
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
        $stateParams.fsId = '';
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
