import highland from 'highland';

import {
  mock,
  resetAll
} from '../../../system-mock.js';

describe('handle action', () => {
  var socketStream, actionStream, handleAction,
    openConfirmActionModal, openResult;

  beforeEachAsync(async function () {
    jasmine.clock().install();

    socketStream = jasmine.createSpy('socketStream')
      .and.callFake(function () {
        return (actionStream = highland());
      });

    openResult = { resultStream: highland() };
    openConfirmActionModal = jasmine.createSpy('openConfirmActionModal')
      .and.returnValue(openResult);

    const mod = await mock('source/iml/action-dropdown/handle-action.js', {
      'source/iml/socket/socket-stream.js': { default: socketStream }
    });

    handleAction = mod.default(openConfirmActionModal);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  afterEach(resetAll);

  describe('job', function () {
    var record, action;

    beforeEach(function () {
      record = { label: 'foo bar' };

      action = {
        verb: 'foo',
        class_name: 'bar',
        args: { some: 'stuff' },
        confirmation: 'Are you sure you want to foo bar?'
      };
    });

    it('should open the confirm modal if there is confirmation', function () {
      handleAction(record, action);

      expect(openConfirmActionModal)
        .toHaveBeenCalledOnceWith('foo(foo bar)', [ 'Are you sure you want to foo bar?' ]);
    });

    it('should not open the confirm modal without confirmation', function () {
      delete action.confirmation;

      handleAction(record, action);

      expect(openConfirmActionModal).not.toHaveBeenCalled();
    });

    it('should send the job after confirmation', function () {
      handleAction(record, action).each(function () {
        expect(socketStream).toHaveBeenCalledOnceWith('/command', {
          method: 'post',
          json: {
            jobs: [{
              class_name: 'bar',
              args: { some: 'stuff' }
            }],
            message: 'foo(foo bar)'
          }
        }, true);
      });

      openResult
        .resultStream
        .write(true);

      actionStream.write({});
    });

    it('should skip the action result', function () {
      handleAction(record, action)
        .each(function (x) {
          expect(x).toBeUndefined();
        }, true);

      openResult.resultStream.write(true);
      actionStream.write({ foo: 'bar' });
    });

    it('should not skip the action result', function () {
      handleAction(record, action).each(function (x) {
        expect(x).toEqual({ foo: 'bar' });
      }, true);

      openResult.resultStream.write(false);
      actionStream.write({ foo: 'bar' });
    });
  });

  it('should put the new param for conf param', function () {
    var action = {
      param_key: 'some',
      param_value: 'value',
      mdt: {
        resource: 'target',
        id: '1',
        conf_params: {}
      }
    };

    handleAction({}, action);

    expect(socketStream).toHaveBeenCalledOnceWith('/target/1', {
      method: 'put',
      json: {
        resource: 'target',
        id: '1',
        conf_params: {
          some: 'value'
        }
      }
    }, true);
  });

  describe('state change', function () {
    var record, action, stream;

    beforeEach(function () {
      record = { resource_uri: '/api/target/2' };

      action = { state: 'stopped' };

      stream = handleAction(record, action);
    });

    it('should perform a dry run', function () {
      expect(socketStream).toHaveBeenCalledOnceWith(record.resource_uri, {
        method: 'put',
        json: {
          dry_run: true,
          state: 'stopped'
        }
      }, true);
    });

    describe('dry run', function () {
      var response;

      beforeEach(function () {
        response = {
          transition_job: {
            description: 'It\'s gonna do stuff!'
          },
          dependency_jobs: [
            {
              requires_confirmation: true,
              description: 'This will do stuff'
            }
          ]
        };

        actionStream.write(response);
      });

      it('should open the confirm action modal', function () {
        stream.each(function () {
          expect(openConfirmActionModal)
            .toHaveBeenCalledOnceWith('It\'s gonna do stuff!', ['This will do stuff']);
        });

        openResult.resultStream.write(true);

        actionStream.write({});
        jasmine.clock().tick();
      });

      it('should send the new state after confirm', function () {
        stream.each(function () {
          expect(expect(socketStream).toHaveBeenCalledOnceWith('/api/target/2', {
            method: 'put',
            json: { state: 'stopped' }
          }, true));
        });

        openResult.resultStream.write(true);

        actionStream.write({});
        jasmine.clock().tick();
      });
    });
  });
});
