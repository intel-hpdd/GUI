import highland from 'highland';
describe('handle action', () => {
  let mockSocketStream,
    actionStream,
    handleAction,
    openConfirmActionModal,
    openResult;
  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
    mockSocketStream = jest.fn(() => {
      return (actionStream = highland());
    });
    openResult = { resultStream: highland() };
    openConfirmActionModal = jest.fn().mockReturnValue(openResult);
    jest.mock(
      '../../../../source/iml/socket/socket-stream.js',
      () => mockSocketStream
    );

    mod = require('../../../../source/iml/action-dropdown/handle-action.js');
    handleAction = mod.default(openConfirmActionModal);
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    window.angular = null;
  });
  describe('job', () => {
    let record, action;
    beforeEach(() => {
      record = { label: 'foo bar' };
      action = {
        verb: 'foo',
        class_name: 'bar',
        args: { some: 'stuff' },
        confirmation: 'Are you sure you want to foo bar?'
      };
    });
    it('should open the confirm modal if there is confirmation', () => {
      handleAction(record, action);
      expect(openConfirmActionModal).toHaveBeenCalledOnceWith('foo(foo bar)', [
        'Are you sure you want to foo bar?'
      ]);
    });
    it('should not open the confirm modal without confirmation', () => {
      delete action.confirmation;
      handleAction(record, action);
      expect(openConfirmActionModal).not.toHaveBeenCalled();
    });
    it('should send the job after confirmation', () => {
      handleAction(record, action).each(() => {
        expect(mockSocketStream).toHaveBeenCalledOnceWith(
          '/command',
          {
            method: 'post',
            json: {
              jobs: [{ class_name: 'bar', args: { some: 'stuff' } }],
              message: 'foo(foo bar)'
            }
          },
          true
        );
      });
      openResult.resultStream.write(true);
      actionStream.write({});
    });
    it('should skip the action result', () => {
      handleAction(record, action).each(function(x) {
        expect(x).toBeUndefined();
      }, true);
      openResult.resultStream.write(true);
      actionStream.write({ foo: 'bar' });
    });
    it('should not skip the action result', () => {
      handleAction(record, action).each(function(x) {
        expect(x).toEqual({ foo: 'bar' });
      }, true);
      openResult.resultStream.write(false);
      actionStream.write({ foo: 'bar' });
    });
  });
  it('should put the new param for conf param', () => {
    const action = {
      param_key: 'some',
      param_value: 'value',
      mdt: { resource: 'target', id: '1', conf_params: {} }
    };
    handleAction({}, action);
    expect(mockSocketStream).toHaveBeenCalledOnceWith(
      '/target/1',
      {
        method: 'put',
        json: { resource: 'target', id: '1', conf_params: { some: 'value' } }
      },
      true
    );
  });
  describe('state change', () => {
    let record, action, stream;
    beforeEach(() => {
      record = { resource_uri: '/api/target/2' };
      action = { state: 'stopped' };
      stream = handleAction(record, action);
    });
    it('should perform a dry run', () => {
      expect(mockSocketStream).toHaveBeenCalledOnceWith(
        record.resource_uri,
        { method: 'put', json: { dry_run: true, state: 'stopped' } },
        true
      );
    });
    describe('dry run', () => {
      let response;
      beforeEach(() => {
        response = {
          transition_job: { description: "It's gonna do stuff!" },
          dependency_jobs: [
            { requires_confirmation: true, description: 'This will do stuff' }
          ]
        };
        actionStream.write(response);
      });
      it('should open the confirm action modal', () => {
        stream.each(() => {
          expect(
            openConfirmActionModal
          ).toHaveBeenCalledOnceWith("It's gonna do stuff!", [
            'This will do stuff'
          ]);
        });
        openResult.resultStream.write(true);
        actionStream.write({});
        jest.runAllTimers();
      });
      it('should send the new state after confirm', () => {
        stream.each(() => {
          expect(
            expect(mockSocketStream).toHaveBeenCalledOnceWith(
              '/api/target/2',
              { method: 'put', json: { state: 'stopped' } },
              true
            )
          );
        });
        openResult.resultStream.write(true);
        actionStream.write({});
        jest.runAllTimers();
      });
    });
  });
});
